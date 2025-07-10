<!-- 
  图片上传组件
  会向files.imgs里面注入COS.UploadFileItemParams[]值

  1. 可以传入现有的图片列表 imgs
  2. 会直接修改传入的 imgs

  逻辑
  - 挂载组件时，可能外部会传入现有的图片，此时 imgs = imgsOld = 现有的列表
  - 上传图片时，
    - 加 key
    - 判断文件类型，归档

  添加图片的逻辑：如果添加的文件是不是图片文件
  1. 是定义了类型的文件，就放进相应files项中。
  2. 其他文件，放进files.files中

  图片压缩、上传，图片EXIF信息解析
  ElUpload组件文档：https://element-plus.org/zh-CN/component/upload.html#%E5%B1%9E%E6%80%A7
  原图、压缩图、95压缩图（几乎无损压缩，但是可以大量节省空间）

  * 文件结构是
  * LogImgFile
  *   - key 文件名，上传时间-序号-文件名
  *   - raw 原始文件
  *   - compressImg 压缩文件
  *   - compressImg95 95压缩文件
  * 其中每个文件都有exifdata和iptcdata
-->
<script lang="ts" setup>
import { logFileItem, type LogFileItem } from '@mylog-full/mix/types'
import {
  fileType,
  type KeyFile,
  type LogImgFile,
} from '~/composables/log/release'
import { Plus } from '@element-plus/icons-vue'
import { getFileKey } from '@mylog-full/mix/cos'

/** 外部文件名列表: 首次传入的数据会被imgsOld记录，然后立即被watch修改 */
const imgs = defineModel<string[]>({ required: true })
/** 外部文件列表 */
const files = defineModel<LogImgFile[]>('files', { required: true })

/** 原有文件拷贝：组件内要用于删除 */
const imgsOld = ref([...imgs.value])
// const { setItem } = defineProps<{
//   setItem: <T extends LogItem>(item: T, data: LogEdit[T]) => void
// }>()

const emits = defineEmits<{
  /** 给其他文件列表添加文件，不是图片时用 */
  (e: 'addFile', item: LogFileItem, file: KeyFile): void
}>()

// const count = ref(0) // 用于压缩时控制按钮
// watchEffect(() => count ? props.setIsLoad(true) : props.setIsLoad(false)) // 要控制外层的加载状态

// 更新imgs文件名列表：根据 imgsOld(删除时) 和 文件列表 变化
// watch(
//   [imgsOld, () => files.value.length],
//   () => {
//     imgs.value = [...imgsOld.value, ...files.value.map((i) => i.key!)]
//   },
//   { immediate: true },
// )

/** 状态变化，添加文件、上传成功、失败时执行 */
const onChange = async (file: KeyFile, files: KeyFile[]) => {
  // 文件名，现在是任何文件都接收，所以都要加key
  file.key = getFileKey(file.name)
  // 文件按类型归档，如果匹配到了其他类型，弹出后加进对应的files
  for (const type of logFileItem) {
    if (fileType[type].indexOf(file.raw!.type) > -1) {
      if (type !== 'imgs') {
        ElMessage('检测到非图片文件，已自动归类')
        emits('addFile', type, files.pop()!)
      }
      break
    }
  }
}

// const delImgOld = (img: string) => {
//   imgsOld.value
//   imgsOld.value = imgsOld.value.filter((i) => i !== img)
// }

// 处理图片函数
// const handleImg = async (file: LogImgFile) => {
//   const raw = file.raw!

//   // 其他文件上传类型不会自动键url，图片要建
//   if (!file.url) file.url = URL.createObjectURL(raw)

//   // exifdata 直接被写入了file.raw中
//   await getExif(raw)

//   // raw原始文件，compressImg压缩文件，compressImg95轻微压缩
//   count.value++
//   compressImg(raw).then((res: any) => {
//     res.exifdata = raw.exifdata
//     file.compressImg = res
//     count.value--
//   })
//   count.value++
//   compressImg(raw, 0.98).then((res: any) => {
//     res.exifdata = raw.exifdata
//     file.compressImg95 = res
//     count.value--
//   })
// }

// 现在处理图片统一到watch中，因为图片列表可能被其他组件修改
// watch(
//   () => files.value.length,
//   () => {
//     files.value.forEach((file: LogImgFile) => {
//       // 如果没被处理过，就处理图片
//       if (!file.compressImg) handleImg(file)
//     })
//   },
//   { immediate: true },
// )

onUnmounted(() => {
  files.value = []
})
</script>
<!-- 
  第一行是图片，和上传组件
-->
<template>
  <div class="EditImgs">
    <!-- 
      multiple 支持多选文件
      drag 启用拖拽上传	(有样式bug)
      accept 接受上传的文件类型
      auto-upload 禁止自动上传
      亲测on-change可能因为禁用了自动上传，只有这个起作用
      :on-remove="handleRemove"
     -->
    <div class="all-imgs">
      <!-- 模仿element upload组件的卡片 -->
      <!-- <div class="viewer-imgs">
        <ul class="el-upload-list el-upload-list--picture-card">
          <li
            v-for="img in imgsOld"
            :key="img"
            class="el-upload-list__item is-ready"
          >
            <img :src="toFileUrl(img, 'compress-imgs/')" />
            <span class="el-upload-list__item-actions">
              <ElIcon size="20" color="#fff" @click="delImgOld(img)">
                <Delete />
              </ElIcon>
            </span>
          </li>
        </ul>
      </div> -->

      <!-- 真正上传的 -->
      <ElUpload
        v-model:file-list="files"
        class="ElUpload"
        list-type="picture-card"
        multiple
        drag
        :on-change
        :auto-upload="false"
      >
        <ElIcon><Plus /></ElIcon>
      </ElUpload>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.EditImgs {
  --block-height: 6rem;
  --block-gap: 2px;

  display: flex;
  flex-direction: column;
  gap: var(--block-gap);

  .all-imgs {
    max-width: 100%;
    display: flex;
    gap: var(--block-gap);
    overflow: auto;

    .viewer-imgs,
    .ElUpload {
      :deep(ul.el-upload-list) {
        flex-wrap: nowrap;
        gap: var(--block-gap);

        > * {
          width: var(--block-height);
          height: var(--block-height);
          margin: 0;

          img {
            object-fit: cover;
            width: 100%;
            height: 100%;
          }
        }

        &:empty {
          display: none;
        }
      }
    }

    // 待上传的图片
    .ElUpload {
      justify-content: flex-start;

      :deep(ul.el-upload-list) {
        li.el-upload-list__item {
          // 隐藏预览按钮
          .el-upload-list__item-preview {
            display: none;
          }
          // 居中删除按钮
          .el-upload-list__item-delete {
            margin: 0;
          }
        }

        // 添加按钮
        div.el-upload.el-upload--picture-card {
          .el-upload-dragger {
            border: none;
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}
</style>
