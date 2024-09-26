import type { Log } from '@/types'
import request from '@/utils/request'
import useGlobalStore from '@/stores/global'

const Global = useGlobalStore()

/**
 * 获取public列表
 * 传入userid，就是通过用户查找public
 * 传入skip和limit
 */
export const getPublics = (params: {
  userid?: string
  skip: number
  limit: number
}): Promise<Log[]> => {
  return request({
    url: 'log/get_publics',
    method: 'get',
    params,
  })
}

/**
 * 通过token获取log列表，全部
 * 不传page参数就返回全部
 * get_logs_all_by_userid
 */
export const getMylogs = (
  params:
    | {
        token?: string
        skip?: number
        limit?: number
      }
    | {
        share: string
      }
): Promise<Log[]> => {
  return request({
    url: 'log/get_mylogs',
    method: 'get',
    params: { token: Global.token, ...params },
  })
}

/**
 * 通过token获取todo列表，全部
 */
export const getTodos = (data: { token?: string }): Promise<Log[]> => {
  return request({
    url: 'log/get_todos',
    method: 'get',
    params: { token: Global.token, ...data },
  })
}

/**
 * 通过token获取log列表，全部
 * 不传page参数就返回全部
 * get_logs_all_by_userid
 */
export const getTags = (data: { token?: string }): Promise<Log[]> => {
  return request({
    url: 'log/get_tags',
    method: 'get',
    params: { token: Global.token, ...data },
  })
}

/**
 * 通过logid在public里面查找log
 * log/get_log_by_id?id=3584
 */
export const getPublic = (params: { id: number }): Promise<Log> => {
  return request({
    url: 'log/get_public',
    method: 'get',
    params,
  })
}

/**
 * 新建log
 * @param data log要是json字符串
 * @returns 新建log的id
 */
export const releaseLog = (data: {
  token?: string
  logJson: string
}): Promise<string> => {
  return request({
    url: 'log/release_log',
    method: 'post',
    data: { token: Global.token, ...data },
  })
}

/**
 * 编辑log
 * @param data log要是json字符串，必须要传入logid
 * @returns 编辑的条数
 */
export const updateLog = (data: {
  token?: string
  logJson: string
}): Promise<number> => {
  return request({
    url: 'log/update_log',
    method: 'post',
    data: { token: Global.token, ...data },
  })
}

/**
 * 删除log
 * @param data log要是json字符串
 * @returns 删除的条数
 */
export const deleteLog = (data: {
  token?: string
  id: string
}): Promise<number> => {
  return request({
    url: 'log/delete_log',
    method: 'post',
    data: { token: Global.token, ...data },
  })
}

/**
 * 获取link密文
 *
 */
export const getShare = (data: {
  token?: string
  logIdsJson: string
}): Promise<string> => {
  return request({
    url: 'log/get_share',
    method: 'post',
    data: { token: Global.token, ...data },
  })
}
