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
    <LogPublic v-for="l of mylogs.logs.list" :key="l.id" :log="l" />
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
