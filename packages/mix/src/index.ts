/** 转为完整的 Log */
export const toLog = (log: Partial<Log>): Log => ({
  id: 0,
  userid: 0,
  type: 'log',
  content: '',
  tags: [],
  imgs: [],
  videos: [],
  audios: [],
  files: [],
  location: [],
  people: [],
  info: {},
  sendtime: new Date().toISOString(),
  logtime: new Date().toISOString(),
  ...log,
})

/** 类型定义：前后端共用的 ******************/

/** UserOV 用户数据结构 */
export type User = {
  id: number
  name: string
  img: string
  info: {
    /** 性别 */
    sex?: '男' | '女'
    /** 生日 */
    birth?: string
    /** 个性签名 */
    text?: string

    /** 学号 */
    stuId?: string
    /** 班级 */
    stuClass?: string
  }
  setting: {
    /** 页面设置 */
    page: {
      /** 主题 light | dark */
      theme: 'light' | 'dark'
      /** 选中的背景图片 */
      backgroundImage?: string
      /** 自己添加的背景图片 */
      diyBackgroundImage?: string
    }
    mylog: {
      /** 用户发布时待选tags */
      tags: string[]
      /** 用户过滤器列表 */
      filters: LogFilter[]
      /** 默认筛选器的索引 */
      filterIndex: number
      /** 日历上的待选按钮 */
      calendarTags: string[]
    }
    map: {
      diyPoints: {
        lnglat: [number, number]
      }[]
    }
  }
  createtime: string
}

/** Log：都是必选，没有就是空数组 */
export interface Log extends LogEditable {
  /** LogId */
  id: number
  /** 发布者的id */
  userid: number
  /** Log类型 */
  type: 'public' | 'log' | 'tag'
  /** 发布时间 */
  sendtime: string
}

/** 可以被编辑的 Log 项 */
interface LogEditable extends LogEditWithFiles {
  /** 记录：时间 */
  logtime: string
  /** 记录：内容 */
  content: string
  /** 记录：标签 */
  tags: string[]
  /** 记录：人脉 */
  people: string[]
  /** 记录：地点 */
  location: [[number, number], string] | []
  /** 记录：其他详细 */
  info: {
    /** 记录： 爬虫数据的原始链接 */
    link?: string
    /** 记录： 是否是MD类型 */
    markdown?: boolean
    /** 记录： 爬虫数据的来源 */
    source?: string // 爬虫数据的来源
  }
}

/** 用户可以编辑的项的 key，用于 LogRelease */
export type LogItem = keyof LogEditable

/** 需要文件的项 */
type LogEditWithFiles = {
  /** 记录：图片 */
  imgs: string[]
  /** 记录：视频 */
  videos: string[]
  /** 记录：音频 */
  audios: string[]
  /** 记录：文件 */
  files: string[]
}

/** log中代表文件的项，需要和COS交互的属性，方便一些方法循环 */
export type LogFileItem = keyof LogEditWithFiles
/** 用于遍历定义顺序，files最后遍历时兜底 */
export const logFileItem: LogFileItem[] = [
  'imgs',
  'videos',
  'audios',
  'files',
] as const

/** 过滤器对象 */
export type LogFilter = {
  name?: string
  type: '' | 'log' | 'public'
  /** 时间限制，范围 */
  timeLimit: [any | null, any | null]
  /** 全部大筛选项都或运算 */
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

/** 编辑中的log类型，只能填入log属性 */
export type LogEdit = Partial<Log>
