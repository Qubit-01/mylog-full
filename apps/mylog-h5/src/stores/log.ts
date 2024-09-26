import type { Log, LogEdit, LogFileItem, LogFilter } from '@/types'
import { myUploadFiles, myDeleteFiles, cosPath } from '@/utils/cos'
import COS from 'cos-js-sdk-v5'
import dayjs from 'dayjs'
import {
  getPublics,
  getMylogs,
  releaseLog,
  deleteLog,
  updateLog,
  getTags,
  getTodos,
} from '@/api/log'
import useUserStore from './user'
import { logFileItem } from './constant'

const User = useUserStore()

/**
 * 直接查全部的数据项
 */
export interface AllStore {
  /**
   * 存储所有数据
   */
  listAll: Log[]
  /**
   * 加载状态
   */
  loading: boolean
  /**
   * 获取所有mylog，会直接覆盖listAll
   */
  getLogs: () => Promise<void>
}

/**
 * 要分页查询需要的数据项
 */
export interface PageStore {
  /**
   * 真正显示的数据
   */
  list: Log[]
  /**
   * 请求参数
   */
  params: { skip: number; limit: number }
  /**
   * 加载状态
   */
  loading: boolean
  /**
   * 是否还有数据
   */
  noMore: boolean
  /**
   * 分页添加log
   */
  addLogs: () => Promise<void>
}

// mylog的类型
export interface MylogStore extends AllStore, PageStore {
  /**
   * 通过参数显示的数据
   */
  // list: Log[]
  /**
   * 存储所有数据
   */
  listAll: Log[]
  /**
   * 过滤器
   */
  filter: LogFilter | undefined
  /**
   * 经过筛选后的Log列表，计数属性
   */
  listFilter: Log[]
  /**
   * 每次调用都会重置params，重新筛选
   * @param filter 过滤器
   */
  setFilter: (filter?: LogFilter) => void
}

/**
 * 这里定个标准, 后端回传的log, 除了location都不能为null
 * 数组没有值就是 [], 对象没有值就是 {}
 */
