<script setup lang="ts">
import TimelineComp from "./TimelineComp.vue";
import CalendarComp from "./CalendarComp.vue";
</script>
<template>
  <div class="mylog-view">
    <n-tabs type="segment" animated>
      <n-tab-pane name="mylog" tab="时间线"><TimelineComp /></n-tab-pane>
      <n-tab-pane name="calendar" tab="日历"><CalendarComp /></n-tab-pane>
      <n-tab-pane name="todo" tab="待办">待办</n-tab-pane>
    </n-tabs>
  </div>
</template>
<style lang="scss" scoped>
.mylog-view {
  display: flex;
  flex-direction: column;
  gap: var(--gap);
  // background-color: var(--m-background-color);
}
</style>
