<script lang="ts" setup>
const log = inject<Log>('log')!
const isExpand = inject<Ref<boolean>>('isExpand')!
const { hidePublic } = defineProps<{
  /** 是否不显示公开tag */
  hidePublic?: boolean
}>()
</script>

<template>
  <div class="LogTags">
    <ElTag
      v-if="log.type === 'public'"
      v-show="!hidePublic"
      size="small"
      type="warning"
    >
      公开
    </ElTag>
    <ElTag v-for="p in log.people" :key="p" size="small">{{ p }}</ElTag>
    <ElTag v-for="t in log.tags" :key="t" size="small" type="success">
      {{ t }}
    </ElTag>
    <ElTag v-if="log.info.markdown" size="small">MarkDown</ElTag>

    <template v-if="!isExpand">
      <!-- <span v-if="log.videos.length">🎬{{ log.videos.length }}</span> -->
      <span v-if="log.audios.length">🎙️{{ log.audios.length }}</span>
      <span v-if="log.files.length">📁{{ log.files.length }}</span>
      <span v-if="log.location.length">📍</span>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.LogTags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}
</style>
