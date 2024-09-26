<script setup lang="ts">
import useLogStore from '@/stores/log'
import type { Log } from '@/types'
const Mylog = useLogStore().mylog
const Tags = useLogStore().tags

// 拿到编辑的数据
const logReleaseDom = ref()

// 要对数据进行重组，在组件里面进行
// const showList = computed(() => {
//   const res: Log[][] = []
//   let temp: Log[] = []
//   Mylog.list.forEach((log, i) => {
//     if (i === 0 || log.logtime.isSame(Mylog.list[i - 1].logtime, 'day')) {
//       temp.push(log)
//     } else {
//       res.push(temp)
//       temp = [log]
//     }
//   })
//   return res
// })
</script>

<template>
  <div class="timeline-comp">
    <LogRelease ref="logReleaseDom" />

    <LogFilter />

    <ElTimeline
      v-infinite-scroll="Mylog.addLogs!"
      :infinite-scroll-disabled="Mylog.loading"
    >
      <!-- 编辑预览 -->
      <!-- <ElTimelineItem
      v-if="logReleaseDom?.logEdit.content"
      timestamp="编辑预览"
      placement="top"
    >
      <LogMylog :log="logReleaseDom?.logEdit" />
    </ElTimelineItem> -->

      <!-- 时间线开始 -->
      <template v-for="(log, i) in Mylog.list" :key="log.id">
        <!-- 年份节点 -->
        <ElTimelineItem
          v-if="i == 0 || !log.logtime!.isSame(Mylog.list[i - 1].logtime!, 'year')"
          :timestamp="log.logtime!.year().toString()"
          type="success"
          size="large"
          placement="top"
        />

        <!-- 日期节点 -->
        <ElTimelineItem
          v-if="i == 0 || !log.logtime!.isSame(Mylog.list[i - 1].logtime!, 'day')"
          :timestamp="log.logtime!.format('YYYY-MM-DD')"
          placement="top"
        >
          <!-- closable @close="tabNoteClose(tag)" -->
          <div class="tags">
            <ElTag
              v-for="tag in Tags.listAll.filter(tag =>
                tag.logtime.isSame(log.logtime, 'day')
              )"
              :key="tag.content"
            >
              {{ tag.content }}
            </ElTag>
          </div>
        </ElTimelineItem>

        <!-- Log节点  :color="log.type === 'public' ? 'var(--el-color-warning)' : 'transparent'"-->
        <ElTimelineItem hide-timestamp center color="transparent">
          <LogMylog :log="log" />
        </ElTimelineItem>
      </template>

      <!-- 没有数据 -->
      <ElTimelineItem
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
      </ElTimelineItem>

      <ElTimelineItem
        v-if="Mylog.loading"
        timestamp="loading..."
        placement="top"
      >
        <LogLoading />
      </ElTimelineItem>

      <ElTimelineItem timestamp="origin" placement="top" />
    </ElTimeline>
  </div>
</template>

<style scoped lang="less">
.timeline-comp {
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
