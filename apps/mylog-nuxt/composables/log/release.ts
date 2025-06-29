import type { LogEdit, LogFileItem } from '@mylog-full/mix/types'
import dayjs from 'dayjs'

import type { UploadFile, UploadRawFile } from 'element-plus'

export const useLogRelease = () => {
  const logEdit = reactive<LogEdit>({
    type: 'log',
    content: '',
  })

  // 存入文件对象
  const files = reactive<LogFiles>({
    imgs: [],
    videos: [],
    audios: [],
    files: [],
  })

  const uploadInfo = reactive({
    percent: -1, // 上传进度
    speed: 0, // 上传速度 MB/s
  })

  const releaseLog = () => {}

  return {
    logEdit,
    uploadInfo,
    releaseLog,
  }
}

/** log上传前的文件类型要求（最后都是COS文件） */
export type LogFiles = {
  [K in LogFileItem]: LogFileTypes[K]
}

type LogFileTypes = {
  imgs: LogImgFile[]
  videos: KeyFile[]
  audios: KeyFile[]
  files: KeyFile[]
}

/** 普通文件，加入上传要用的key，避免上传到COS时，文件名重复覆盖 */
export interface KeyFile extends UploadFile {
  /** 文件名：上传时间-序号-文件名， */
  key?: string
}

/** 结合 El的UploadRawFile 和 ExifImgFile，就是有EXIF信息的El Raw文件 */
export interface ExifUploadRawFile extends UploadRawFile, ExifImgFile {}

/** 图片文件：原图，压缩图，95压缩图 */
export interface LogImgFile extends KeyFile {
  raw?: ExifUploadRawFile
  compressImg?: ExifImgFile // 压缩文件
  compressImg95?: ExifImgFile // 95压缩文件
}
