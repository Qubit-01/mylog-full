export { baseURL, BucketCDN } from '@mylog-full/mix/constant'

export const replace = (to: string) => navigateTo(to, { replace: true })

export * from '@mylog-full/mix'

/** 是否在服务端环境下 */
export const isSSR = import.meta.env.SSR
