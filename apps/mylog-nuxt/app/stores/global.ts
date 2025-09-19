import dayjs from 'dayjs'

const userInit: User = {
  id: 0,
  name: '',
  img: '',
  info: {},
  setting: {
    page: {
      theme: 'light',
    },
    mylog: {
      tags: [],
      filters: [],
      filterIndex: 0,
      calendarTags: [],
    },
    map: {
      diyPoints: [],
    },
  },
  createtime: new Date().toISOString(),
} as const

/**
 * 全局数据store，这个不能解构
 *
 * user 用户数据，
 * 1. 由于服务端数据是不对齐的，要覆盖initUser
 * 2. 必须等服务器获取到用户数据
 */
export const useGlobalStore = defineStore('global', () => {
  const { data } = useFetch<User>('/user/get_user', {
    ...FetchOptsDefault,
    headers: {
      Cookie: `token=${useCookie('token').value}`,
    },
  })

  const user = computed<User>(() => ({ ...userInit, ...data.value }))
  const isLogined = computed(() => user.value.id !== 0)

  // 主题切换
  const link = computed(() => {
    const theme = user.value.setting.page.theme
    if (import.meta.client) document.documentElement.className = theme
    return [{ rel: 'stylesheet', href: `/theme/${theme}.css` }]
  })
  useHead({ link })

  return {
    /** 用户全数据 */
    user,
    /** 是否登录 */
    isLogined,
  }
})

/**
 * 这个是可以通过结构使用的store
 * 但是拿不到 store 中定义的方法
 *
 * 如果只是在模板中使用，使用这个API直接解构会更简洁，不用每次都写.value，也不用每次都 Store 名打头
 */
export const refsGlobalStore = () => storeToRefs(useGlobalStore())
