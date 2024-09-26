<!-- 
  visible
    如果是boolean值，控制组件的显示和按钮的颜色
    如果是undefined，控制按钮有无
 -->
<script setup lang="ts">
import type { LogEdit, LogItem } from '@/types'
import {
  Document,
  Clock,
  PriceTag,
  Picture,
  VideoCamera,
  Microphone,
  FolderOpened,
  Location,
  User,
  More,
} from '@element-plus/icons-vue'

const visible = defineModel<{ [key in LogItem]?: boolean }>({ required: true })
const { setItem, closeItem } = defineProps<{
  setItem: <T extends LogItem>(item: T, data?: LogEdit[T]) => void
  closeItem: (item: LogItem) => void
}>()

const map = {
  content: Document,
  logtime: Clock,
  tags: PriceTag,
  imgs: Picture,
  videos: VideoCamera,
  // audios: Microphone,
  files: FolderOpened,
  location: Location,
  people: User,
  // info: More,
}
</script>

<template>
  <div class="control-icons">
    <template v-for="(v, k) of map">
      <ElButton
        v-if="visible[k] !== undefined"
        link
        :icon="v"
        @click="visible[k] ? closeItem(k) : setItem(k)"
        :type="visible[k] ? 'primary' : undefined"
      />
    </template>
  </div>
</template>

<style scoped lang="less">
.control-icons {
  display: flex;
  gap: 4px;

  > * {
    font-size: 24px;
    height: 24px;
    width: 24px;
    margin: 0;
  }
}
</style>
