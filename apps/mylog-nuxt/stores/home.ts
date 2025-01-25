import type { LogVO as Log } from '@mylog-full/mix/types'

export const useHomeStore = defineStore('home', () => {
  const logs = reactive<Log[]>([])
  const params = reactive({ skip: 0, limit: 5 })
  const { data, status } = useFetch<Log[]>(
    'https://mylog.cool:20914/log/get_publics',
    {
      method: 'POST',
      body: params,
    },
  )

  /**
   * 这里是一个触发器，用于请求下一页数据
   */
  const addLogs = () => {
    params.skip += params.limit
  }

  watch(
    status,
    (value) => {
      if (value === 'success') {
        logs.push(...(data.value ?? []))
      }
    },
    { immediate: true },
  )

  //   const logs = reactive([])

  return {
    /** 主页所有的log */
    logs,
    /** 请求参数 */
    params,
    /** 请求状态 */
    status,
    /** 触发请求数据，会自动 push 在 logs 最后 */
    addLogs,
  }
})

export const refsHomeStore = () => storeToRefs(useHomeStore())
