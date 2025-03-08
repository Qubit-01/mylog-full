<!-- 
  DPlayer播放器
  文档：https://dplayer.diygod.dev/zh/guide.html
 -->
<script lang="ts" setup>
const { url, autoplay } = defineProps<{
  /** 视频地址 */
  url: string
  /** 是否自动播放（可选） */
  autoplay?: boolean
}>()

const videoDom = useTemplateRef('videoDom')

onMounted(async () => {
  const DPlayer = (await import('dplayer')).default
  new DPlayer({
    container: videoDom.value!,
    video: { url },
    autoplay,
  })
})
</script>

<template>
  <!--
    autoplay 自动开始播放 controls 显示播放器控件
    poster 视频封面 loop 循环播放
    muted 默认静音 preload 页面加载时加载，并预备播放
    none:播放前不会预先下载视频资源，用户不点击播放时会省宽带；
    metadata:播放前不会下载视频资源，但是会获取资源的元数据；
    auto:根据实际情况动态决定
  -->
  <div ref="videoDom" />
</template>

<style lang="scss" scoped></style>
