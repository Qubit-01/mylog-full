<script lang="ts" setup>
import { Shader, texture } from './test'

const length = (x: number, y: number) => Math.sqrt(x * x + y * y)

const roundedRectSDF = (
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) => {
  const qx = Math.abs(x) - width + radius
  const qy = Math.abs(y) - height + radius
  return (
    Math.min(Math.max(qx, qy), 0) +
    length(Math.max(qx, 0), Math.max(qy, 0)) -
    radius
  )
}

// Utility functions
const smoothStep = (a: number, b: number, t: number) => {
  t = Math.max(0, Math.min(1, (t - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

onMounted(() => {
  // Create shader
  const shader = new Shader({
    width: 300,
    height: 200,
    fragment: (uv) => {
      const ix = uv.x - 0.5
      const iy = uv.y - 0.5
      const distanceToEdge = roundedRectSDF(ix, iy, 0.3, 0.2, 0.6)
      const displacement = smoothStep(0.8, 0, distanceToEdge - 0.15)
      const scaled = smoothStep(0, 1, displacement)
      return texture(ix * scaled + 0.5, iy * scaled + 0.5)
    },
  })
  shader.appendTo(document.body)
})
</script>

<template>
  <div class="LiquidGlass">
    <div class="container"></div>

    <svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" class="svg">
      <defs>
        <filter
          id="lsq_filter"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
          x="0"
          y="0"
          width="100"
          height="100"
        >
          <feImage id="lsq_map" width="100" height="100" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="lsq_map"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>

    <canvas width="100" height="100" style="display: none"> </canvas>
  </div>
</template>

<style lang="scss" scoped>
.LiquidGlass {
  .container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100px;
    height: 100px;
    overflow: hidden;
    border-radius: 32px;
    box-shadow:
      0 4px 8px rgba(0, 0, 0, 0.25),
      0 -10px 25px inset rgba(0, 0, 0, 0.15);
    cursor: grab;
    backdrop-filter: url(#lsq_filter) blur(0.25px) contrast(1.2)
      brightness(1.05) saturate(1.1);
    z-index: 9999;
    pointer-events: auto;
  }

  .svg {
    position: fixed;
    top: 0;
    left: 0;
    pointer-events: none;
    z-index: 9998;
  }
}
</style>
