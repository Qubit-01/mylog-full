export const useMylogStore = defineStore('mylog', () => {
  /** 装所有log */
  const logsMap = ref<Record<number, Log>>({})
  const params = reactive<{
    skip: number
    limit: number
    filter?: LogFilter
  }>({ skip: 0, limit: 10 })
  const noMore = ref(false)

  // 每次触发请求，都会自动 push 在 logs 最后
  const { status, refresh } = useFetch<Log[]>('/log/get_mylogs', {
    ...FetchOptsDefault,
    headers: { Cookie: `token=${useCookie('token').value}` },
    body: params,
    onResponse({ response }) {
      const logsRes = response._data
      if (!logsRes) return
      logsRes.forEach((l) => (logsMap.value[l.id] = l))
      if (logsRes.length < params.limit) noMore.value = true
    },
  })

  /** 这里是一个触发器，用于请求下一页数据 */
  const addLogs = () => {
    if (noMore.value) return
    params.skip += params.limit
  }

  /** 真正展示的logs 筛选，排序 */
  const logs = computed(() =>
    Object.values(logsMap.value)
      .toSorted((a, b) => b.logtime.localeCompare(a.logtime))
      .filter((l) => matchesLogFilter(l, params.filter))
      .slice(0, params.skip + params.limit),
  )

  return {
    logsMap,
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
