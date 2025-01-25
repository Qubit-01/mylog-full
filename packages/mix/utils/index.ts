import type { Directive } from 'vue'

export * from './constant'
export * from './cos'

/**
 * 超出省略号，传入行数，默认一行，0就啥都不干
 * @param el
 * @param param1
 */
export const vEllipsis: Directive = (el, { value = 1 }) => {
  if (value === 0) {
    // 删除样式
    el.classList.remove('-overflow-ellipsis-s', '-overflow-ellipsis-m')
    el.style.webkitLineClamp = 'revert'
  } else if (value === 1) {
    el.classList.add('-overflow-ellipsis-s')
    el.classList.remove('-overflow-ellipsis-m')
    el.style.webkitLineClamp = 'revert'
  } else {
    el.classList.remove('-overflow-ellipsis-s')
    el.classList.add('-overflow-ellipsis-m')
    el.style.webkitLineClamp = value
  }
}

/**
 * 通过图片地址，给img设置不同的属性
 * QQ图片需要设置referrerPolicy
 * @param value 图片地址
 */
export const vImgSrc: Directive = (el, { value }) => {
  el.setAttribute('src', value)
  // 判断QQ图片
  if (value.includes('.qq.com/') || value.includes('.qpic.cn/')) {
    el.setAttribute('referrerPolicy', 'no-referrer')
    if (!el.getAttribute('alt')) el.setAttribute('alt', 'QQ空间图片')
  } else {
    if (!el.getAttribute('alt')) el.setAttribute('alt', value.split('/').at(-1))
  }
}

/**
 * 取消双击后选中文本的默认事件，正常执行回调
 * @param value 双击的事件
 */
export const vDblclick: Directive = (el: HTMLDivElement, { value }) => {
  // 去除双击选中文本
  el.addEventListener('mousedown', e => {
    // detail 是短时间连击次数
    if (e.detail > 1) e.preventDefault()
  })

  el.addEventListener('dblclick', value)
}

/**
 * 深层次合并对象
 * @param target
 * @param source
 * @returns
 * @deprecated
 */
export function deepMerge(
  target: { [attrName: string]: any },
  source: { [attrName: string]: any }
) {
  for (const key in source) {
    if (source[key] instanceof Object) {
      if (!target[key]) Object.assign(target, { [key]: {} })
      deepMerge(target[key], source[key])
    } else {
      Object.assign(target, { [key]: source[key] })
    }
  }
  return target
}

/**
 * 使用递归的方式实现数组、对象的深拷贝
 * 有bug，不会复制对象的原型链，只会复制对象自身的属性
 * 用在dayjs上然后JSON转换会出错
 * @param obj 拷贝的对象
 * @returns 深拷贝后的对象
 * @deprecated
 */
export function clone<T>(obj: T): T {
  const newObj: any = Array.isArray(obj) ? [] : {}

  if (obj && typeof obj === 'object') {
    for (const k in obj) {
      if (obj.hasOwnProperty(k)) {
        //判断ojb子元素是否为对象，如果是，递归复制
        if (obj[k] && typeof obj[k] === 'object') newObj[k] = clone(obj[k])
        //如果不是，简单复制
        else newObj[k] = obj[k]
      }
    }
  }

  return newObj
}

// 获取链接后的参数(不带#号)
// export function getQueryString() {
//   let href = window.location.href
//   let hash = href.slice(href.lastIndexOf('#') + 1, href.length), i
//   let a = {}
//   for (const s of hash.split('&')) a[s.split('=')[0]] = s.split('=')[1]
//   return a;
// }

// 给一个元素id，滚动条跳转
export function goAnchor(e: string) {
  const el = document.querySelector('#' + e)
  if (el)
    el.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
    })
}

// 获取URL参数
// export function getQueryAttr(variable: string) {
//   let vars = window.location.href.substring(window.location.href.indexOf("?") + 1).split("&");
//   for (const value of vars) {
//     if (value.split("=")[0] == variable) return value.split("=")[1];
//   }
//   return undefined
// }

// 将字符串传入剪贴板
export function writeClipboard(str: string): Promise<void> {
  const clipboardObj = navigator.clipboard
  if (!clipboardObj) return Promise.reject('浏览器不支持 navigator.clipboard')
  return clipboardObj.writeText(str)
}

/**
 * Base64 编码
 * @param str
 */
export function Encode64(str: string) {
  // 编码
  return btoa(
    encodeURIComponent(str).replace(
      /%([0-9A-F]{2})/g,
      function toSolidBytes(match, p1) {
        // @ts-ignore
        return String.fromCharCode('0x' + p1)
      }
    )
  )
}

/**
 * Base64 解码
 * @param str
 * @returns
 */
export function Decode64(str: string) {
  // 解码
  return decodeURIComponent(
    atob(str)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      })
      .join('')
  )
}

/**
 * 通过Url获取Blob文件
 * @param url 文件链接
 * @returns Blob数据
 */
export const getBlob = (url: string): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.responseType = 'blob'
    xhr.onload = () => {
      if (xhr.status === 200) resolve(xhr.response)
      else reject(xhr)
    }
    xhr.send()
  })
}

/**
 * 将Blob文件重命名保存
 */
export const saveAs = (blob: Blob, filename: string) => {
  const link = document.createElement('a')
  link.href = window.URL.createObjectURL(blob)
  link.download = filename
  link.click()
}

/**
 * 通过url下载文件并重命名（不推荐使用此方法）
 * 这里的实现是先在内存下载，然后再保存到本地
 * @param url 文件Url
 * @param filename 文件重命名
 */
export const downloadFile = (url: string, filename?: string) => {
  if (!filename) filename = url.substring(url.lastIndexOf('/') + 1)
  getBlob(url).then(blob => {
    saveAs(blob, filename!)
  })
}

/**
 * 通过A标签实现文件当前页面下载，但是当文件url跨域时，filename会失效
 * @param url 文件路径
 * @param filename 文件名
 */
export const downloadFileByA = (url: string, filename?: string) => {
  const a = document.createElement('a')
  a.style.display = 'none'
  a.href = url // 设置下载地址
  a.download = filename || url.substring(url.lastIndexOf('/') + 1) // 设置文件名
  // 使用target="_blank"时，添加rel="noopener noreferrer" 堵住钓鱼安全漏洞 防止新页面window指向之前的页面
  // a.rel = 'noopener noreferrer'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)

  setTimeout(() => {
    a.remove()
  }, 1000)
}
