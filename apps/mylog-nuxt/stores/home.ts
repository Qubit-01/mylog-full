import type { LogVO as Log } from '@mylog-full/mix/types'

export const useHomeStore = defineStore('home', () => {
  const logs = reactive<Log[]>([])
  const params = reactive({ skip: 0, limit: 10 })

  // 每次触发请求，都会自动 push 在 logs 最后
  const { status, refresh } = useFetch<Log[]>(BaseURL + '/log/get_publics', {
    method: 'POST',
    body: params,
    onResponse({ response }) {
      logs.push(...(response._data ?? []))
    },
  })

  /** 这里是一个触发器，用于请求下一页数据 */
  const addLogs = () => {
    params.skip += params.limit
  }

  return {
    /** 主页所有的log */
    logs,
    /** 请求参数 */
    params,
    /** 请求状态 */
    status,
    /** 触发请求数据，会自动 push 在 logs 最后 */
    addLogs,
    /** 刷新 */
    refresh,
  }
})

export const refsHomeStore = () => storeToRefs(useHomeStore())
