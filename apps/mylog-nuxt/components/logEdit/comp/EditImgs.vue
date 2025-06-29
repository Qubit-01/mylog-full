<!-- 
  图片上传组件 files必传
  会向files.imgs里面注入COS.UploadFileItemParams[]值

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
import type { LogEdit, LogFileItem, LogItem } from '@mylog-full/mix/types';
import { type UploadFiles } from 'element-plus';
import type { KeyFile, LogImgFile } from '~/composables/log/release';

// 文件名: 首次传入的数据会被imgsOld记录，然后立即被watch修改
const imgs = defineModel<string[]>({ required: true })
// 外部传入的files，要朝里面放入cos文件对象。
const filesModel = defineModel<LogImgFile[]>('files', { required: true })

// 原有文件：编辑模块要传入一些图片进来
const imgsOld = ref([...imgs.value])
const { addFile, setItem } = defineProps<{
  addFile: (item: LogFileItem, file: KeyFile) => void
  setItem: <T extends LogItem>(item: T, data: LogEdit[T]) => void
}>()

let index = 1 // 给图片计数，用于命名
const count = ref(0) // 用于压缩时控制按钮
// watchEffect(() => count ? props.setIsLoad(true) : props.setIsLoad(false)) // 要控制外层的加载状态

// 更新imgs文件名列表
watch(
  [imgsOld, () => filesModel.value.length],
  () => {
    imgs.value = [...imgsOld.value, ...filesModel.value.map((i) => i.key!)]
  },
  { immediate: true },
)

// :on-change 状态变化，添加文件、上传成功、失败
const onChange = async (file: KeyFile, files: UploadFiles) => {
  const raw = file.raw!

  // Todo: 判断大小还没做

  // 文件名，现在是任何文件都接收，所以都要加key
  file.key = getKey(file.name)

  // files 项的indexOf永远返回0，它一定会是最后兜底的
  for (const type of logFileItem) {
    if (fileType[type].indexOf(raw.type) > -1) {
      // 如果匹配到了其他类型，弹出后加进对应的filesModel
      if (type !== 'imgs') {
        ElMessage('检测到非图片文件，已自动归类')
        addFile(type, files.pop()!)
      }
      break // 匹配到了就要退出
    }
  }
}

const delImgOld = (img: string) => {
  imgsOld.value = imgsOld.value.filter((i) => i !== img)
}

// 处理图片函数
const handleImg = async (file: LogImgFile) => {
  const raw = file.raw!

  // 其他文件上传类型不会自动键url，图片要建
  if (!file.url) file.url = URL.createObjectURL(raw)

  // exifdata 直接被写入了file.raw中
  await getExif(raw)

  // raw原始文件，compressImg压缩文件，compressImg95轻微压缩
  count.value++
  compressImg(raw).then((res: any) => {
    res.exifdata = raw.exifdata
    file.compressImg = res
    count.value--
  })
  count.value++
  compressImg(raw, 0.98).then((res: any) => {
    res.exifdata = raw.exifdata
    file.compressImg95 = res
    count.value--
  })
}

// 现在处理图片统一到watch中，因为图片列表可能被其他组件修改
watch(
  () => filesModel.value.length,
  () => {
    filesModel.value.forEach((file: LogImgFile) => {
      // 如果没被处理过，就处理图片
      if (!file.compressImg) handleImg(file)
    })
  },
  { immediate: true },
)

onUnmounted(() => {
  filesModel.value = []
})

// 自动用Exif信息补全
const useExif = () => {
  let exif = null
  const flag = { logtime: false, location: false }
  for (const img of filesModel.value) {
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
        setItem('logtime', dayjs(dateTime))
        flag.logtime = true
      }
    }

    if (!flag.location) {
      let [lng, lat] = [exif.GPSLongitude.value, exif.GPSLatitude.value]
      if (lng && lat) {
        const lnglat = getLnglatByExif(lng, lat)
        // 图片里面是GPS坐标，要转
        AMap.convertFrom(lnglat, 'gps', (status: string, result: any) => {
          // status：complete 查询成功，no_data 无结果，error 错误
          // 查询成功时，result.locations 即为转换后的高德坐标系
          if (status === 'complete' && result.info === 'ok') {
            setItem('location', [l2v(result.locations[0]), ''])
            flag.location = true
          }
        })
      }
    }

    if (flag.logtime && flag.location) return
  }

  if (!flag.logtime && !flag.location) ElMessage.error('没有提取到信息')
}
</script>

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
      <div class="viewer-imgs">
        <!-- 模仿element upload组件的卡片 -->
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
        v-model:file-list="filesModel"
        class="upload-imgs"
        list-type="picture-card"
        multiple
        drag
        :on-change="onChange"
        :auto-upload="false"
      >
        <ElIcon><Plus /></ElIcon>
      </ElUpload>
    </div>
    <div>
      <ElButton
        :disabled="filesModel.length === 0"
        @click="useExif"
        size="small"
      >
        提取时间位置
      </ElButton>
    </div>

    <!--
    <el-switch v-if="editNote.noteImgs" v-model="editNote.isRawImgs" size="small" inline-prompt active-text="原图"
      inactive-text="高清" />
    <span style="font-size: 12px;color:var(--mini-text-color)">图片小于{{ SIZE }}MB</span>
  --></div>
</template>

<style lang="scss" scoped>
.EditImgs {
}
</style>
