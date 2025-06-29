import dayjs from 'dayjs'

/** UserOV 用户数据结构 */
export type UserVO = {
  id: number
  name: string
  img: string
  info: {
    /** 性别 */
    sex?: '男' | '女' | undefined
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
  createtime: number
}

/** LogVO：都是必选，没有就是空数组 */
export type LogVO = {
  /** LogId */
  id: number
  /** 发布者的id */
  userid: number
  /** Log类型 */
  type: 'public' | 'log' | 'tag'
  /** 发布时间 */
  sendtime: dayjs.Dayjs
  /** 记录：时间 */
  logtime: dayjs.Dayjs
  /** 记录：内容 */
  content: string
  /** 记录：标签 */
  tags: string[]
  /** 记录：图片 */
  imgs: string[]
  /** 记录：视频 */
  videos: string[]
  /** 记录：音频 */
  audios: string[]
  /** 记录：文件 */
  files: string[]
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

//   /** 人脉的数据结构 */
//   export interface Relation {
//     id: string
//     userid: string // 创建者
//     username: string
//     from: string // 前节点，这里用字符串转换判断是不是组节点
//     name: string // 人的名字
//     info: {
//       // 一级放入系统要用的数据，键的名字由开发者设置，_other里面的由用户定义
//       label?: string // 线条标签
//       img?: string // 头像
//       phone?: string // 手机号码
//       _other: {
//         [key in string]: any // 自定义项
//       }
//     }
//   }

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

/** 用户可以设置的项 */
export type LogItem =
  | 'content'
  | 'info'
  | 'logtime'
  | 'tags'
  | 'imgs'
  | 'videos'
  | 'audios'
  | 'files'
  | 'location'
  | 'people'

/** log中代表文件的项，需要和COS交互的属性，方便一些方法循环 */
export type LogFileItem = 'imgs' | 'videos' | 'audios' | 'files'

/** 编辑中的log类型，只能填入log属性 */
export type LogEdit = Partial<LogVO>

/** 编辑中的log类型，只能填入log属性 */
// export type RelationEdit = Partial<Relation>
