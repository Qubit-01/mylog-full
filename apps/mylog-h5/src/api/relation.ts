import useGlobalStore from '@/stores/global'
import type { Relation } from '@/types'
import request from '@/utils/request'

const Global = useGlobalStore()

/**
 * 通过token获取log列表，全部
 * 不传page参数就返回全部
 * get_logs_all_by_userid
 */
export const getRelations = (params: { token?: string }): Promise<Relation[]> => {
  return request({
    url: 'relation/get_relations',
    method: 'get',
    params: { token: Global.token, ...params },
  })
  // return Promise.resolve([
  //   {
  //     id: '100',
  //     userid: '1',
  //     username: 'Sybit',
  //     from: '朋友',
  //     name: '张三',
  //     info: {
  //       _other: {
  //         爱好: '打球',
  //       },
  //     },
  //   },
  // ])
}

/**
 * 新建relation
 * @param token 用户令牌
 * @param relationJson relation的json字符串
 * @return 新建的relation的id
 */
export const newRelation = (data: {
  token?: string
  relationJson: string
}): Promise<string> => {
  return request({
    url: 'relation/new_relation',
    method: 'post',
    data: { token: Global.token, ...data },
  })
}

/**
 * 编辑relation
 * @param token 用户令牌
 * @param relationJson edit对象
 * @return 影响的条数
 */
export const updateRelation = (data: {
  token?: string
  relationJson: string
}): Promise<number> => {
  return request({
    url: 'relation/update_relation',
    method: 'post',
    data: { token: Global.token, ...data },
  })
}

/**
 * 删除relation
 * @param token 用户令牌
 * @param id relation的id
 * @return 删除的条数
 */
export const deleteRelation = (data: {
  token?: string
  id: string
}): Promise<Number> => {
  return request({
    url: 'relation/delete_relation',
    method: 'post',
    data: { token: Global.token, ...data },
  })
}
