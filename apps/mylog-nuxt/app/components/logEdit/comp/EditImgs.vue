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
import { logFileItem, type LogEdit, type LogFileItem, type LogItem } from '@mylog-full/mix/types'
import {
  fileType,
  type KeyFile,
  type LogImgFile,
} from '~/composables/log/release'
import { Plus, Delete } from '@element-plus/icons-vue'
import { getFileKey, toFileUrl } from '@mylog-full/mix/cos'
import type { UploadFile, UploadFiles } from 'element-plus'
import { compressImg, getExif, type ExifImgFile } from '@mylog-full/mix/img'
import dayjs from 'dayjs'

/** 外部文件名列表: 等于 imgsOld + files.map(key) */
const imgs = defineModel<string[]>({ required: true })
/** 外部文件列表 */
const files = defineModel<LogImgFile[]>('files', { required: true })
// const { setItem } = defineProps<{
//   setItem: <T extends LogItem>(item: T, data: LogEdit[T]) => void
// }>()
const emits = defineEmits<{
  /** 给其他文件列表添加文件，不是图片时用 */
  (e: 'addFile', item: LogFileItem, file: KeyFile): void
  /** 设置编辑项数据，用于EXIF补全 */
  <T extends LogItem>(e: 'setItem', item: T, data: LogEdit[T]): void
}>()
/** 原有文件拷贝：组件内要用于删除 */
const imgsOld = ref([...imgs.value, ...files.value.map((i) => i.key)])

// 更新imgs文件名列表：根据 imgsOld(删除时) 和 文件列表 变化
watch([imgsOld, files], ([imgsOld, files]) => {
  imgs.value = [...imgsOld, ...files.map((i) => i.key)]
})
// 组件卸载时清空文件列表
onUnmounted(() => {
  files.value = []
})

// 压缩图片，图片列表可能被从外部修改
watch(
  files,
  (files) => {
    files.forEach((file: LogImgFile) => {
      // 如果没被处理过，就处理图片
      if (!file.compressImg) handleImg(file)
    })
  },
  { immediate: true },
)

const compressing = ref(0) // 用于压缩时控制按钮
// watchEffect(() => compressing ? props.setIsLoad(true) : props.setIsLoad(false)) // 要控制外层的加载状态

/** 状态变化，添加文件、上传成功、失败时执行 */
const onChange = async (_file: UploadFile, _files: UploadFiles) => {
  const file = _file as KeyFile
  const files = _files as KeyFile[]
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

const delImgOld = (img: string) => {
  imgsOld.value = imgsOld.value.filter((i) => i !== img)
}

/** 处理图片函数 */
const handleImg = async (file: LogImgFile) => {
  // 其他文件上传类型不会自动键url，图片要建
  // if (!file.url) file.url = URL.createObjectURL(raw)

  await getExif(file.raw) // exifdata 直接被写入了file.raw中

  // raw原始文件，compressImg压缩文件
  compressing.value++
  const compressFile = (await compressImg(file.raw)) as ExifImgFile
  compressFile.exifdata = file.raw.exifdata
  file.compressImg = compressFile
  compressing.value--
}

// 自动用Exif信息补全
const useExif = () => {
  let exif = null
  const flag = { logtime: false, location: false }
  for (const img of files.value) {
    exif = img.raw!.exifdata
    if (!Object.keys(exif).length) continue

    if (!flag.logtime) {
      let dateTime =
        exif.DateTimeOriginal.value[0] || // 照片在被拍下来的日期/时间，通常和DateTime一样
        exif.DateTime.value[0] || // 图像最后一次被修改时的日期/时间 "YYYY:MM:DD HH:MM:SS"
        exif.DateTimeDigitized.value[0] // 照片被数字化时的日期/时间

      console.log(dateTime)
      if (dateTime) {
        // 'YYYY:MM:DD HH:MM:SS' 转为 'YYYY-MM-DD HH:mm:ss'
        dateTime = dateTime.replace(':', '-').replace(':', '-')
        emits('setItem', 'logtime', dayjs(dateTime))
        flag.logtime = true
      }
    }

    // if (!flag.location) {
    //   let [lng, lat] = [exif.GPSLongitude.value, exif.GPSLatitude.value]
    //   if (lng && lat) {
    //     const lnglat = getLnglatByExif(lng, lat)
    //     // 图片里面是GPS坐标，要转
    //     AMap.convertFrom(lnglat, 'gps', (status: string, result: any) => {
    //       // status：complete 查询成功，no_data 无结果，error 错误
    //       // 查询成功时，result.locations 即为转换后的高德坐标系
    //       if (status === 'complete' && result.info === 'ok') {
    //         emits('setItem', 'location', [l2v(result.locations[0]), ''])
    //         flag.location = true
    //       }
    //     })
    //   }
    // }

    if (flag.logtime && flag.location) return
  }

  if (!flag.logtime && !flag.location) ElMessage.error('没有提取到信息')
}
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
      <div class="viewer-imgs">
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
      </div>

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

    <div class="btns">
      <ElButton :disabled="files.length === 0" @click="useExif" size="small">
        提取时间位置
      </ElButton>
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
