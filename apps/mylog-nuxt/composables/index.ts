export {
  Domain,
  WebURL,
  BaseURL,
  Bucket,
  Region,
  BucketURL,
  BucketCDN,
} from '@mylog-full/mix/utils'

export const replace = (to: string) => navigateTo(to, { replace: true })
