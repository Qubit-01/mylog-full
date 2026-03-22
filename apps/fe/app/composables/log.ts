import type { UploadFile, UploadRawFile } from 'element-plus'
import type COS from 'cos-js-sdk-v5'
import { AnyArray, Bucket, Region } from '@mylog-full/mix/constant'
import type { ExifImgFile } from '@mylog-full/mix/img'

/** 获取 Log 项的默认值 */
export const getDefaultValue = (item: LogEditItem): any => {
  switch (item) {
    case 'logtime':
      return new Date().toISOString()
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
 * 发布log，并上传文件，返回有正确id的log
 * @param log log对象，部分
 * @param file 要上传的文件
 */
export const releaseLog = async (
  logEdit: LogEdit,
  uploadFilesParams: COS.UploadFilesParams,
) => {
  if (!logEdit.content) throw new Error('必须填入内容哦')

  // 1. 上传文件
  await myUploadFiles(uploadFilesParams)
  // 2. 发布log
  const logNew = await $fetchApi<Log>('/log/release_log', {
    body: { log: logEdit },
  })
  return logNew
}

/** 删除Log，成功返回删除的log，失败返回undefined */
export const deleteLog = async (log: Log) => {
  try {
    await ElMessageBox.confirm('确定删除吗？', '删除Log', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
    })
  } catch {
    return
  }
  // 1. 先删文件
  const objects: { Key: string }[] = []
  logFileItem.forEach((type) => {
    log[type].forEach((key) => {
      objects.push({ Key: `${cosPath(log.userid)}${type}/${key}` })
      type === 'imgs' &&
        objects.push({ Key: `${cosPath(log.userid)}compress-imgs/${key}` })
    })
  })
  await myDeleteFiles(objects)
  // 2. 再删log
  const logDel = await $fetchApi<Log | null>('/log/delete_log', {
    body: { id: log.id },
  })
  return logDel ?? undefined
}

/** 编辑log，传入log和编辑的部分，返回新的log */
export const editLog = async (
  log: Log,
  logEdit: Partial<LogEdit>,
  uploadFilesParams: COS.UploadFilesParams = { files: [] },
) => {
  // 1. 上传文件，文件能传好，大概率后续删除和编辑
  await myUploadFiles(uploadFilesParams)
  // 2. 删除文件
  const delObjs: { Key: string }[] = []
  logFileItem.forEach((fileKey) => {
    if (logEdit[fileKey]) {
      // 找 log 里面有，但是 logEdit 里面没有的项
      log[fileKey]
        .filter((k) => !logEdit[fileKey]?.includes(k))
        .forEach((k) => {
          delObjs.push({ Key: `${cosPath(log.userid)}${fileKey}/${k}` })
          fileKey === 'imgs' &&
            delObjs.push({ Key: `${cosPath(log.userid)}compress-imgs/${k}` })
        })
    }
  })
  await myDeleteFiles(delObjs)
  // 3. 编辑 log
  const logNew = await $fetchApi<Log>('/log/edit_log', {
    body: { id: log.id, logEdit },
  })
  return logNew
}

/** LogRelease Hook */
export const useLogRelease = () => {
  const logEdit = reactive<LogEdit>({ type: 'log', content: '' })
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
    if (!logEdit.content) {
      ElMessage.error('必须填入内容哦')
      return
    }

    uploadInfo.percent = 0

    const logNew = await releaseLog(logEdit, {
      files: getCosFiles(logFile),
      onProgress(i) {
        uploadInfo.percent = Math.floor(i.percent * 100)
        uploadInfo.speed = +(i.speed / 1024 / 1024).toFixed(2)
      },
    })

    uploadInfo.percent = -1
    if (logNew?.id !== 0) return logNew
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

/** 返回完整的过滤器 */
export const initFilter = (filter?: Partial<LogFilter>): LogFilter => ({
  type: '',
  logtime: { gte: undefined, lte: undefined },
  isOrAll: true,
  content: { contains: [], isOr: false },
  people: { contains: [], isOr: false },
  tags: { contains: [], isOr: false },
  exclude: [],
  ...filter,
})

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
  try {
    await ElMessageBox.confirm(
      `确定要分享${ids.length}条 Log 吗？只会分享下面已展示的 Log，请下拉确认哦~`,
      '分享',
      {
        confirmButtonText: '分享',
        cancelButtonText: '取消',
        type: 'info',
      },
    )
  } catch {
    return
  }
  const en = await $fetchApi<string>('/log/encrypt_share', {
    body: { ids },
  })
  const url = `${Domain}/share?share=${encodeURIComponent(en)}`
  const { copy } = useClipboard()
  copy(url).then(() => {
    ElMessage({ message: '分享链接已经写入剪贴板', type: 'success' })
  })
}

/** 类型定义 *************************/
/** 这里只定义文件有关的类型，看后面有没有单独提出去的必要 */

export type LogFileTypes = {
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
