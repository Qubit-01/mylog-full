<script setup lang="ts">
import { getMylogs } from '@/api/log'
import { getUser } from '@/stores/global'
import { filteLog, handleLog, type MylogStore } from '@/stores/log'
import type { Log, LogFilter } from '@/types'
import { toFileUrl } from '@/utils/cos'
import { vOverflowEllipsis } from '@/utils/directives'

const GAP = 20

// 列表dom
const listDom = ref<HTMLDivElement>()
// 元素dom列表
const itemDoms = ref<HTMLDivElement[]>([])

getUser.then(user => {
  imglog.getLogs()
}, null) // 进入页面再获取数据

const imglog: MylogStore = reactive({
  list: computed<Log[]>(() => imglog.listFilter.slice(0, imglog.params.skip)),
  listAll: [],
  filter: undefined,
  listFilter: computed<Log[]>(() =>
    imglog.listAll.filter(log => filteLog(log, imglog.filter))
  ), // 由all筛选而来
  // 每次调用都会重置params，重新筛选
  setFilter: (filter?: LogFilter) => {
    imglog.params.skip = 0
    imglog.filter = filter
    imglog.addLogs()
  },
  params: { skip: 0, limit: 20 },
  loading: true,
  noMore: false,
  addLogs: async () => {
    if (imglog.params.skip > imglog.listFilter.length) {
      imglog.noMore = true
      return
    }
    imglog.params.skip += imglog.params.limit
    // updateEnv()
    positionItem()
  },
  getLogs: async () => {
    imglog.loading = true
    let logs = await getMylogs({})
    logs = logs.filter(l => l.imgs.length > 0)
    logs.forEach(handleLog)
    imglog.listAll = logs
    imglog.addLogs() // 加载完成后立即加载几个数据
    // imglog.loading = false
  },
})

/**
 * ==================== 瀑布流组件 ====================
 * 设置 3档 2、3、4列对应手机700、平板1424、电脑
 */

const env = reactive<{
  /**
   * 列数
   */
  colNum: 2 | 3 | 4
  /**
   * 窗口宽度，用于判断列数
   */
  windowWidth: number
  /**
   * 列表宽度，计算item宽度
   */
  listWidth: number
  /**
   * 元素宽度
   */
  itemWidth: number
  /**
   * 累计高度
   */
  colHeight: number[]
}>({
  colNum: 2,
  windowWidth: 0,
  listWidth: 0,
  itemWidth: 0,
  colHeight: [],
})

const listHeight = computed(() => Math.max(...env.colHeight))

/**
 * 更新环境变量
 */
const updateEnv = () => {
  env.windowWidth = window.innerWidth
  env.listWidth = listDom.value!.offsetWidth
  // if (env.windowWidth < 890) env.colNum = 2
  // else if (env.windowWidth < 1424) env.colNum = 3
  // else env.colNum = 4
  if (env.listWidth < 700) env.colNum = 2
  else if (env.listWidth < 1000) env.colNum = 3
  else env.colNum = 4
  env.itemWidth = (env.listWidth - GAP * (env.colNum - 1)) / env.colNum
  env.colHeight = Array(env.colNum).fill(0)
}

window.addEventListener('resize', () => {
  positionItem()
})

/**
 * 监听list宽度
 */
onMounted(() => {
  watch(
    () => imglog.list,
    () => {
      positionItem()
    }
  )
})

/**
 * 计算log的位置
 */
const positionItem = () => {
  updateEnv()
  nextTick(() => {
    env.colHeight = Array(env.colNum).fill(0)
    itemDoms.value.forEach((itemDom, index) => {
      const col = env.colHeight.findIndex(v => v === Math.min(...env.colHeight))
      const x = (env.itemWidth + GAP) * col
      const y = env.colHeight[col]
      env.colHeight[col] += itemDom.offsetHeight + GAP
      itemDom.style.transform = `translate(${x}px, ${y}px)`
    })
    imglog.loading = false
  })
}

onUnmounted(() => {
  window.removeEventListener('resize', updateEnv)
})
</script>

<template>
  <!-- {{ env }} -->
  <!-- {{ imglog.params }} -->
  <!-- {{ imglog.loading }} -->
  <div
    class="album-page"
    ref="listDom"
    v-infinite-scroll="imglog.addLogs!"
    :infinite-scroll-disabled="imglog.loading"
  >
    <div
      v-m
      v-for="log in imglog.list"
      class="log"
      :key="log.id"
      ref="itemDoms"
    >
      <div class="img">
        <img :src="toFileUrl(log.imgs[0], 'compress-imgs/', log.userid)" />
      </div>
      <div class="text">
        <div class="content" v-overflow-ellipsis="2">{{ log.content }}</div>
        <div class="bottom">
          <div>{{ log.logtime.format('YY-MM-DD HH:mm') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
// list
.album-page {
  position: relative;
  height: v-bind("listHeight - GAP + 'px'");

  // item
  .log {
    position: absolute;
    width: v-bind("env.itemWidth + 'px'");
    transition: transform 0.5s;

    border-radius: var(--border-radius);
    overflow: hidden;

    display: flex;
    flex-direction: column;

    .img {
      width: 100%;
      height: 200px;
      border-radius: var(--border-radius);

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .text {
      padding: var(--padding);
      line-height: 1.5rem;

      .bottom {
        display: flex;
        gap: 4px;
        font-size: 0.9rem;
        color: var(--color-2);
      }
    }
  }
}
</style>
