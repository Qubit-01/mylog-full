// import { getUser as getUserApi } from '@/api/user'
// import type { User } from '@/types'
// import useUserStore, { setToken } from './user'
import Cookies from 'js-cookie'


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
}

export const useGlobalStore: () => Global = defineStore('global', () => {
  

  return {
  }
})

export default useGlobalStore
