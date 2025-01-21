import dayjs from 'dayjs'
import { type UserVO as User } from '@mylog-full/mix/types'
import { useDark, useToggle } from '@vueuse/core'
// import { getUser as getUserApi } from '@/api/user'
// import type { User } from '@/types'
// import useUserStore, { setToken } from './user'
// import Cookies from 'js-cookie'

/** Global 全局数据的类型 */
interface Global {
  //   /** 用户Token */
  //   token: string
  //   /**
  //    * # 是否是暗黑模式（计算属性）
  //    * 监视 user.setting.page.theme 变化
  //    * 改变 html class属性
  //    */
  //   isDark: boolean
}

export const useGlobalStore = defineStore('global', async () => {
  const headers = useRequestHeaders(['cookie'])
  const { data, refresh } =  await useFetch('https://mylog.cool:3000/user/get_user', {
    method: 'POST',
    headers: headers,
  })
  // if (import.meta.client) {
  //   window.lsq = refresh
  // }
  // console.log('🐤123', data)
  // user的数据得做默认值，因为数据库里面的数据是不全的
  // 设置默认值后，从获取的数据中覆盖
  const user = reactive<User>({
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
  })

  // 主题切换，数据驱动，外面只用改数据
  const isDark = useDark()
  /** 是否是暗黑模式 */
  // const isDark = computed<boolean>({
  //   get: () => user.setting.page.theme === 'dark',
  //   set: v => (user.setting.page.theme = v ? 'dark' : 'light'),
  // })
  watch(
    () => user.setting.page.theme,
    () => {
      console.log('🐤', isDark.value)
      if (!import.meta.server) {
        localStorage.setItem('theme', user.setting.page.theme)
        // document.getElementsByTagName('html')[0].className =
        //   user.setting.page.theme
      }
    },
    { immediate: true }
  )

  const isLogined = computed(() => user.id !== 0)

  return {
    data,
    user,
    isLogined,
  }
})

export default useGlobalStore
