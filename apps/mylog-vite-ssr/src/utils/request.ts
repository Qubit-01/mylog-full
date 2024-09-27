import axios from 'axios'
import { ElMessage } from 'element-plus'
import { baseURL } from '@/stores/constant'
/**
 * 组件 --1--> API --2--> request
 *
 * 1 语义化接口，参一传入参数，参二传入配置项，返回Promise
 * Promise Login(data, options)
 * 2 定义请求方法、参数、默认配置
 * request({
 *   method: 'post',
 *   url: '/user/login',
 *   data: { name: 'xxx', pswd: 'xxx' },
 *   headers: {},
 *   options: {}
 * })
 *
 */

const request = axios.create({
  baseURL,
  headers: {
    post: {
      // axios 默认json，但是后端要加注解，麻烦
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  },
})

// 请求处理器
request.interceptors.request.use(
  config => {
    return config
  },
  error => {
    Promise.reject(error)
  }
)

// 响应处理器
request.interceptors.response.use(
  res => {
    return res.data
  },
  error => {
    ElMessage.error('请求错误')
    return Promise.reject(error)
  }
)

// 防抖方法，参一传入函数，参二传入延迟时间
export function debounce(
  fn: Function,
  delay: number
): (...args: any[]) => void {
  let timer: NodeJS.Timeout
  return (...args: any[]) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

export default request
