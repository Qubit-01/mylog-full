import dayjs from 'dayjs'
import type { UploadFile, UploadRawFile } from 'element-plus'
import type COS from 'cos-js-sdk-v5'
import { AnyArray, Bucket, Region } from '@mylog-full/mix/constant'
import type { ExifImgFile } from '@mylog-full/mix/img'

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

/**
 * 返回如 users/[userid]/mylog/
 */
export const cosPath = (userid: number) => `users/${userid}/mylog/`

/** 从files对象中，取出cos文件对象 */
export const getCosFiles = (logFile: LogFileTypes) => {
  const cosFiles: COS.UploadFileItemParams[] = []

  const { user } = refsGlobalStore()

  const getFile = (file: KeyFile, type: string) => ({
    Bucket,
    Region,
    Key: `${cosPath(user.value.id)}${type}/${file.key}`,
  })

  // 压缩图、原图
  for (const file of logFile.imgs) {
    cosFiles.push({ ...getFile(file, 'imgs'), Body: file.raw! })
    cosFiles.push({
      ...getFile(file, 'compress-imgs'),
      Body: file.compressImg!,
    })
  }
  for (const file of logFile.videos)
    cosFiles.push({ ...getFile(file, 'videos'), Body: file.raw! })
  for (const file of logFile.audios)
    cosFiles.push({ ...getFile(file, 'audios'), Body: file.raw! })
  for (const file of logFile.files)
    cosFiles.push({ ...getFile(file, 'files'), Body: file.raw! })

  return cosFiles
}

/**
 * 发布log，并上传文件，返回有正确id的log
 * @param log log对象，部分
 * @param file 要上传的文件
 */
export const releaseLog = async (
  logEdit: LogEdit,
  uploadFilesParams: COS.UploadFilesParams,
) => {
  if (!logEdit.content) {
    ElMessage.error('必须填入内容哦')
    throw new Error('必须填入内容哦')
  }

  try {
    await myUploadFiles(uploadFilesParams)
    const newLog = await $fetch<LogDTO>('/log/release_log', {
      method: 'POST',
      baseURL,
      body: { log: toLogDTO(logEdit) },
    })
    return newLog && toLogVO(newLog)
  } catch (error) {
    console.error('Error releasing log:', error)
    return undefined
  }
}

/** LogRelease Hook */
export const useLogRelease = () => {
  const logEdit = reactive<LogEdit>({
    type: 'log',
    content: '',
  })
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

  const release = async () => {
    uploadInfo.percent = 0
    const files = getCosFiles(logFile)

    const log = await releaseLog(logEdit, {
      files,
      onProgress(i) {
        uploadInfo.percent = Math.floor(i.percent * 100)
        uploadInfo.speed = +(i.speed / 1024 / 1024).toFixed(2)
      },
    })

    console.log('LSQ> log', log)

    uploadInfo.percent = -1
    ElMessage({ message: '发布成功：' + log?.id, type: 'success' })

    // if (newlog.id !== '0') {
    //   logStore.addLog(log)
    //   return log
    // }

    console.log('LSQ> ', files)
  }

  return {
    /** 编辑的Log本体 */
    logEdit,
    /** 附带的文件列表 */
    logFile,
    uploadInfo,
    release,
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
