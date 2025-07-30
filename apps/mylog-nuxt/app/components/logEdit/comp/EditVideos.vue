<script lang="ts" setup>
import { getFileKey } from '@mylog-full/mix/cos'
import { logFileItem, type LogFileItem } from '@mylog-full/mix/types'
import type { UploadFile, UploadFiles } from 'element-plus'
import { VideoCamera, Close } from '@element-plus/icons-vue'
import { fileType, type KeyFile } from '~/composables/log/release'

/** 外部文件名列表: 等于 namesOld + files.map(key) */
const names = defineModel<string[]>({ required: true })
/** 外部文件列表 */
const files = defineModel<KeyFile[]>('files', { required: true })
const emits = defineEmits<{
  /** 给其他文件列表添加文件，归档时用 */
  (e: 'addFile', item: LogFileItem, file: KeyFile): void
}>()
/** 原有文件拷贝：组件内要用于删除 */
const namesOld = ref(names.value)

// 更新imgs文件名列表：根据 namesOld(删除时) 和 文件列表 变化
watchEffect(() => {
  names.value = [...namesOld.value, ...files.value.map((i) => i.key)]
})
// 组件卸载时清空文件列表
onUnmounted(() => {
  files.value = []
})

/** 删除已有 */
const delOld = (name: string) => {
  namesOld.value = namesOld.value.filter((i) => i !== name)
}

// :on-change 状态变化，添加文件、上传成功、失败
const onChange = async (_file: UploadFile, _files: UploadFiles) => {
  const file = _file as KeyFile
  const files = _files as KeyFile[]
  // todo: 判断大小还没做
  // 文件名，现在是任何文件都接收，所以都要加key
  file.key = getFileKey(file.name)
  // 文件按类型归档，如果匹配到了其他类型，弹出后加进对应的files
  for (const type of logFileItem) {
    if (fileType[type].indexOf(file.raw!.type) > -1) {
      if (type !== 'videos') {
        ElMessage('检测到非视频文件，已自动归类')
        emits('addFile', type, files.pop()!)
      }
      break
    }
  }
}
</script>

<template>
  <div class="EditVideos">
    <div class="all-videos">
      <!-- 已有的列表，模仿element upload组件的卡片 -->
      <div class="viewer-videos">
        <!-- 模仿element upload组件的卡片 -->
        <ul class="el-upload-list el-upload-list--text">
          <li
            v-for="name in namesOld"
            :key="name"
            class="el-upload-list__item is-ready"
          >
            <div class="el-upload-list__item-info">
              <a class="el-upload-list__item-name">
                <ElIcon><VideoCamera /></ElIcon>
                <span class="el-upload-list__item-file-name">{{ name }}</span>
              </a>
            </div>
            <ElIcon class="el-icon--close" @click="delOld(name)">
              <Close />
            </ElIcon>
          </li>
        </ul>
      </div>

      <!-- 真正上传的 drag -->
      <ElUpload
        v-model:file-list="files"
        class="upload-videos"
        multiple
        drag
        :on-change="onChange"
        :auto-upload="false"
      >
        点击或者拖拽到这里上传视频
        <!-- <template #file="{ file }">
          {{ file.url }}
        </template> -->
      </ElUpload>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.EditVideos {
  --block-gap: 2px;

  .all-videos {
    display: flex;
    flex-direction: column;
    gap: var(--block-gap);

    .viewer-videos,
    .upload-videos {
      display: flex;
      flex-direction: column;
      gap: var(--block-gap);

      :deep(ul.el-upload-list) {
        margin: 0;
        display: flex;
        flex-direction: column;

        gap: var(--block-gap);
        > * {
          margin: 0;
        }

        &:empty {
          display: none;
        }
      }
    }

    .upload-videos {
      // 列表
      // :deep(ul.el-upload-list) {
      // }

      // 添加框
      :deep(.el-upload) {
        order: 1;

        .el-upload-dragger {
          color: #999;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0;
          height: 36px;
        }
      }
    }
  }
}
</style>
