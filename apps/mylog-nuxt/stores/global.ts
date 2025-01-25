import dayjs from 'dayjs'
import { type UserVO as User } from '@mylog-full/mix/types'
// import { useDark, useToggle } from '@vueuse/core'

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
  createtime: dayjs().valueOf(),
}

export const useGlobalStore = defineStore('global', () => {
  const { data } = useFetch<User>('https://mylog.cool:3000/user/get_user', {
    method: 'POST',
    headers: useRequestHeaders(['cookie']),
  })

  const user = computed<User>(() => ({ ...userInit, ...data.value }))
  const isLogined = computed(() => user.value.id !== 0)
  // 主题切换
  const link = computed(() => {
    const theme = user.value.setting.page.theme
    if (import.meta.client) document.documentElement.className = theme
    return [
      { rel: 'stylesheet', href: `https://mylog.cool/theme/${theme}.css` },
    ]
  })
  useHead({ link })

  return {
    /** 用户全数据 */
    user,
    /** 是否登录 */
    isLogined,
  }
})
