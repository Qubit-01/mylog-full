export const useMylogStore = defineStore('mylog', () => {
  const logs = ref<Log[]>([])
  const params = reactive({ skip: 0, limit: 10 })
  const noMore = ref(false)

  // 每次触发请求，都会自动 push 在 logs 最后
  const { status, refresh } = useFetch<Log[]>('/log/get_mylogs', {
    ...FetchOptsDefault,
    headers: {
      Cookie: `token=${useCookie('token').value}`,
    },
    body: params,
    onResponse({ response }) {
      const logsRes = response._data
      if (!logsRes) return
      logs.value.push(...logsRes)
      if (logsRes.length < params.limit) noMore.value = true
    },
  })

  /** 这里是一个触发器，用于请求下一页数据 */
  const addLogs = () => {
    if (noMore.value) return
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
    /** 重新请求 */
    refresh,
  }
})

export const refsMylogStore = () => storeToRefs(useMylogStore())
