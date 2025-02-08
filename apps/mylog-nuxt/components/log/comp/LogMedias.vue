<script lang="ts" setup>
import ViewerImgs from '~/components/utils/viewer/ViewerImgs.vue'
// import ViewerVideos from '~/components/utils/viewer/ViewerVideos.vue'
import ViewerFiles from '~/components/utils/viewer/ViewerFiles.vue'

const log = inject<Log>('log')!
const isExpand = inject<boolean>('isExpand')!
</script>

<template>
  <!-- 图片和视频放在一起 -->
  <div class="block-media">
    <ViewerImgs v-if="log.imgs.length" />
    <!-- <ViewerVideos v-if="log.videos.length" /> -->
  </div>

  <!-- 音频 和 文件 -->
  <template v-if="isExpand">
    <div v-if="log.audios.length">音频：{{ log.audios }}</div>
    <ViewerFiles v-if="log.files.length">文件：{{ log.files }}</ViewerFiles>
  </template>
</template>

<style lang="scss" scoped>
.block-media {
  --block-height: 6rem;
  --block-border-radius: 6px;
  --block-gap: 2px;

  display: flex;
  flex-wrap: wrap;
  gap: var(--block-gap);
}

// 空div应该不占用gap
.block-media:empty {
  display: none;
}
</style>
