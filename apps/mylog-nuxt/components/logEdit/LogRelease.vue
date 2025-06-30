<script lang="ts" setup>
import { useLogRelease } from '~/composables/log/release'
import ControlIcons from './comp/ControlIcons.vue'
import type { LogItem } from '@mylog-full/mix/types'
import dayjs from 'dayjs'
import EditTime from './comp/EditTime.vue'
import EditTags from './comp/EditTags.vue'
import EditImgs from './comp/EditImgs.vue'

const { logEdit, logFile, uploadInfo, releaseLog } = useLogRelease()

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

/** 添加编辑项，并设置默认值 */
const addItem = (item: LogItem) => {
  switch (item) {
    case 'logtime':
      logEdit[item] = dayjs()
      break
    case 'content':
      logEdit[item] = ''
      break
    case 'tags':
    case 'imgs':
    case 'videos':
    case 'audios':
    case 'files':
    case 'people':
    case 'location':
      logEdit[item] = []
      break
    case 'info':
      logEdit[item] = {}
      break
  }
  visible[item] = true
}

/** 删除编辑项 */
const delItem = (item: LogItem) => {
  visible[item] = false
  delete logEdit[item]
}

// watchEffect(() => {
//   console.log('LogRelease watch logEdit:', ControlIconsRef.value?.visible);

// })

// onMounted(() => {
//   // 初始化时可以设置默认的编辑项
//   ControlIconsRef.value?.visible;

// })
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
    <ControlIcons v-model="visible" @add="addItem" @del="delItem" />

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
    />
  </div>
  {{ logEdit }}
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
