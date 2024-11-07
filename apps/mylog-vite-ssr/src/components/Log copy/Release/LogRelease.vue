<!-- 
  集成了log和todo，以后看看有没有必要分开
 -->
<script setup lang="ts">
import dayjs from 'dayjs'
import type { KeyFile, LogEdit, LogFileItem, LogFiles, LogItem } from '@/types'
import { logInit, rlsLog } from '@/stores/log'
import { getCosFiles } from '@/utils/cos'
import { cloneDeep } from 'lodash'

const { isTodo } = defineProps<{ isTodo?: boolean }>()

// 换一种方式，父组件管理files，不再用组件暴露的files了，主要是为了一个组件上传其他类型文件可以兼容
const files = reactive<LogFiles>({
  imgs: [],
  videos: [],
  audios: [],
  files: [],
})

const logEdit = reactive<LogEdit>({
  type: 'log',
  content: '',
})
// todo 要修改
if (isTodo)
  Object.assign(logEdit, {
    type: 'todo',
    info: { todo: { complete: false, level: 1 } },
  })

const upload = reactive({
  percent: -1, // 上传进度
  speed: 0, // 上传速度 MB/s
})

// 编辑数据组件显示，release组件不会被销毁，所有重置时要这么一个方法
const visibleInit = () => ({
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
const visible = reactive<{ [key in LogItem]?: boolean }>(visibleInit())

/**
 * 设置logEdit中的值，并总会打开组件
 * @param item 设置项
 * @param data 设置数据，不传就是原数据
 */
const setItem = <T extends LogItem>(item: T, data?: LogEdit[T]) => {
  if (item === 'logtime') logEdit.logtime = (data as dayjs.Dayjs) || dayjs()
  else logEdit[item] = data || cloneDeep(logInit[item])
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
  if (!visible[item]) logEdit[item] = cloneDeep(logInit[item])
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

const release = () => {
  upload.percent = 0
  const cosFiles = getCosFiles(files)

  console.log('🐤', JSON.stringify(logEdit))
  rlsLog(cloneDeep(logEdit), {
    files: cosFiles,
    onProgress: info => {
      upload.percent = Math.floor(info.percent * 100)
      upload.speed = +(info.speed / 1024 / 1024).toFixed(2)
    },
  })
    .then(log => {
      console.log(log)
      // 清空logEdit
      for (let k in logEdit) delete logEdit[k as keyof LogEdit]
      Object.assign(visible, visibleInit())
      Object.assign(upload, { percent: -1, speed: 0 })
    })
    .catch(err => {
      upload.percent = -1
    })
}

defineExpose({ logEdit }) // 暴露数据给父组件用
</script>

<template>
  <!-- <div>logEdit{{ logEdit }}</div> -->
  <div
    class="log-release"
    v-m
    :class="{ disabled: upload.percent > -1 }"
    @click.stop
  >
    <ElInput
      v-model="logEdit.content"
      :autosize="{ minRows: 3 }"
      type="textarea"
      placeholder="记录内容"
    />

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
        <ElRadioGroup v-model="logEdit.type" size="small">
          <ElRadioButton label="记录" value="log" />
          <ElRadioButton label="公开" value="public" />
          <ElRadioButton label="待办" value="todo" />
        </ElRadioGroup>
        <ElButton size="small" type="primary" @click="release">发布</ElButton>
      </div>
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

    <!-- <div v-m>logEdit: {{ logEdit }}</div>
    <div v-m>upload: {{ upload }}</div> -->
  </div>
</template>

<style scoped lang="less">
.log-release {
  padding: var(--padding);
  border-radius: var(--border-radius);

  display: flex;
  flex-direction: column;
  gap: 8px;

  position: sticky;
  top: var(--header-top);
  z-index: 20;

  .control {
    display: flex;
    justify-content: space-between;

    .rls-btn {
      display: flex;
      gap: 8px;
    }
  }
}

// 编辑不可操作时，如上传中
.disabled {
  pointer-events: none;
}
</style>
