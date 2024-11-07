<script setup lang="ts">
import type { UploadFiles } from 'element-plus'
import type { KeyFile } from '@/types'
import { getKey } from '@/utils/cos'

// 文件名列表
const files = defineModel<string[]>({ required: true })
// 外部传入的files，要朝里面放入cos文件对象。
const filesModel = defineModel<KeyFile[]>('files', { required: true })

// 原有文件：编辑模块要传入一些图片进来
const filesOld = ref([...files.value])

// watchEffect(() => count ? props.setIsLoad(true) : props.setIsLoad(false)) // 要控制外层的加载状态

// 更新imgs文件名列表
watch(
  [filesOld, () => filesModel.value.length],
  () => {
    files.value = [...filesOld.value, ...filesModel.value.map(i => i.key!)]
  },
  { immediate: true }
)

// :on-change 状态变化，添加文件、上传成功、失败
const onChange = async (file: KeyFile, files: UploadFiles) => {
  const raw = file.raw!

  // Todo: 判断大小还没做

  // 文件名，现在是任何文件都接收，所以都要加key
  file.key = getKey(file.name)

  // 因为这是files兜底，所以默认用户就是想把文件放进去files
}

const delVideoOld = (video: string) => {
  filesOld.value = filesOld.value.filter(i => i !== video)
}

onUnmounted(() => {
  filesModel.value = []
})
</script>
<template>
  <div class="edit-files">
    <div class="all-files">
      <div class="viewer-files">
        <!-- 模仿element upload组件的卡片 -->
        <ul class="el-upload-list el-upload-list--text">
          <li
            v-for="video in filesOld"
            :key="video"
            class="el-upload-list__item is-ready"
          >
            <div class="el-upload-list__item-info">
              <a class="el-upload-list__item-name">
                <ElIcon><VideoCamera /></ElIcon>
                <span class="el-upload-list__item-file-name">{{ video }}</span>
              </a>
            </div>
            <ElIcon class="el-icon--close" @click="delVideoOld(video)"
              ><Close
            /></ElIcon>
          </li>
        </ul>
      </div>

      <!-- 真正上传的 drag -->
      <ElUpload
        v-model:file-list="filesModel"
        class="upload-files"
        multiple
        drag
        :on-change="onChange"
        :auto-upload="false"
      >
        点击或者拖拽到这里上传文件
        <!-- <ElButton type="primary">上传视频</ElButton> -->
        <!-- <template #file="{ file }">
          {{ file.url }}
        </template> -->
      </ElUpload>
    </div>
  </div>
</template>

<style scoped lang="less">
.edit-files {
  --block-gap: 2px;

  .all-files {
    display: flex;
    flex-direction: column;
    gap: var(--block-gap);

    .viewer-files,
    .upload-files {
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

    .upload-files {
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
