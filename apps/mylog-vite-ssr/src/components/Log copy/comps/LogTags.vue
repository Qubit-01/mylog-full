<script setup lang="ts">
import type { Log } from '@/types'

const log = inject<Log>('log')!
const isExpand = inject<Ref<boolean>>('isExpand')!
const { noPublic } = defineProps<{
  noPublic?: boolean
  noTodo?: boolean
}>()
</script>

<template>
  <div class="log-tags">
    <ElTag
      v-if="!noPublic && log.type === 'public'"
      size="small"
      type="warning"
    >
      公开
    </ElTag>
    <ElTag v-if="noPublic && log.type === 'todo'" size="small" type="warning">
      待办
      <span v-show="log.info.todo?.complete">√</span>
    </ElTag>
    <ElTag v-for="p in log.people" :key="p" size="small">{{ p }}</ElTag>
    <ElTag v-for="t in log.tags" :key="t" size="small" type="success">
      {{ t }}
    </ElTag>
    <ElTag v-if="log.info.markdown" size="small">MarkDown</ElTag>

    <template v-if="!isExpand">
      <span v-if="log.videos.length">🎬{{ log.videos.length }}</span>
      <span v-if="log.audios.length">🎙️{{ log.audios.length }}</span>
      <span v-if="log.files.length">📁{{ log.files.length }}</span>
      <span v-if="log.location.length">📍</span>
    </template>
  </div>
</template>

<style scoped lang="less">
.log-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}
</style>
