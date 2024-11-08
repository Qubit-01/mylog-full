<script setup lang="ts">
import useMylogStore from "@/stores/mylog";

const mylogs = useMylogStore();

onServerPrefetch(async () => {
  await mylogs.addLogs();
});

onMounted(() => {
  if (mylogs.logs.list.length === 0) mylogs.addLogs();
});
</script>
<template>
  <div class="timeline-comp">
    <!-- <LogPublic v-for="l of mylogs.logs.list" :key="l.id" :log="l" /> -->
    <n-timeline>
      <template v-for="(log, i) in mylogs.logs.list" :key="log.id">
        <!-- 年份节点 -->
        <n-timeline-item
          v-if="i === 0 || !log.logtime!.isSame(mylogs.logs.list[i - 1].logtime!, 'year')"
          :content="log.logtime.year().toString()"
          type="success"
        />

        <!-- 年份节点 -->
        <n-timeline-item
          v-if="i == 0 || !log.logtime!.isSame(mylogs.logs.list[i - 1].logtime!, 'day')"
          :content="log.logtime!.format('YYYY-MM-DD')"
        />
        <n-timeline-item
          :time="log.logtime.format('YYYY-MM-DD HH:mm')"
          color="transparent"
        >
          <LogPublic :log />
        </n-timeline-item>

        <!-- <n-timeline-item
          type="info"
          title="信息"
          content="是的"
          time="2018-04-03 20:46"
          line-type="dashed"
        />
        <n-timeline-item type="success" title="成功" time="2018-04-03 20:46">
          哈哈哈哈哈
        </n-timeline-item> -->
      </template>
    </n-timeline>
  </div>
</template>
<style lang="scss" scoped>
.timeline-comp {
  display: flex;
  flex-direction: column;
  gap: var(--gap);
  // align-items: center;
}
</style>
