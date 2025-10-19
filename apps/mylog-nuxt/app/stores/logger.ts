export const useLoggerStore = defineStore('logger', () => {
  const { user } = refsGlobalStore()
  const logs = ref<Log[]>([])
  const params = reactive({ skip: 0, limit: 20, userid: user.value.id })
  const noMore = ref(false)

  // 每次触发请求，都会自动 push 在 logs 最后
  const { status, refresh } = useFetch<Log[]>('/log/get_publics', {
    key: 'logger',
    ...FetchOptsDefault,
    headers: { Cookie: `token=${useCookie('token').value}` },
    body: params,
    onResponse({ response }) {
      const logsRes = response._data
      if (!logsRes) return
      logs.value.push(...logsRes)
      if (logsRes.length < params.limit) noMore.value = true
    },
  })

  /** 请求下一页数据 */
  const fetchLogs = () => {
    if (noMore.value) return
    params.skip += params.limit
  }

  return {
    logs,
    /** 请求参数 */
    params,
    /** 请求状态 */
    status,
    /** 触发请求数据，会自动 push 在 logs 最后 */
    fetchLogs,
    /** 重新请求 */
    refresh,
  }
})

export const refsLoggerStore = () => storeToRefs(useLoggerStore())
