<script lang="ts" setup>
import dayjs from 'dayjs'
import LogLoading from '~/components/log/LogLoading.vue'
import LogRelease from '~/components/logEdit/LogRelease.vue'
const Mylog = useMylogStore()

const $LogRelease = useTemplateRef('$LogRelease')

const releaseKey = ref(0)
</script>

<template>
  <div class="timeline">
    <LogRelease
      :key="releaseKey"
      ref="$LogRelease"
      @onReleaseSuccess="releaseKey++"
    />
    <div>{{ $LogRelease?.logEdit }}</div>
    <div>筛选模块</div>

    <el-timeline
      v-infinite-scroll="Mylog.addLogs"
      :infinite-scroll-disabled="Mylog.status !== 'success'"
    >
      <!-- 时间线开始 -->
      <template v-for="(log, i) in Mylog.logs" :key="log.id">
        <!-- 年份节点 -->
        <el-timeline-item
          v-if="
            i === 0 ||
            !dayjs(log.logtime).isSame(Mylog.logs[i - 1]?.logtime, 'year')
          "
          :timestamp="dayjs(log.logtime).year().toString()"
          type="success"
          size="large"
          placement="top"
        />

        <!-- 日期节点 -->
        <el-timeline-item
          v-if="
            i === 0 ||
            !dayjs(log.logtime).isSame(Mylog.logs[i - 1]?.logtime, 'day')
          "
          :timestamp="dayjs(log.logtime).format('YYYY-MM-DD')"
          placement="top"
        />

        <!-- Log节点  :color="log.type === 'public' ? 'var(--el-color-warning)' : 'transparent'"-->
        <el-timeline-item hide-timestamp center color="transparent">
          <Log :id="log.id" :log="log" />
        </el-timeline-item>
      </template>

      <!-- 加载态节点 -->
      <el-timeline-item
        v-show="Mylog.status !== 'success'"
        timestamp="loading..."
        placement="top"
      >
        <LogLoading :status="Mylog.status" @retry="Mylog.refresh" />
      </el-timeline-item>

      <!-- 最底部的节点 -->
      <el-timeline-item timestamp="origin" placement="top" />
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
