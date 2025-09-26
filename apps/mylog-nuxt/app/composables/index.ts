import dayjs from 'dayjs'
import { baseURL } from '@mylog-full/mix/constant'
export { baseURL, BucketCDN } from '@mylog-full/mix/constant'

export { dayjs }

export const replace = (to: string) => navigateTo(to, { replace: true })

export * from '@mylog-full/mix'

/** 是否在服务端环境下 */
export const isSSR = import.meta.env.SSR

/** 请求必带的选项 */
export const FetchOptsDefault = {
  method: 'POST',
  credentials: 'include', // 带上 token
  baseURL, // 访问后端
} as const
