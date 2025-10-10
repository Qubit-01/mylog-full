import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)
export { dayjs }
export * from '@mylog-full/mix'
export * from '@mylog-full/mix/constant'

export const replace = (to: string) => navigateTo(to, { replace: true })

/** 是否在服务端环境下 */
export const isSSR = import.meta.env.SSR

/** 请求必带的选项 */
export const FetchOptsDefault = {
  method: 'POST',
  credentials: 'include', // 带上 token
  baseURL, // 访问后端
} as const
