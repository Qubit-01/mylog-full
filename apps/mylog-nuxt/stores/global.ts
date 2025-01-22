import dayjs from 'dayjs'
import { type UserVO as User } from '@mylog-full/mix/types'
import { useDark, useToggle } from '@vueuse/core'

export const useGlobalStore = defineStore('global', () => {
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

  const isLogined = computed(() => user.id !== 0)

  return {
    user,
    isLogined,
  }
})

export default useGlobalStore