export const useLogStore = defineStore('log', () => {
  // 首页的logs，每时每刻都是完好的数据
  const home = reactive<PageStore>({
    list: [],
    params: { skip: 0, limit: 20 },
    loading: true,
    noMore: false,
    addLogs: async () => {
      if (home.noMore) return
      home.loading = true
      const data = await getPublics(home.params)
      if (data.length < home.params.limit) home.noMore = true
      data.forEach(handleLog)
      home.list.push(...data)
      home.params.skip += home.params.limit
      home.loading = false
    },
  })

  // todos，不分页直接获取全部
  const todos = reactive<AllStore>({
    listAll: [],
    loading: true,
    getLogs: async () => {
      console.log('🐤')
      todos.loading = true
      const data = await getTodos({})
      data.forEach(handleLog)
      console.log('🐤', data)
      todos.listAll = data
      todos.loading = false
    },
  })

  // 日历Tags，不分页直接获取全部
  const tags = reactive<AllStore>({
    listAll: [],
    loading: true,
    getLogs: async () => {
      tags.loading = true
      const data = await getTags({})
      data.forEach(handleLog)
      tags.listAll = data
      tags.loading = false
    },
  })

  /**
   * all在获取时就要排序，插入时就要插入到应有位置，避免sort耗费性能
   * 后端传来的数据就是排好的，前端插入逻辑尽量不用sort，编辑逻辑先删再插入
   * 删除逻辑也避免使用filter
   */
  const mylog: MylogStore = reactive({
    list: computed<Log[]>(() => mylog.listFilter.slice(0, mylog.params.skip)),
    listAll: [],
    filter: undefined,
    listFilter: computed<Log[]>(() =>
      mylog.listAll.filter(log => filteLog(log, mylog.filter))
    ), // 由all筛选而来
    // 每次调用都会重置params，重新筛选
    setFilter: (filter?: LogFilter) => {
      mylog.params.skip = 0
      mylog.filter = filter
      mylog.addLogs()
    },
    params: { skip: 0, limit: 10 },
    loading: true,
    noMore: false,
    addLogs: async () => {
      if (mylog.params.skip > mylog.listFilter.length) {
        mylog.noMore = true
        return
      }
      mylog.params.skip += mylog.params.limit
    },
    getLogs: async () => {
      mylog.loading = true
      const logs = await getMylogs({})
      logs.forEach(handleLog)
      mylog.listAll = logs
      mylog.addLogs() // 加载完成后立即加载几个数据
      mylog.loading = false
    },
  })

  /**
   * 从all中获取真实的log对象
   * @param log 取出id属性去比较
   * @return 返回log对象，没找到就undefined
   */
  const getLog = (log: LogEdit) => mylog.listAll.find(l => l.id === log.id)

  /**
   * 添加单个log，目前用于发布后。
   * 独立addLog方法，判断log应该加入哪个列表
   * home和logger是分页查询，会被public影响
   * @param log log对象
   */
  const addLog = (log: Log) => {
    // 如果是todo
    if (log.type === 'todo') {
      const i = todos.listAll.findIndex(l => l.logtime <= log.logtime)
      if (i === -1) todos.listAll.push(log) // 没有找到，插入末尾
      else todos.listAll.splice(i, 0, log) // 插入
      return
    }
    // 如果是tag
    if (log.type === 'tag') {
      const i = tags.listAll.findIndex(l => l.logtime <= log.logtime)
      if (i === -1) tags.listAll.push(log) // 没有找到，插入末尾
      else tags.listAll.splice(i, 0, log) // 插入
      return
    }
    // 如果是public，会影响home和logger，重置两个
    if (log.type === 'public') {
      home.list = []
      home.params.skip = 0
      home.loading = true
      home.noMore = false
    }
    // 最后无论如何都要插入mylog的
    const i = mylog.listAll.findIndex(l => l.logtime <= log.logtime)
    // 如果没有找到（也就是新元素的 logtime 是最大的），就将新元素插入到列表的末尾
    if (i === -1) mylog.listAll.push(log)
    else mylog.listAll.splice(i, 0, log)
  }

  /**
   * 删除单个log
   * @param log 必须要包含id，和其他对象
   * @return 返回被删除的log
   */
  const delLog = (log: LogEdit) => {
    if (!log.id) return
    let i: number
    if (log.type === 'tag') {
      i = tags.listAll.findIndex(l => l.id === log.id)
      return tags.listAll.splice(i, 1)[0]
    }
    // 如果是公开的，就去两个地方删除，没有就不管
    if (log.type === 'public') {
      i = home.list.findIndex(l => l.id === log.id)
      if (i !== -1) home.list.splice(i, 1)
    }
    i = mylog.listAll.findIndex(l => l.id === log.id)
    return mylog.listAll.splice(i, 1)[0]
  }

  /**
   * 编辑单个log，逻辑是先删掉，浅覆盖，再添加
   * 所以现在的逻辑是 先通过id找到这个元素，然后修改，如果修改了logtime再删除添加
   * @param logEdit 一定要有id
   * @return 编辑的log
   */
  const editLog = (logEdit: LogEdit) => {
    const log = logStore.getLog(logEdit)!
    if (!log) return
    Object.assign(log, logEdit)
    // 如果修改的是logtime，就先删再加
    if (logEdit.logtime) addLog(delLog(log)!)
    return log
  }

  return {
    home, // 首页
    mylog, // 记录页
    todos, // todo页
    tags, // 日历页
    getLog,
    addLog,
    delLog,
    editLog,
  }
})

export default useLogStore

const logStore = useLogStore()

/**
 * 处理单个Log，直接操作参数
 * 1. 以前要转json,现在不用了
 * 2. 时间要处理, 用dayjs转
 */
export const handleLog = (log: any): void => {
  log.id = String(log.id)
  log.logtime = dayjs(log.logtime)
  log.sendtime = dayjs(log.sendtime)
}

/**
 * 发布Log时的，默认数据，兜底
 */
export const logInit: LogEdit = {
  type: 'log',
  // logtime: dayjs(), // 一般不用，他要自己算
  content: '',
  tags: [],
  imgs: [],
  videos: [],
  audios: [],
  files: [],
  location: [],
  people: [],
  info: {},
}

/**
 * 发布log，并上传文件，返回有正确id的log
 * @param log log对象，部分
 * @param file 要上传的文件
 */
export const rlsLog = async (
  logEdit: LogEdit,
  params: COS.UploadFilesParams = { files: [] }
): Promise<Log | undefined> => {
  if (!logEdit.content) {
    ElMessage.error('必须填入内容哦')
    return Promise.reject(undefined)
  }
  // 填入必要数据：userid, username, sendtime
  // logtime没有就用当前默认
  const log: Log = Object.assign(
    {},
    logInit,
    {
      userid: User.id,
      username: User.name,
      sendtime: dayjs(),
      logtime: dayjs(),
    },
    logEdit
  ) as Log

  const data = await myUploadFiles(params)
  const id = await releaseLog({ logJson: JSON.stringify(log) })
  if (id !== '0') {
    log.id = id
    logStore.addLog(log)
    ElMessage({ message: '发布成功：' + log.id, type: 'success' })
    return log
  }
}

