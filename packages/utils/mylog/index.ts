/**
 * 从后端获取数据类型，但是后端的类型是不完整的，需要进行改造
 * 如：json数据不会有详细的类型，日期也会为Date，我要转为Dayjs
 */
import { userdata } from '@mylog-full/mylog-trpc-prisma'
import { LogFilter } from './log'
import dayjs from 'dayjs'

/**
 * 用户数据结构
 */
export interface User {
  id: string
  name: string
  img: string
  info: {
    sex?: '男' | '女' | undefined
    birth?: string // 生日
    text?: string // 个性签名

    stuId?: string // 学号
    stuClass?: string // 班级
  }
  setting: {
    page: {
      // 页面设置
      theme: string // 主题 light | dark
      backgroundImage?: string // 选中的背景图片
      diyBackgroundImage?: string // 自己添加的背景图片
    }
    mylog: {
      /**
       * 用户发布时待选tags
       */
      tags: string[]
      /**
       * 用户过滤器列表
       */
      filters: LogFilter[]
      /**
       * 默认筛选器的索引
       */
      filterIndex: number
      /**
       * 日历上的待选按钮
       */
      calendarTags: string[]
    }
    map: {
      diyPoints: {
        lnglat: [number, number]
      }[]
    }
  }
  createtime?: dayjs.Dayjs
}

// /**
//  * 普通文件，加入上传要用的key，
//  * key为：文件名，上传时间-序号-文件名，
//  * 避免上传到COS时，文件名重复覆盖
//  */
// export interface KeyFile extends UploadFile {
//   key?: string
// }

// /**
//  * 图片文件：原图，压缩图，95压缩图
//  */
// export interface LogImgFile extends KeyFile {
//   raw?: ExifUploadRawFile
//   compressImg?: ExifImgFile // 压缩文件
//   compressImg95?: ExifImgFile // 95压缩文件
// }
