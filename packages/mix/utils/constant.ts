// import type { LogFileItem } from "@/types"
export const isDev = process.env.NODE_ENV !== 'production'
/** 域名 */
export const Domain = 'https://mylog.ink'
/** 后端URL前缀 */
export const baseURL = Domain + '/api'
/* 存储桶 */
export const Bucket = 'bit-1310383539'
/* 所在地域 */
export const Region = 'ap-chengdu'
/* COS地址 */
export const bucketURL = Bucket + '.cos.' + Region + '.myqcloud.com/'
/** CDN加速域名 */
export const BucketCDN = 'https://cos.mylog.ink/'

// 这里files必须放在最后，遍历时兜底
// export const logFileItem: LogFileItem[] = ['imgs', 'videos', 'audios', 'files']

// 创造一个indexOf永远返回0的数组
const anyArray: string[] = []
anyArray.indexOf = () => 0
anyArray.includes = () => true

/**
 * 可以上传的文件类型
 */
// export const fileType: { [K in LogFileItem]: string[] } = {
//   imgs: ['image/png', 'image/gif', 'image/jpeg', 'image/jpg'],
//   videos: ['video/mp4', 'video/quicktime'],
//   audios: ['audios/mp3'], // 这里随便写的
//   files: anyArray,
// }

// /**
//  * 文件的大小限制
//  */
// export const fileSize: { [K in LogFileItem]: number } = {
//     imgs: 10 * 1024 * 1024, // 图片大小限制，字节
//     videos: 500 * 1024 * 1024, // 大小限制，字节
//     audios: 100 * 1024 * 1024,
//     files: 2000 * 1024 * 1024,
//   }
