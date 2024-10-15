/**
 * 从后端获取数据类型，但是后端的类型是不完整的，需要进行改造
 * 如：json数据不会有详细的类型，日期也会为Date，我要转为Dayjs
 */
import { log as DbLog } from '@mylog-full/mylog-trpc-prisma'
import dayjs from 'dayjs'

/**
 * Log的数据结构，这里不做可选处理
 * 都必须有，但是可以为空数组
 */
export interface Log {
  id: number
  userid: number
  username: string
  type: 'public' | 'log' | 'tag' | 'todo'
  sendtime: dayjs.Dayjs // 发送时间
  logtime: dayjs.Dayjs // 记录时间
  content: string
  tags: string[]
  imgs: string[]
  videos: string[]
  audios: string[]
  files: string[]
  location: [[number, number], string] | []
  people: string[]
  info: {
    title?: string // log的标题
    link?: string // 爬虫数据的原始链接
    markdown?: boolean // 是否是MD类型
    source?: string // 爬虫数据的来源
    todo?: {
      complete: boolean // 是否完成
      level: number // 优先级
    }
  }
}

/**
 * 对后端回传的log进行处理，其中的属性加工为前端需要的东西
 * sendtime、logtime
 * 日期要从 string 转为 dayjs
 */
export const handleLog = (log: any): Log => {
  const newLog: Log = {
    ...log,
    sendtime: dayjs(log.sendtime),
    logtime: dayjs(log.logtime),
  }
  return newLog
}

// /**
//  * 人脉的数据结构
//  */
// export interface Relation {
//   id: string
//   userid: string // 创建者
//   username: string
//   from: string // 前节点，这里用字符串转换判断是不是组节点
//   name: string // 人的名字
//   info: {
//     // 一级放入系统要用的数据，键的名字由开发者设置，_other里面的由用户定义
//     label?: string // 线条标签
//     img?: string // 头像
//     phone?: string // 手机号码
//     _other: {
//       [key in string]: any // 自定义项
//     }
//   }
// }

// /**
//  * 用户可以设置的项
//  */
// export type LogItem =
//   | 'content'
//   | 'info'
//   | 'logtime'
//   | 'tags'
//   | 'imgs'
//   | 'videos'
//   | 'audios'
//   | 'files'
//   | 'location'
//   | 'people'

// /**
//  * log中代表文件的项，需要和COS交互的属性
//  * 方便一些方法循环
//  */
// export type LogFileItem = 'imgs' | 'videos' | 'audios' | 'files'

// type LogFileTypes = {
//   imgs: LogImgFile[]
//   videos: KeyFile[]
//   audios: KeyFile[]
//   files: KeyFile[]
// }

// /**
//  * log上传前的文件类型要求（最后都是COS文件）
//  */
// export type LogFiles = {
//   [K in LogFileItem]: LogFileTypes[K]
// }

// /**
//  * 编辑中的log类型，只能填入log属性
//  */
// export type LogEdit = Partial<Log>

// /**
//  * 编辑中的log类型，只能填入log属性
//  */
// export type RelationEdit = Partial<Relation>

// /**
//  * 结合 El的UploadRawFile 和 ExifImgFile，
//  * 就是有EXIF信息的El Raw文件
//  */
// export interface ExifUploadRawFile extends UploadRawFile, ExifImgFile {}

/**
 * 过滤器对象
 */
export interface LogFilter {
  name?: string
  type: '' | 'log' | 'public'
  /**
   * 时间限制，范围
   */
  timeLimit: [any | null, any | null]
  /**
   * 全部大筛选项都或运算
   */
  isOrAll: boolean
  content: {
    include: string[]
    isOr: boolean
  }
  people: {
    include: string[]
    isOr: boolean
  }
  tags: {
    include: string[]
    isOr: boolean
  }
  exclude: string[] // 排除，填入id
}
