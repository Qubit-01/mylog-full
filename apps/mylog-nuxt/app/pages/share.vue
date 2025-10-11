<script lang="ts" setup>
useHead({ title: '分享' })
const { query } = useRoute()

const logs = useState<Log[]>(() => [])
const params = reactive({ skip: 0, limit: 10, share: query.share })
const noMore = ref(false)

const { refresh, status } = useFetch<Log[]>('/log/get_share', {
  ...FetchOptsDefault,
  // headers: { Cookie: `token=${useCookie('token').value}` },
  body: params,
  onResponse({ response }) {
    const logsRes = response._data
    if (!logsRes) return
    logs.value.push(...logsRes)
    if (logsRes.length < params.limit) noMore.value = true
  },
})

/** 请求下一页数据 */
const fetchLogs = () => {
  if (noMore.value) return
  params.skip += params.limit
}
</script>

<template>
  <div class="SharePage">
    <ElTimeline
      v-infinite-scroll="fetchLogs"
      :infinite-scroll-disabled="status !== 'success'"
    >
      <!-- 时间线开始 -->
      <template v-for="(log, i) in logs" :key="log.id">
        <!-- 年份节点 -->
        <ElTimelineItem
          v-if="
            i === 0 || !dayjs(log.logtime).isSame(logs[i - 1]?.logtime, 'year')
          "
          :timestamp="dayjs(log.logtime).year().toString()"
          type="success"
          size="large"
          placement="top"
        />

        <!-- 日期节点 -->
        <ElTimelineItem
          v-if="
            i === 0 || !dayjs(log.logtime).isSame(logs[i - 1]?.logtime, 'day')
          "
          :timestamp="dayjs(log.logtime).format('YYYY-MM-DD')"
          placement="top"
        />

        <!-- Log节点  :color="log.type === 'public' ? 'var(--el-color-warning)' : 'transparent'"-->
        <ElTimelineItem hide-timestamp center color="transparent">
          <Log type="share" :log />
        </ElTimelineItem>
      </template>

      <!-- 加载态节点 -->
      <ElTimelineItem
        v-show="status !== 'success'"
        timestamp="loading..."
        placement="top"
      >
        <LogLoading :status="status" @retry="refresh" />
      </ElTimelineItem>

      <!-- 最底部的节点 -->
      <ElTimelineItem timestamp="origin" placement="top" />
    </ElTimeline>
  </div>
</template>

<style lang="scss" scoped>
.SharePage {
  display: flex;
  flex-direction: column;
  gap: var(--gap);

  .timeline-item {
    padding: var(--padding);
    border-radius: var(--border-radius);
    // backdrop-filter: blur(4px);
  }

  .tags {
    display: flex;
    gap: 8px;
  }

  .loading {
    padding: var(--padding);
    border-radius: var(--border-radius);
    height: 150px;
    backdrop-filter: blur(4px);
  }

  .el-timeline {
    padding-left: 2px; // 线到左边的距离

    .el-timeline-item {
      padding-bottom: 8px; // 节点到下边的距离
    }
  }

  // // 时间线时间文本
  // ::v-deep(.el-timeline-item__timestamp) {
  //   color: var(--mini-text-color);
  //   margin-bottom: 5px;
  // }
}
</style>
