<script setup lang="ts">
import useHomeStore from "@/stores/home";

const home = useHomeStore();

onServerPrefetch(async () => {
  await home.addLogs();
});
</script>

<template>
  <div class="home-page" data-allow-mismatch="children">
    <LogPublic v-for="l of home.logs.list" :key="l.id" :log="l" />
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
