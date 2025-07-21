type Fragment = (
  uv: { x: number; y: number },
  mouse: { x: number; y: number },
) => any

export const texture = (x: number, y: number) => ({ type: 't', x, y })

// Generate unique ID
const generateId = () =>
  'liquid-glass-' + Math.random().toString(36).slice(2, 11)

// Main Shader class
export class Shader {
  width: number
  height: number
  fragment: Fragment
  canvasDPI: number
  id: string
  offset: number
  mouse: { x: number; y: number }
  mouseUsed: boolean

  container: HTMLDivElement
  svg: SVGElement
  feImage?: SVGElement
  feDisplacementMap: SVGElement
  canvas: HTMLCanvasElement
  context?: CanvasRenderingContext2D | null

  // 1
  constructor(options: { width: number; height: number; fragment: Fragment }) {
    /** 元素的宽度 */
    this.width = options.width || 100
    /** 元素的高度 */
    this.height = options.height || 100
    /** 片段着色器函数 */
    this.fragment = options.fragment || ((uv) => texture(uv.x, uv.y))
    /** 画布的DPI */
    this.canvasDPI = 1
    /** 生成的唯一ID */
    this.id = generateId()
    /** 边界偏移量 Viewport boundary offset */
    this.offset = 10

    /** 鼠标位置 */
    this.mouse = { x: 0, y: 0 }
    /** 是否使用了鼠标位置 */
    this.mouseUsed = false

    // Create container for shader ===============
    this.container = document.createElement('div')

    this.container.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: ${this.width}px;
        height: ${this.height}px;
        overflow: hidden;
        border-radius: 150px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25), 0 -10px 25px inset rgba(0, 0, 0, 0.15);
        backdrop-filter: url(#${this.id}_filter) blur(0.25px) contrast(1.2) brightness(1.05) saturate(1.1);
        cursor: grab;
        z-index: 9999;
        pointer-events: auto;
      `

    // Create SVG filter
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    this.svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    this.svg.setAttribute('width', '0')
    this.svg.setAttribute('height', '0')
    this.svg.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        pointer-events: none;
        z-index: 9998;
      `

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
    const filter = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'filter',
    )
    filter.setAttribute('id', `${this.id}_filter`)
    filter.setAttribute('filterUnits', 'userSpaceOnUse')
    filter.setAttribute('colorInterpolationFilters', 'sRGB')
    filter.setAttribute('x', '0')
    filter.setAttribute('y', '0')
    filter.setAttribute('width', this.width.toString())
    filter.setAttribute('height', this.height.toString())

    this.feImage = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'feImage',
    )
    this.feImage.setAttribute('id', `${this.id}_map`)
    this.feImage.setAttribute('width', this.width.toString())
    this.feImage.setAttribute('height', this.height.toString())

    this.feDisplacementMap = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'feDisplacementMap',
    )
    this.feDisplacementMap.setAttribute('in', 'SourceGraphic')
    this.feDisplacementMap.setAttribute('in2', `${this.id}_map`)
    this.feDisplacementMap.setAttribute('xChannelSelector', 'R')
    this.feDisplacementMap.setAttribute('yChannelSelector', 'G')

    filter.appendChild(this.feImage)
    filter.appendChild(this.feDisplacementMap)
    defs.appendChild(filter)
    this.svg.appendChild(defs)

    // Create canvas for displacement map (hidden)
    this.canvas = document.createElement('canvas')
    this.canvas.width = this.width * this.canvasDPI
    this.canvas.height = this.height * this.canvasDPI
    this.canvas.style.display = 'none'

    this.context = this.canvas.getContext('2d')

    // setupEventListeners ===============
    let isDragging = false
    let startX: number, startY: number, initialX: number, initialY: number

    this.container.addEventListener('mousedown', (e) => {
      isDragging = true
      this.container.style.cursor = 'grabbing'
      startX = e.clientX
      startY = e.clientY
      const rect = this.container.getBoundingClientRect()
      initialX = rect.left
      initialY = rect.top
      e.preventDefault()
    })

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const deltaX = e.clientX - startX
        const deltaY = e.clientY - startY

        // Calculate new position
        const newX = initialX + deltaX
        const newY = initialY + deltaY

        // Constrain position within viewport bounds
        const constrained = this.constrainPosition(newX, newY)

        this.container.style.left = constrained.x + 'px'
        this.container.style.top = constrained.y + 'px'
        this.container.style.transform = 'none'
      }

      // Update mouse position for shader
      const rect = this.container.getBoundingClientRect()
      this.mouse.x = (e.clientX - rect.left) / rect.width
      this.mouse.y = (e.clientY - rect.top) / rect.height

      if (this.mouseUsed) this.updateShader()
    })

    document.addEventListener('mouseup', () => {
      isDragging = false
      this.container.style.cursor = 'grab'
    })

    // Handle window resize to maintain constraints
    window.addEventListener('resize', () => {
      const rect = this.container.getBoundingClientRect()
      const constrained = this.constrainPosition(rect.left, rect.top)

      if (rect.left !== constrained.x || rect.top !== constrained.y) {
        this.container.style.left = constrained.x + 'px'
        this.container.style.top = constrained.y + 'px'
        this.container.style.transform = 'none'
      }
    })

    this.updateShader()
  }

  // 2
  updateShader() {
    const mouseProxy = new Proxy(this.mouse, {
      get: (target, prop: 'x' | 'y') => {
        this.mouseUsed = true
        return target[prop]
      },
    })

    this.mouseUsed = false

    const w = this.width * this.canvasDPI
    const h = this.height * this.canvasDPI
    const data = new Uint8ClampedArray(w * h * 4)

    let maxScale = 0
    const rawValues = []

    for (let i = 0; i < data.length; i += 4) {
      const x = (i / 4) % w
      const y = Math.floor(i / 4 / w)
      const pos = this.fragment({ x: x / w, y: y / h }, mouseProxy)
      const dx = pos.x * w - x
      const dy = pos.y * h - y
      maxScale = Math.max(maxScale, Math.abs(dx), Math.abs(dy))
      rawValues.push(dx, dy)
    }

    maxScale *= 0.5

    let index = 0
    for (let i = 0; i < data.length; i += 4) {
      const r = rawValues[index++] / maxScale + 0.5
      const g = rawValues[index++] / maxScale + 0.5
      data[i] = r * 255
      data[i + 1] = g * 255
      data[i + 2] = 0
      data[i + 3] = 255
    }



    

    this.context?.putImageData(new ImageData(data, w, h), 0, 0)
    this.feImage?.setAttributeNS(
      'http://www.w3.org/1999/xlink',
      'href',
      this.canvas.toDataURL(),
    )
    this.feDisplacementMap.setAttribute(
      'scale',
      (maxScale / this.canvasDPI).toString(),
    )
  }

  // 拖动时执行
  constrainPosition(x: number, y: number) {
    console.log('LSQ> constrainPosition')

    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    // Calculate boundaries with offset
    const minX = this.offset
    const maxX = viewportWidth - this.width - this.offset
    const minY = this.offset
    const maxY = viewportHeight - this.height - this.offset

    // Constrain position
    const constrainedX = Math.max(minX, Math.min(maxX, x))
    const constrainedY = Math.max(minY, Math.min(maxY, y))

    return { x: constrainedX, y: constrainedY }
  }

  appendTo(parent: HTMLElement) {
    parent.appendChild(this.svg)
    parent.appendChild(this.container)
  }

  destroy() {
    this.svg.remove()
    this.container.remove()
    this.canvas.remove()
  }
}
