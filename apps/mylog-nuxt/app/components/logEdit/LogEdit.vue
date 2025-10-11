<script lang="ts" setup>
import ControlIcons from './comp/ControlIcons.vue'
import EditTime from './comp/EditTime.vue'
import EditTags from './comp/EditTags.vue'
import EditImgs from './comp/EditImgs.vue'
import EditVideos from './comp/EditVideos.vue'
import EditFiles from './comp/EditFiles.vue'
import EditLocation from './comp/EditLocation.vue'

const { log } = defineProps<{
  /** 是否有内容输入框按钮 */
  log?: Log
}>()
const emits = defineEmits<{
  /** 发布成功后触发，目前用于触发重置发布模块 */
  success: []
}>()

const logEdit = reactive<LogEdit>({ type: 'log' })
const logFile = reactive<LogFileTypes>({
  imgs: [],
  videos: [],
  audios: [],
  files: [],
})

const uploadInfo = reactive({
  percent: -1, // 上传进度
  speed: 0, // 上传速度 MB/s
})

/** 编辑模块的可见性 */
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

/** 设置编辑项数据，不传 data 用默认值 */
const setItem = <T extends LogItem>(item: T, data?: LogEdit[T]) => {
  logEdit[item] = data ?? getDefaultValue(item)
  visible[item] = true
}

/** 添加文件，这里只用传入 keyFile，文件的处理在自己的组件里做 */
const addFile = (item: LogFileItem, file: KeyFile) => {
  setItem(item) // 设置空值，然后组件内会去设置
  logFile[item].push(file as any)
}

const onEditLog = () => {}
</script>

<template>
  <div class="LogEdit">
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
      <ControlIcons v-model="visible" v-model:log-edit="logEdit" :log />
      <ElButton size="small" type="primary" @click="onEditLog">编辑</ElButton>
    </div>

    <ElInput
      v-if="visible.content && logEdit.content !== undefined"
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

    <EditFiles
      v-if="visible.files && logEdit.files"
      v-model="logEdit.files"
      v-model:files="logFile.files"
    />

    <ClientOnly>
      <EditLocation
        v-if="visible.location && logEdit.location"
        v-model="logEdit.location"
      />
    </ClientOnly>
  </div>
</template>

<style lang="scss" scoped>
.LogEdit {
  // 虚线边框
  border: 1px dashed #8888;
  border-radius: 8px;
  padding: 4px;

  display: flex;
  flex-direction: column;
  gap: 8px;

  .control {
    display: flex;
    justify-content: space-between;
  }
}
</style>
