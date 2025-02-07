<script lang="ts" setup>
import dayjs from 'dayjs'
const Mylog = useMylogStore()
</script>

<template>
  <div class="timeline">
    <!-- <LogRelease ref="logReleaseDom" /> -->

    <!-- <LogFilter /> -->

    <el-timeline
      v-infinite-scroll="Mylog.addLogs"
      :infinite-scroll-disabled="Mylog.status !== 'success'"
    >
      <!-- 时间线开始 -->
      <template v-for="(log, i) in Mylog.logs" :key="log.id">
        <!-- 年份节点 -->
        <ElTimelineItem
          v-if="
            i == 0 ||
            !dayjs(log.logtime).isSame(Mylog.logs[i - 1].logtime, 'year')
          "
          :timestamp="dayjs(log.logtime).year().toString()"
          type="success"
          size="large"
          placement="top"
        />

        <!-- 日期节点 -->
        <ElTimelineItem
          v-if="
            i == 0 ||
            !dayjs(log.logtime).isSame(Mylog.logs[i - 1].logtime, 'day')
          "
          :timestamp="dayjs(log.logtime).format('YYYY-MM-DD')"
          placement="top"
        />

        <!-- Log节点  :color="log.type === 'public' ? 'var(--el-color-warning)' : 'transparent'"-->
        <ElTimelineItem hide-timestamp center color="transparent">
          <Log :id="log.id" :log="log" />
        </ElTimelineItem>
        <!-- {{ log }} -->
      </template>

      <ElTimelineItem timestamp="origin" placement="top" />
    </el-timeline>
  </div>
</template>

<style lang="scss" scoped>
.timeline {
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
