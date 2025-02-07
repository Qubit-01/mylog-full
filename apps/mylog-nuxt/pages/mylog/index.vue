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
      <!-- 编辑预览 -->
      <!-- <el-timeline-item
      v-if="logReleaseDom?.logEdit.content"
      timestamp="编辑预览"
      placement="top"
    >
      <LogMylog :log="logReleaseDom?.logEdit" />
    </el-timeline-item> -->

      <!-- 时间线开始 -->
      <template v-for="(log, i) in Mylog.logs" :key="log.id">
        <!-- {{ log }} -->
        <!-- {{ dayjs(dayjs(log.logtime)) }} -->
        <!-- 年份节点 -->
        <el-timeline-item
          v-if="
            i == 0 ||
            !dayjs(log.logtime).isSame(Mylog.logs[i - 1].logtime!, 'year')
          "
          :timestamp="dayjs(log.logtime).year().toString()"
          type="success"
          size="large"
          placement="top"
        />

        <!-- 日期节点 -->
        <el-timeline-item
          v-if="
            i == 0 ||
            !dayjs(log.logtime)!.isSame(Mylog.logs[i - 1].logtime!, 'day')
          "
          :timestamp="dayjs(log.logtime)!.format('YYYY-MM-DD')"
          placement="top"
        >
          <!-- closable @close="tabNoteClose(tag)" -->
          <!-- <div class="tags">
            <ElTag
              v-for="tag in Tags.listAll.filter((tag) =>
                tag.logtime.isSame(dayjs(log.logtime), 'day'),
              )"
              :key="tag.content"
            >
              {{ tag.content }}
            </ElTag>
          </div> -->
        </el-timeline-item>

        <!-- Log节点  :color="log.type === 'public' ? 'var(--el-color-warning)' : 'transparent'"-->
        <el-timeline-item hide-timestamp center color="transparent">
          <!-- <LogMylog :log="log" /> -->
          <Log :key="log.id" :log="log" />
        </el-timeline-item>
      </template>

      <!-- 没有数据 -->
      <!-- <el-timeline-item
        v-if="!Mylog.list.length && !Mylog.loading"
        timestamp="没有数据哦~"
        placement="top"
      >
        <div
          v-m
          style="padding: var(--padding); border-radius: var(--border-radius)"
        >
          没有数据哦~
        </div>
      </el-timeline-item> -->

      <!-- <el-timeline-item
        v-if="Mylog.loading"
        timestamp="loading..."
        placement="top"
      >
        <LogLoading />
      </el-timeline-item> -->

      <!-- <el-timeline-item timestamp="origin" placement="top" /> -->
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
