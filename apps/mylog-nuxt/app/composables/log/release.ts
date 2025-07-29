import { AnyArray } from '@mylog-full/mix/constant'
import type { LogEdit, LogFileItem, LogItem } from '@mylog-full/mix/types'
import type { ExifImgFile } from '@mylog-full/mix/img'
import dayjs from 'dayjs'
import type { UploadFile, UploadRawFile } from 'element-plus'

/** 获取 Log 项的默认值 */
export const getInitValue = (item: LogItem): any => {
  switch (item) {
    case 'logtime':
      return dayjs()
    case 'content':
      return ''
    case 'tags':
    case 'imgs':
    case 'videos':
    case 'audios':
    case 'files':
    case 'people':
    case 'location':
      return []
    case 'info':
      return {}
  }
}

/** LogRelease Hook */
export const useLogRelease = () => {
  const logEdit = reactive<LogEdit>({
    type: 'log',
    content: '',
  })

  // 存入文件对象
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

  const releaseLog = () => {}

  return {
    logEdit,
    logFile,
    uploadInfo,
    releaseLog,
  }
}

/** 类型定义 *************************/
/** 这里只定义文件有关的类型，看后面有没有单独提出去的必要 */

type LogFileTypes = {
  imgs: LogImgFile[]
  videos: KeyFile[]
  audios: KeyFile[]
  files: KeyFile[]
}

/** 带 key 的 UploadFile */
export interface KeyFile extends UploadFile {
  /** 文件名：上传时间-序号-文件名 */
  key: string
}

/** 结合 El的UploadRawFile 和 ExifImgFile，就是有EXIF信息的El Raw文件 */
export interface ExifUploadRawFile extends UploadRawFile, ExifImgFile {}

/** 图片文件：原图，压缩图 */
export interface LogImgFile extends KeyFile {
  raw: ExifUploadRawFile
  /** 0.2 压缩文件，其实可以直接是File类型，但还是exif数据搞进去吧 */
  compressImg: ExifImgFile
}

/** 允许的文件类型 */
export const fileType: { [K in LogFileItem]: string[] } = {
  imgs: ['image/png', 'image/gif', 'image/jpeg', 'image/jpg'],
  videos: ['video/mp4', 'video/quicktime'],
  audios: ['audios/mp3'], // 这里随便写的
  files: AnyArray, // 任何其他文件
}

/** 文件的大小限制，字节 */
export const fileSize: { [K in LogFileItem]: number } = {
  imgs: 10 * 1024 * 1024,
  videos: 500 * 1024 * 1024,
  audios: 100 * 1024 * 1024,
  files: 2000 * 1024 * 1024,
}
