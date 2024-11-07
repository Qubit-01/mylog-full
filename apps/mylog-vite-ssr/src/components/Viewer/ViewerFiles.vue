<!-- 
  文件预览组件
 -->
<script setup lang="ts">
import type { Log } from '@/types'
import { cosPath, myGetObjectUrl, toFileUrl } from '@/utils/cos'

// 从父组件拿到log，主要是获取userId
const log: Log = inject('log')!

/**
 * 文件列表，没传就用log.files
 */
const props = defineProps<{ files?: string[] }>()
// 计算从哪里取属性
const files = computed(() => props.files || log.files)

// 传入的图片要处理，如果不是http开头，那么就加上OOS地址，否则直接用，而且要改为https
const fileUrls = ref<string[]>(toFileUrl(files.value, 'files/', log.userid))

watch(files, () => {
  fileUrls.value = toFileUrl(files.value, 'files/', log.userid)
})

// 下载文件
const download = (file: string) => {
  const key = cosPath(log.userid) + 'files/' + file
  // console.log(key)
  myGetObjectUrl(key)
}
</script>

<template>
  <div class="viewer-files" @click.stop>
    <!-- 模仿element upload组件的卡片 -->
    <ul class="el-upload-list el-upload-list--text">
      <li
        v-for="(fileUrl, index) in fileUrls"
        :key="fileUrl"
        class="el-upload-list__item is-ready"
      >
        <div class="el-upload-list__item-info">
          <a class="el-upload-list__item-name">
            <ElIcon><Document /></ElIcon>
            <span class="el-upload-list__item-file-name">
              {{ files[index] }}
            </span>
          </a>
        </div>
        <ElIcon class="el-icon--close" @click="download(files[index])">
          <Download />
        </ElIcon>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="less">
.viewer-files {
  // white-space: nowrap;
  // overflow-y: hidden;
  // width: fit-content;
  // max-width: 100%;

  display: flex;
  flex-direction: column;
  gap: var(--block-gap);

  ul.el-upload-list {
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
</style>
