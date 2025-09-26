import type { UploadFile, UploadRawFile } from 'element-plus'
import type COS from 'cos-js-sdk-v5'
import { AnyArray, Bucket, Region } from '@mylog-full/mix/constant'
import type { ExifImgFile } from '@mylog-full/mix/img'

/** 获取 Log 项的默认值 */
const getInitValue = (): { logEdit: LogEdit; logFile: LogFileTypes } => ({
  logEdit: { type: 'log', content: '' },
  logFile: { imgs: [], videos: [], audios: [], files: [] },
})

/** 获取 Log 项的默认值 */
export const getDefaultValue = (item: LogItem): any => {
  switch (item) {
    case 'logtime':
      return Date.now()
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

/** 返回如 users/[userid]/mylog/ */
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
 * 发布log，并上传文件，返回有正确id的log。出错会直接抛出
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

  // 1. 上传文件
  await myUploadFiles(uploadFilesParams)
  // 2. 发布log
  const logNew = await $fetch<Log>('/log/release_log', {
    ...FetchOptsDefault,
    body: { log: logEdit },
  })
  return logNew
}

/** LogRelease Hook */
export const useLogRelease = () => {
  const logEdit = reactive<LogEdit>(getInitValue().logEdit)
  const logFile = reactive<LogFileTypes>(getInitValue().logFile)

  const uploadInfo = reactive({
    percent: -1, // 上传进度
    speed: 0, // 上传速度 MB/s
  })

  const release = async () => {
    uploadInfo.percent = 0

    const logNew = await releaseLog(logEdit, {
      files: getCosFiles(logFile),
      onProgress(i) {
        uploadInfo.percent = Math.floor(i.percent * 100)
        uploadInfo.speed = +(i.speed / 1024 / 1024).toFixed(2)
      },
    })

    uploadInfo.percent = -1

    if (logNew?.id !== 0) {
      ElMessage({ message: '发布成功：' + logNew?.id, type: 'success' })

      // logStore.addLog(logNew)
      return logNew
    }
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

/** 传入一个log，返回布尔值，为真就是满足，false就是不满足 */
export const matchesLogFilter = (log: Log, filter?: LogFilter): boolean => {
  if (!filter) return true // 参二缺省，直接返回true
  // 1. type
  if (filter.type && log.type !== filter.type) return false
  // 2. 时间限制，包含两头
  const logtime = +new Date(log.logtime)
  if (filter.logtime.gte && logtime < +dayjs(filter.logtime.gte).startOf('day'))
    return false
  if (filter.logtime.lte && logtime > +dayjs(filter.logtime.lte).endOf('day'))
    return false
  // 3. 先排除
  if (filter.exclude.includes(log.id)) return false
  // 4. 内容包含
  if (filter.content.contains.length) {
    const f = filter.content.isOr
      ? filter.content.contains.some((c) => log.content.includes(c))
      : filter.content.contains.every((c) => log.content.includes(c))
    if (f) {
      if (filter.isOrAll) return true
    } else {
      return false
    }
  }
  // 5. 人员包含
  if (filter.people.contains.length) {
    const f = filter.people.isOr
      ? filter.people.contains.some((c) => log.people.includes(c))
      : filter.people.contains.every((c) => log.people.includes(c))
    if (f) {
      if (filter.isOrAll) return true
    } else {
      return false
    }
  }
  // 6. 标签包含
  if (filter.tags.contains.length) {
    const f = filter.tags.isOr
      ? filter.tags.contains.some((c) => log.tags.includes(c))
      : filter.tags.contains.every((c) => log.tags.includes(c))
    if (f) {
      if (filter.isOrAll) return true
    } else {
      return false
    }
  }

  return true
}

/** 分享 */
export const shareLogs = async (ids: number[]) => {
  // const logIds = mylog.listFilter.map((log) => log.id)
  // try {
  //   await ElMessageBox.confirm(`确定要分享${ids.length}条Log吗？`, '分享', {
  //     confirmButtonText: '分享',
  //     cancelButtonText: '取消',
  //     type: 'info',
  //   })
  // } catch {
  //   return
  // }
  $fetch('/log/get_share', { ...FetchOptsDefault, body: { ids } })

  // getShare({ logIdsJson: JSON.stringify(ids) }).then((link) => {
  //   // 要进行url转义
  //   const url = `${webURL}/#/share?share=${encodeURIComponent(link)}`
  //   writeClipboard(url).then(() => {
  //     ElMessage({ message: '分享链接已经写入剪贴板', type: 'success' })
  //   })
  // })
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
