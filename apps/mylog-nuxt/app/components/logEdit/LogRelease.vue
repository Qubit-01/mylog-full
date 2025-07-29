<script lang="ts" setup>
import {
  getInitValue,
  useLogRelease,
  type KeyFile,
} from '~/composables/log/release'
import ControlIcons from './comp/ControlIcons.vue'
import type { LogEdit, LogFileItem, LogItem } from '@mylog-full/mix/types'
import EditTime from './comp/EditTime.vue'
import EditTags from './comp/EditTags.vue'
import EditImgs from './comp/EditImgs.vue'
import EditVideos from './comp/EditVideos.vue'

const { logEdit, logFile, uploadInfo, releaseLog } = useLogRelease()

/** 编辑模块的可见性 */
const visible = reactive<{ [key in LogItem]: boolean }>({
  content: true, // 默认必须有输入框
  logtime: false,
  tags: false,
  imgs: false,
  videos: false,
  audios: false,
  files: false,
  location: false,
  people: false,
  info: false,
})

/** 设置编辑项数据，不传 data 用默认值 */
const setItem = <T extends LogItem>(item: T, data?: LogEdit[T]) => {
  console.log('LSQ> ', item, data)
  logEdit[item] = data ?? getInitValue(item)
  visible[item] = true
}

/** 添加文件，这里只用传入 keyFile，文件的处理在自己的组件里做 */
const addFile = (item: LogFileItem, file: KeyFile) => {
  setItem(item)
  // logFile[item].push(file as any)
}
</script>
<!-- 
  发布Log模块
  - 显示上传进度/类型选择区，发布按钮
  - 编辑项选择区
  - 内容输入区
  - 编辑数据组件
-->
<template>
  <div class="LogRelease _m">
    <!-- 第一行 -->
    <ElProgress
      v-if="uploadInfo.percent > -1"
      :percentage="uploadInfo.percent"
      :text-inside="true"
      :stroke-width="20"
      striped
      striped-flow
      :duration="10"
    >
      {{ uploadInfo.percent }}% {{ uploadInfo.speed }}MB/s
    </ElProgress>
    <div class="control">
      <ElRadioGroup v-model="logEdit.type" size="small">
        <ElRadioButton label="记录" value="log" />
        <ElRadioButton label="公开" value="public" />
      </ElRadioGroup>
      <ElButton size="small" type="primary" @click="releaseLog">发布</ElButton>
    </div>
    <ControlIcons v-model="visible" v-model:log-edit="logEdit" />

    <ElInput
      v-model="logEdit.content"
      :autosize="{ minRows: 3 }"
      type="textarea"
      placeholder="记录生活，记录你"
    />

    <EditTime
      v-if="visible.logtime && logEdit.logtime"
      v-model="logEdit.logtime"
    />

    <EditTags v-if="visible.tags && logEdit.tags" v-model="logEdit.tags" />

    <EditImgs
      v-if="visible.imgs && logEdit.imgs"
      v-model="logEdit.imgs"
      v-model:files="logFile.imgs"
      @setItem="setItem"
      @addFile="addFile"
    />

    <EditVideos
      v-if="visible.videos && logEdit.videos"
      v-model="logEdit.videos"
      v-model:files="logFile.videos"
      @addFile="addFile"
    />
  </div>
  <p>{{ logEdit }}</p>
  <p>{{ logFile }}</p>
</template>

<style lang="scss" scoped>
.LogRelease {
  border-radius: 8px;
  padding: var(--padding);

  display: flex;
  flex-direction: column;
  gap: 8px;

  .control {
    display: flex;
    justify-content: space-between;
  }
}
</style>
