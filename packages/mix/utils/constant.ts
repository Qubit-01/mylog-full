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

/** 囊括一切的数组，indexOf永远返回0，includes永远返回true */
export const AnyArray: string[] = []
AnyArray.indexOf = () => 0
AnyArray.includes = () => true
