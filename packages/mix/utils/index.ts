import type { Directive } from 'vue'

export * from './constant'

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
