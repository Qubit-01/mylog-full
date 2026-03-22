/** 每页的条数 */
const limit = 20

export const useLoggerStore = defineStore('logger', () => {
  const { user } = refsGlobalStore()
  const logs = ref<Log[]>([])
  const skip = ref(0)
  const params = computed(() => ({
    skip: skip.value,
    limit,
    userid: user.value.id,
  }))
  const noMore = ref(false)

  // 每次触发请求，都会自动 push 在 logs 最后
  const { data, status, refresh } = useFetchApi<Log[]>('/log/get_publics', {
    key: 'logger',
    immediate: false,
    headers: { Cookie: `token=${useCookie('token').value}` },
    body: params,
  })

  watch(data, (logsRes) => {
    if (!logsRes) return
    logs.value.push(...logsRes)
    if (logsRes.length < limit) noMore.value = true
  })

  /** 请求下一页数据 */
  const fetchLogs = () => {
    if (noMore.value) return
    skip.value += limit
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
