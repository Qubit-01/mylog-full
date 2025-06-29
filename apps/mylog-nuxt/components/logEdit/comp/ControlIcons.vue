<script lang="ts" setup>
import {
  Clock,
  FolderOpened,
  Picture,
  PriceTag,
  User,
  VideoCamera,
  Location,
  More,
  Microphone,
} from '@element-plus/icons-vue'
import type { LogItem } from '@mylog-full/mix/types'

const visible = defineModel<{ [key in LogItem]?: boolean }>({ required: true })

const emits = defineEmits<{
  /** 点击不高亮的图标时，添加元素 */
  (e: 'add', item: LogItem): void
  /** 点击高亮的图标时，删除元素 */
  (e: 'del', item: LogItem): void
}>()

const onClick = (item: LogItem) => {
  visible.value[item] ? emits('del', item) : emits('add', item)
}
</script>
<!-- 
  打开图标：打开对应的编辑组件，设置默认值
  关闭图标：关闭对应的编辑组件，delete对应的值
-->
<template>
  <div class="ControlIcons">
    <ElButton
      link
      :icon="Clock"
      :type="visible.logtime ? 'primary' : undefined"
      @click="onClick('logtime')"
    />
    <ElButton
      link
      :icon="PriceTag"
      :type="visible.tags ? 'primary' : undefined"
      @click="onClick('tags')"
    />
    <ElButton
      link
      :icon="Picture"
      :type="visible.imgs ? 'primary' : undefined"
      @click="onClick('imgs')"
    />
    <ElButton
      link
      :icon="VideoCamera"
      :type="visible.videos ? 'primary' : undefined"
      @click="onClick('videos')"
    />
    <ElButton
      link
      :icon="Microphone"
      :type="visible.audios ? 'primary' : undefined"
      @click="onClick('audios')"
    />
    <ElButton
      link
      :icon="FolderOpened"
      :type="visible.files ? 'primary' : undefined"
      @click="onClick('files')"
    />
    <ElButton
      link
      :icon="Location"
      :type="visible.location ? 'primary' : undefined"
      @click="onClick('location')"
    />
    <ElButton
      link
      :icon="User"
      :type="visible.people ? 'primary' : undefined"
      @click="onClick('people')"
    />
    <ElButton
      link
      :icon="More"
      :type="visible.info ? 'primary' : undefined"
      @click="onClick('info')"
    />
  </div>
</template>

<style lang="scss" scoped>
.ControlIcons {
  display: flex;
  gap: 4px;

  > * {
    font-size: 20px;
    height: 20px;
    width: 24px;
    margin: 0;
  }
}
</style>
