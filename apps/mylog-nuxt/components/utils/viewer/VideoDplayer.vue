<!-- 
  DPlayer播放器
  文档：https://dplayer.diygod.dev/zh/guide.html
 -->
<script lang="ts" setup>
import DPlayer from 'dplayer'

/**
 * videoSrc 视频地址
 * autoplay 是否自动播放（可选）
 */
const { videoSrc, autoplay } = defineProps<{
  videoSrc: string
  autoplay?: boolean
}>()

const videoDom = ref<HTMLDivElement>()

onMounted(() => {
  const dp = new DPlayer({
    container: videoDom.value!,
    video: { url: videoSrc },
    autoplay,
  })
})
</script>

<template>
  <div ref="videoDom" id="dplayer"></div>
</template>

<style lang="scss" scoped></style>
