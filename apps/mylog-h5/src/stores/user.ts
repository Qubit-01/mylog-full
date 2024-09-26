import { updateSetting } from '@/api/user'
import type { User } from '@/types'
import { getUser } from './global'
import { cloneDeep } from 'lodash'
import QC from '@/utils/qq-connect'
import Cookies from 'js-cookie'

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
interface UserStroe extends User {
  /**
   * 是否已登录（计算属性）
   */
  isLogined: boolean
}

export const useUserStore = defineStore('user', () => {
  // 当前默认用户数据，这里下面用了toRefs，所以要在这里把全部属性定义好
  const user = reactive<User>({
    id: '0',
    name: '',
    img: '',
    info: {},
    setting: {
      page: {
        theme: localStorage.getItem('theme') || 'light',
      },
      mylog: {
        tags: [],
        filters: [],
        filterIndex: -1,
        calendarTags: [],
      },
      map: {
        diyPoints: [
          // {
          //   lnglat: [103.00042, 29.983349],
          // },
          // {
          //   lnglat: [103.00042, 29.984349],
          // },
          // {
          //   lnglat: [103.00042, 29.982349],
          // },
          // {
          //   lnglat: [103.00042, 29.981349],
          // },
        ],
      },
    },
    createtime: undefined,
    openidQ: undefined,
  })

  /**
   * 是否已登录，判断。
   * 本来也是用id是否等于0判断的，但是后来感觉不对，要用token是否有，才是同步的
   * 路由这种优先级很高的东西，同步就尤为重要
   */
  const isLogined = ref<boolean>(false)

  // 云端获取用户信息
  getUser.then(
    res => {
      const userdata = cloneDeep(res)
      // 临时删掉东西
      const setting = res.setting
      // @ts-ignore 这里用deepMerge会有意想不到得bug，慎用
      delete userdata.setting
      Object.assign(user, userdata)
      Object.assign(user.setting.page, setting.page)
      Object.assign(user.setting.mylog, setting.mylog)
      Object.assign(user.setting.map, setting.map)
      isLogined.value = true
      // 获取到远端用户setting在注册监视，同步双端
      watch(user.setting, () => {
        const settingJson = JSON.stringify(user.setting)
        updateSetting({ settingJson }).then(count => {
          if (count) {
            console.log('🐤 setting 设置更改成功')
            localStorage.setItem('setting', settingJson)
          }
        })
      })
    },
    () => null
  )

  // 先去本地存储获取页面设置
  // const pageSetting = localStorage.getItem('pageSetting')
  // if (pageSetting) deepMerge(user.setting!, JSON.parse(pageSetting))

  return {
    ...toRefs(user),
    isLogined,
  }
})

export default useUserStore

/**
 * 设置用户token到cookie
 * @param token 用户token
 */
export const setToken = (token: string) => {
  Cookies.set('token', token, {
    expires: 60,
    path: '/',
    domain: 'mylog.cool',
    secure: true, // 仅https
    sameSite: 'strict', // 防止CSRF攻击和用户追踪
  })
}

/**
 * 登录后跳转，一般在获取到token后使用
 * @param token 用户token
 * @param to 跳转的位置，默认/
 */
export const loginByToken = (token: string, to: string = '/') => {
  setToken(token)
  if (to !== '') location.href = '/#' + to
  location.reload()
}

/**
 * 退出登录方法
 * 退出登录，删除 token、pageSetting
 * @param to 跳转的页面， 不传跳主页，传空串刷新当前页，传路径跳指定
 */
export const logout = (to: string = '/') => {
  Cookies.remove('token', { domain: 'mylog.cool' })
  localStorage.removeItem('pageSetting')
  QC.Login.signOut()
  if (to !== '') location.href = '/#' + to
  location.reload()
}

/**
 * 登录测试账号
 */
export const loginTest = () => {
  console.log('登录测试账号')
  loginByToken(
    'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJVc2VyVG9rZW4iLCJpZCI6NDEsIm5hbWUiOiLmtYvor5XotKblj7ciLCJpYXQiOjE3MjI0MjEwMDEsImV4cCI6MTcyNzYwNTAwMX0.NAaX9VNir9ngOL_ZZ2-xJnpnUiU_harklUhgemECRPY'
  )
}
