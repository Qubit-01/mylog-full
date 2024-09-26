import { deleteRelation, getRelations, updateRelation } from '@/api/relation'
import type { Relation, RelationEdit } from '@/types'
import type COS from 'cos-js-sdk-v5'
import type { Node, Edge } from 'vis-network/declarations/network/Network'
import useUserStore from './user'
import { myUploadFiles } from '@/utils/cos'
import { newRelation as newRelationApi } from '@/api/relation'

const User = useUserStore()

/**
 * 应该只获取一次数据，然后只计算一次nodes和edges，然后让network渲染
 *
 * 操作数据应该在这里操作，然后通知network操作（回调）
 */
export const useRelationStore = defineStore('relation', () => {
  const loading = ref(true)

  /** 获取的原始全部relations */
  const listAll = ref<Relation[]>([])
  // 原始节点信息
  const networkData = reactive<{
    nodes: Node[]
    edges: Edge[]
    groups: string[]
  }>({
    nodes: [],
    edges: [],
    groups: [],
  })

  watch(listAll, async () => {
    const nd = await getNetworkData()
    networkData.nodes = nd.nodes
    networkData.edges = nd.edges
    networkData.groups = nd.groups
  })

  const getListAll = new Promise<Relation[]>((resolve, reject) => {
    console.info('🐤getRelations 全局只执行一次')
    loading.value = true
    getRelations({}).then(data => {
      data.forEach(r => {
        r.info._other ??= {}
      })
      listAll.value = data
      loading.value = false
      resolve(data)
    })
  })

  // 从listAll里面获取网络数据，不是直接从后端返回
  const getNetworkData = () =>
    getListAll.then(r => {
      console.log('获取网络数据')
      const nodes: Node[] = [
        { id: '0', label: User.name, color: '#daa', font: { size: 30 } },
      ]
      const edges: Edge[] = []
      const groups: string[] = []
      for (const r of listAll.value) {
        // 归纳组节点
        if (!Number(r.from) && groups.indexOf(r.from) == -1) {
          groups.push(r.from)
          nodes.push({
            id: r.from,
            label: r.from,
            color: '#ddd',
            shape: 'ellipse',
            font: { size: 20 },
          })
          edges.push({ from: 0, to: r.from })
        }
        // 解析人员节点
        nodes.push({
          id: r.id,
          label: r.name,
          group: r.from,
        })
        edges.push({
          from: r.from,
          to: r.id,
          label: r.info.label,
        })
      }
      return { nodes, edges, groups }
    })

  return { loading, listAll, getListAll, getNetworkData, networkData }
})

export default useRelationStore

const relationStore = useRelationStore()

/**
 * 发布Relation时的，默认数据，兜底
 */
export const relationInit: Readonly<RelationEdit> = {
  info: {
    label: '',
    img: '',
    phone: '',
    _other: {},
  },
}

/**
 * 新建Relation
 * 预留了文件上传
 * @param relationEdit relation对象
 * @param params 文件上传
 * @returns 新建的relation，有id
 */
export const newRelation = async (
  relationEdit: RelationEdit,
  params: COS.UploadFilesParams = { files: [] }
): Promise<Relation | undefined> => {
  if (!relationEdit.name || !relationEdit.from) {
    ElMessage.error('必须填入内容哦')
    return Promise.reject(undefined)
  }

  const relation: Relation = Object.assign(
    {},
    relationInit,
    {
      userid: User.id,
      username: User.name,
    },
    relationEdit
  ) as Relation

  const data = await myUploadFiles(params)
  const id = await newRelationApi({ relationJson: JSON.stringify(relation) })
  if (id !== '0') {
    relation.id = id
    relationStore.listAll.push(relation)
    ElMessage({ message: '新增成功：' + relation.id, type: 'success' })
    return relation
  }
}

/**
 * 编辑Relation
 * @param relationEdit 编辑对象
 * @param params 文件对象
 * @returns 影响的条数
 */
export const editRelation = async (
  relationEdit: RelationEdit & { id: string },
  params: COS.UploadFilesParams = { files: [] }
): Promise<number> => {
  const relationOld = relationStore.listAll.find(r => r.id === relationEdit.id)!

  // todo: 要删除里面的文件内容
  const count = await updateRelation({
    relationJson: JSON.stringify(relationEdit),
  })

  if (count === 1) {
    ElMessage({ message: '编辑成功', type: 'success' })
    Object.assign(relationOld, relationEdit)
  }
  return count
}

/**
 * 删除Relation
 * @param relation 删除的对象，会取id
 * @returns 删除的条数
 */
export const delRelation = async (relation: Relation): Promise<Relation> => {
  try {
    await ElMessageBox.confirm('确定删除吗？', '删除Log', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
    })
  } catch {
    return relation
  }

  // todo: 删除文件

  return deleteRelation({ id: relation.id })
    .then(count => {
      ElMessage({ message: '删除成功', type: 'success' })
      relationStore.listAll.splice(
        relationStore.listAll.findIndex(r => r.id === relation.id),
        1
      )
      return relation
    })
    .catch(err => err)
}
