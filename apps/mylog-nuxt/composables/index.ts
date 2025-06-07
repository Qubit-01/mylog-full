export { BucketCDN } from '@mylog-full/mix/constant'

export const baseURL = 'https://mylog.ink/api'

export const replace = (to: string) => navigateTo(to, { replace: true })

export type { LogVO as Log } from '@mylog-full/mix/types'
