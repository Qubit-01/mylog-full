<script setup lang="ts">
import useHomeStore from "@/stores/home";
import LogTop from "./LogTop.vue";

const home = useHomeStore();

onServerPrefetch(async () => {
  await home.addLogs();
});

onMounted(() => {
  if (home.logs.list.length === 0) home.addLogs();
});
</script>

<template>
  <div class="home-page" data-allow-mismatch="children">
    <LogTop />
    <LogPublic v-for="l of home.logs.list" :key="l.id" :log="l" />
    <div @click="home.addLogs()">test</div>
  </div>
</template>
<style lang="scss" scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: var(--gap);
  // align-items: center;
}
</style>
