<script setup lang="ts">
import type {
  Log,
  LogFileItem,
  KeyFile,
  LogFiles,
  LogItem,
  LogEdit,
} from '@/types'
import { editLog } from '@/stores/log'
import { getCosFiles } from '@/utils/cos'
import { cloneDeep } from 'lodash'

const emit = defineEmits(['onSuccess'])

// 换一种方式，父组件管理files，不再用组件暴露的files了，主要是为了一个组件上传其他类型文件可以兼容
const files = reactive<LogFiles>({
  imgs: [],
  videos: [],
  audios: [],
  files: [],
})

const log = inject<Log>('log')!
const logEdit = reactive<LogEdit & { id: string }>({ id: log.id! })
const upload = reactive({
  percent: -1, // 上传进度
  speed: 0, // 上传速度 MB/s
})

// 编辑数据组件显示
const visible = reactive<{ [key in LogItem]: boolean }>({
  content: false,
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

/**
 * 设置logEdit中的值，并总会打开组件
 * @param item 设置项
 * @param data 设置数据，不传就是原数据
 */
const setItem = <T extends LogItem>(item: T, data?: LogEdit[T]) => {
  logEdit[item] = data || cloneDeep(log[item])
  visible[item] = true
}

/**
 * 添加文件
 * 加入文件，最后组件总会显示
 *
 * @param item 文件类型
 * @param file 文件
 */
const addFile = (item: LogFileItem, file: KeyFile) => {
  // 如果组件没显示，说明数据没有
  if (!visible[item]) logEdit[item] = cloneDeep(log[item])
  // 向flist加入文件
  files[item].push(file)
  visible[item] = true
}

/**
 * 关闭组件
 * 删除数据，关闭组件。文件又组件销毁钩子删除
 */
const closeItem = (item: LogItem) => {
  delete logEdit[item]
  visible[item] = false
}

const edit = () => {
  upload.percent = 0
  const cosFiles = getCosFiles(files)

  editLog(logEdit, {
    files: cosFiles,
    onProgress: info => {
      upload.percent = Math.floor(info.percent * 100)
      upload.speed = +(info.speed / 1024 / 1024).toFixed(2)
    },
  }).then(count => emit('onSuccess'))
}
</script>

<template>
  <!-- <div>logEdit{{ logEdit }}</div> -->
  <!-- <div>files{{ files }}</div> -->
  <div class="log-edit" :class="{ disabled: upload.percent > -1 }" @click.stop>
    <ElProgress
      v-if="upload.percent > -1"
      :percentage="upload.percent"
      :text-inside="true"
      :stroke-width="20"
      striped
      striped-flow
      :duration="10"
    >
      {{ upload.percent }}% {{ upload.speed }}MB/s
    </ElProgress>

    <div v-else class="control">
      <ControlIcons v-model="visible" :setItem :closeItem />
      <div class="rls-btn">
        <ElButton size="small" type="primary" @click="edit">编辑</ElButton>
      </div>
    </div>

    <div v-if="visible.content">
      <ElInput
        v-model="logEdit.content"
        :autosize="{ minRows: 3 }"
        type="textarea"
        placeholder="记录内容"
      />
    </div>

    <div v-if="visible.logtime">
      <EditTime v-model="logEdit.logtime!" />
    </div>

    <div v-if="visible.tags">
      <EditTags v-model="logEdit.tags!" select-list />
    </div>

    <div v-if="visible.imgs">
      <EditImgs
        v-model="logEdit.imgs!"
        v-model:files="files.imgs"
        :addFile
        :setItem
      />
    </div>

    <div v-if="visible.videos">
      <EditVideos
        v-model="logEdit.videos!"
        v-model:files="files.videos"
        :addFile
      />
    </div>

    <div v-if="visible.files">
      <EditFiles v-model="logEdit.files!" v-model:files="files.files" />
    </div>

    <div v-if="visible.location">
      <EditLocation v-model="logEdit.location!" />
    </div>

    <!-- <div v-m>logEdit: {{ logEdit }}</div> -->
  </div>
</template>

<style scoped lang="less">
.log-edit {
  // 虚线边框
  border: 1px dashed #8888;
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

// 编辑不可操作时，如上传中
.disabled {
  pointer-events: none;
}
</style>