/**
 * 编辑Log，先看文件，再编辑log
 * log只传入要修改的项（只有文件需要对比，要区分哪些文件需要删除和上传）
 * @param log 编辑的Log对象，这个里面的属性是log要最终成为的样子，不分添加或覆盖，id必传
 * @param params 可以不传，文件上传参数，{files[]文件列表，SliceSize? 触发分块的大小，onProgress? 进度条方法}
 * @returns 受影响log的条数
 */
export const editLog = async (
  logEdit: LogEdit & { id: string },
  params: COS.UploadFilesParams = { files: [] }
): Promise<number> => {
  const logOld = logStore.getLog(logEdit)!

  // 记录一下要上传的文件的Key，后面要去除
  const uploadImgs = params.files.map(i => i.Key)

  // 筛选要删除的文件对象
  const delObjs: { Key: string }[] = []
  logFileItem.forEach(type => {
    if (logEdit[type]) {
      ;(logOld[type] as string[])
        .filter(i => !logEdit[type]?.includes(i)) // 找old里面没有的
        .forEach(i => {
          const Key = `${cosPath()}${type}/${i}`

          // 文件的键还不能是上传文件里面的
          if (!uploadImgs.includes(Key)) {
            delObjs.push({ Key })
            if (type === 'imgs')
              delObjs.push({ Key: `${cosPath()}compress-imgs/${i}` })
          }
        })
    }
  })
  console.log(logEdit, params, delObjs)
  // return Promise.resolve(1)

  const data = await Promise.all([
    myDeleteFiles(delObjs),
    myUploadFiles(params),
  ])
  const count = await updateLog({ logJson: JSON.stringify(logEdit) })
  if (count === 1) {
    ElMessage({ message: '编辑成功', type: 'success' })
    logStore.editLog(logEdit)
  }
  return count
}

/**
 * 删除Log，先删文件，再删log
 * @param log 删除的Log对象
 * @returns 参一为null，既成功
 */
export const delLog = async (log: Log): Promise<Log> => {
  if (log.type !== 'tag') {
    try {
      await ElMessageBox.confirm('确定删除吗？', '删除Log', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
      })
    } catch {
      return log
    }
  }

  // 先删文件，再删log
  const objects: { Key: string }[] = []
  logFileItem.forEach(type => {
    log[type].forEach(i => {
      objects.push({ Key: `${cosPath()}${type}/${i}` })
      if (type === 'imgs')
        objects.push({ Key: `${cosPath()}compress-imgs/${i}` })
    })
  })

  return myDeleteFiles(objects)
    .then(data => {
      return deleteLog({ id: log.id! }).then(count => {
        ElMessage({ message: '删除成功', type: 'success' })
        logStore.delLog(log)
        return log
      })
    })
    .catch(err => err)
}

/**
 * 传入一个log，返回布尔值
 * @param log Log对象
 * @param filter 过滤器对象
 * @return 为真就是满足，false就是不满足
 */
export const filteLog = (log: Log, filter?: LogFilter): boolean => {
  // 参二传入null，直接返回true
  if (!filter) return true

  // 记录状态
  if (filter.type !== '' && log.type != filter.type) return false

  // 时间限制，包含两头
  if (filter.timeLimit[0] && log.logtime.diff(dayjs(filter.timeLimit[0])) < 0)
    return false
  if (
    filter.timeLimit[1] &&
    log.logtime.diff(dayjs(filter.timeLimit[1])) > 86400000
  )
    return false

  // 排除
  if (filter.exclude.includes(log.id!)) return false

  const includes = (filter: string[], logV: string[], isOr: boolean) => {}

  if (filter.content.include.length) {
    const f = filter.content.isOr
      ? filter.content.include.some(c => log.content.includes(c))
      : filter.content.include.every(c => log.content.includes(c))
    if (f) {
      if (filter.isOrAll) return true
    } else {
      return false
    }
  }

  if (filter.people.include.length) {
    const f = filter.people.isOr
      ? filter.people.include.some(c => log.people!.includes(c))
      : filter.people.include.every(c => log.people!.includes(c))
    if (f) {
      if (filter.isOrAll) return true
    } else {
      return false
    }
  }

  if (filter.tags.include.length) {
    const f = filter.tags.isOr
      ? filter.tags.include.some(c => log.tags!.includes(c))
      : filter.tags.include.every(c => log.tags!.includes(c))
    if (f) {
      if (filter.isOrAll) return true
    } else {
      return false
    }
  }

  return true
}
