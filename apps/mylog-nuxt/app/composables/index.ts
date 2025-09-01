export { baseURL, BucketCDN } from '@mylog-full/mix/constant'

export const replace = (to: string) => navigateTo(to, { replace: true })

export * from '@mylog-full/mix'
export type { LogVO as Log } from '@mylog-full/mix'
