<!-- 
  文件预览组件
 -->
<script lang="ts" setup>
import { Document, Download } from '@element-plus/icons-vue'

const { log, data } = defineProps<{
  /** 从父组件拿到log，主要是获取userId，下载文件肯定是从我服务器来的，userid必须要 */
  log: Log
  /** 文件列表 */
  data: string[]
}>()
// 计算从哪里取属性
const files = computed(() => data)
// 传入的图片要处理，如果不是http开头，那么就加上OOS地址，否则直接用，而且要改为https
const urls = ref<string[]>(toFileUrl(files.value, 'files/', log.userid))
watch(files, () => {
  urls.value = toFileUrl(files.value, 'files/', log?.userid)
})

// 下载文件
const download = (file: string) => {
  const key = cosPath(log?.userid) + 'files/' + file
  console.log(key)
  // myGetObjectUrl(key)
}
</script>

<template>
  <div class="viewer-files" @click.stop>
    <div
      v-for="(url, index) in urls"
      :key="url"
      class="file"
      @click="download(files[index]!)"
    >
      <Document class="icon" />
      <div class="name">
        {{ url }}
        <!-- {{ url[index] }} -->
      </div>
      <Download class="icon" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.viewer-files {
  display: flex;
  flex-direction: column;
  gap: 2px;

  .file {
    height: 28px;
    padding: 0 8px;

    border-radius: 8px;
    background-color: #0001;
    cursor: pointer;
    transition: background-color 0.3s;

    display: flex;
    align-items: center;
    gap: 4px;

    .icon {
      width: 16px;
      height: 16px;
    }

    .name {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &:hover {
      background-color: #0002;
    }
  }
}
</style>
