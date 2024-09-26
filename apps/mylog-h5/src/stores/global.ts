import { getUser as getUserApi } from '@/api/user'
import type { User } from '@/types'
import useUserStore, { setToken } from './user'
import Cookies from 'js-cookie'

/**
 * # 获取用户接口全局只调用一次，所以用Promise
 * 通过token获取用户信息之后的promise，页面一般不能直接用token发请求
 * 成功返回拿到的user数据，没有token或者错误token都返回空
 * 几种情况：
 * 1. 没token，正常访问路由跳转，不会发getUser请求
 * 2. 有token，发getUser请求
 *  - token正确，正常进行注册then方法
 *  - token错误，删除错误token，重新加载页面
 * 保证进入页面后，要么没有token，要么是正确的token
 */
export const getUser: Promise<User> = new Promise((resolve, reject) => {
  const token = Cookies.get('token')
  if (token)
    getUserApi({ token }).then(res => {
      if (res) resolve(res) // 2.1 正常token
      else {
        // 2.2 错误token，回归到没有token
        ElMessage.error('用户登录信息已过期或错误，请重新登录')
        Cookies.remove('token', { domain: 'mylog.cool' })
        location.reload()
      }
    })
  else reject() // 1.没有token
})

/**
 * 哪些信息需要存入本地？
 * 1. token
 * 2. setting.pageSetting 这个页面会直接使用的
 *
 * 流程：
 * 默认值 》 本地存储 》 云端获取
 */

/**
 * Global 全局数据的类型
 */
interface Global {
  /** 用户Token */
  token: string
  /**
   * # 是否是暗黑模式（计算属性）
   * 监视 user.setting.page.theme 变化
   * 改变 html class属性
   */
  isDark: boolean
  /**
   * 目录数据
   */
  content: {
    list: ContentList
  }
}

/** 目录的数据类型 */
type ContentList = {
  /** 显示文字 */
  label: string
  /** 对应锚点，其实就是dom的id */
  anchor: string
  /** 文字样式 */
  type: number
}[]

export const useGlobalStore: () => Global = defineStore('global', () => {
  const user = useUserStore()
  const token = computed(() => Cookies.get('token') || '')

  // 主题相关 ===============================

  // 是否是暗黑模式
  const isDark = computed<boolean>({
    get: () => user.setting.page.theme === 'dark',
    set: v => (user.setting.page.theme = v ? 'dark' : 'light'),
  })

  // 主题切换
  const html = document.getElementsByTagName('html')[0]
  watchEffect(() => {
    localStorage.setItem('theme', user.setting.page.theme!)
    html.className = user.setting.page.theme!
  })

  // 目录模块
  const content = reactive<Global['content']>({
    list: [
      {
        label: '简介',
        anchor: '简介',
        type: 1,
      },
      {
        label: '目录',
        anchor: '目录',
        type: 2,
      },
      {
        label: '更新日志',
        anchor: '更新日志',
        type: 3,
      },
    ],
  })

  return {
    token,
    isDark,
    content,
  }
})

export default useGlobalStore
