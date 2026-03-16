import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import type { ApiResult } from '@mylog-full/mix'

dayjs.extend(customParseFormat)
export { dayjs }
export * from '@mylog-full/mix'
export * from '@mylog-full/mix/constant'

export const replace = (to: string) => navigateTo(to, { replace: true })

/** 是否在服务端环境下 */
export const isSSR = import.meta.env.SSR

/**
 * 前端统一业务异常
 *
 * 后端虽然总是返回 HTTP 200，
 * 但只要 code !== 0，这里就把它转成一个可捕获的 Error。
 */
class ApiError extends Error {
  code: number
  data: unknown

  constructor(code: number, message: string, data: unknown = null) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.data = data
  }
}

/** 判断一个值是不是后端约定的 { code, message, data } 结构 */
const isApiResult = (value: unknown): value is ApiResult => {
  if (!value || typeof value !== 'object') return false
  const result = value as Record<string, unknown>
  return (
    typeof result.code === 'number' &&
    typeof result.message === 'string' &&
    'data' in result
  )
}

/** 判断一个响应是不是业务失败 */
export const isApiErrorResult = (value: unknown): value is ApiResult => {
  return isApiResult(value) && value.code !== 0
}

/**
 * 统一解包后端返回。
 *
 * - 普通接口：直接返回原值
 * - ApiResult 且 code=0：返回 data
 * - ApiResult 且 code!=0：抛 ApiError
 */
const unwrapApiResult = <T>(value: T | ApiResult<T>) => {
  if (!isApiResult(value)) return value as T
  if (value.code === 0) return value.data as T
  throw new ApiError(value.code, value.message, value.data)
}

/** 请求必带的选项 */
export const FetchOptsDefault = {
  method: 'POST',
  credentials: 'include', // 带上 token
  baseURL, // 访问后端
} as const

/**
 * 动作型请求
 *
 * 适合登录、注册、保存、删除这类“点一下才触发”的请求：
 * - 成功时直接返回真正的 data
 * - 失败时抛 ApiError，业务层用 try/catch 处理
 */
export const $fetchApi = async <T>(
  url: string,
  options: Record<string, unknown> = {},
) => {
  const result = await $fetch<T | ApiResult<T>>(url, {
    ...FetchOptsDefault,
    ignoreResponseError: true,
    ...options,
  })

  return unwrapApiResult<T>(result)
}

/**
 * 状态型请求
 *
 * 适合 SSR、页面初始化、store 数据流：
 * - 保留 useFetch 的状态管理能力
 * - 在 transform 阶段统一解包后端协议
 */
export const useFetchApi = <T>(
  url: string,
  options: Record<string, unknown> = {},
) => {
  return useFetch<T>(url, {
    ...FetchOptsDefault,
    ignoreResponseError: true,
    ...options,
    transform: (input: T | ApiResult<T>) => unwrapApiResult<T>(input),
  } as never)
}
