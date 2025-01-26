<!-- 
  如果传入props.imgs，优先用，没传就用父组件注入的log.imgs
  如果是 用户log 就要有要有查看原图的功能，但是爬虫数据不需要查看原图功能

  主要用到 viewerjs， 相关文档：
  https://blog.csdn.net/xingmeiok/article/details/127556464
 -->
<script lang="tsx" setup>
import type { LogVO as Log } from '@mylog-full/mix/types'
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'
import { toFileUrl, vImgSrc, vErrorRetry } from '@mylog-full/mix/utils'

/** imgs是图片列表 */
const props = defineProps<{ imgs?: string[] }>()
// 从父组件拿到log，主要是获取userId
const log: Log = inject('log')!
// props.imgs > log.imgs
const imgs = computed(() => props.imgs ?? log.imgs)
// 传入的图片转为正常的url
const imgUrls = ref<string[]>(
  toFileUrl(imgs.value, 'compress-imgs/', log.userid!.toString()),
)

let viewer: Viewer | null = null // viewerjs对象
const viewerDom = useTemplateRef('viewerDom') // 用于装载用ref属性获取的Dom
const rawBtuDom = useTemplateRef('rawBtuDom') // 查看原图按钮的DOM

onMounted(() => {
  if (!viewerDom.value) return
  // 3句话，让viewer为我打工
  viewer = new Viewer(viewerDom.value, {
    // button: false, //右上角关闭按钮
    // title: false, // 图片标题
    shown() {
      // todo 只有cos图才能查看原图
      // 大图展示时，加入查看原图按钮，toolbar 只有在shown时才有
      ;(viewer as any)!.toolbar.querySelector('ul').appendChild(rawBtuDom.value)
    },
  })
})

watch(imgs, () => {
  imgUrls.value = toFileUrl(
    imgs.value,
    'compress-imgs/',
    log.userid!.toString(),
  )
  nextTick(() => viewer?.update())
})

// 点击加载原图
const loadRaw = () => {
  const i = (viewer as any).index
  const newImg = toFileUrl(imgs.value[i], 'imgs/', log.userid!.toString())
  if (imgUrls.value[i] !== newImg) {
    imgUrls.value[i] = newImg
    nextTick(() => viewer!.update()) // .view(i)
  }
}
</script>

<template>
  <div class="viewer-imgs" ref="viewerDom" @click.stop>
    <img v-for="img in imgUrls" :key="img" v-img-src="img" v-error-retry />
    <!-- 要插入viewer中的查看原图按钮，不会再页面中展示 -->
    <li ref="rawBtuDom" class="viewer-raw" @click="loadRaw">查看原图</li>
  </div>
</template>

<style lang="scss" scoped>
.viewer-imgs {
  white-space: nowrap;
  overflow-y: hidden;
  width: fit-content;
  max-width: 100%;

  display: flex;
  gap: var(--block-gap);

  > img {
    flex-shrink: 0;
    object-fit: cover;
    height: var(--block-height);
    width: var(--block-height);
    border-radius: var(--block-border-radius);
  }

  > .viewer-raw {
    display: none;
  }
}

// 查看原图按钮
.viewer-raw {
  color: #fff;
  font-size: 15px;
  border-radius: 12px;
  width: 80px;
  line-height: 24px;
}
</style>

<style lang="scss">
body {
  /* viewer的按钮设置: 由于viwer是直接生成新dom到根下，只能写在这里 */
  > .viewer-container > .viewer-footer {
    /* 工具栏 */
    .viewer-toolbar {
      // 放大
      .viewer-zoom-in,
      // 缩小
      .viewer-zoom-out,
      // 中间幻灯片播放
      .viewer-play,
      // 逆时针旋转
      .viewer-rotate-left,
      // 水平旋转
      .viewer-flip-horizontal,
      // 垂直旋转
      .viewer-flip-vertical {
        display: none;
      }
    }
  }
}
</style>
