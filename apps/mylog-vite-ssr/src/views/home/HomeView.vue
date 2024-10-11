<script setup lang="ts">
import useHomeStore from "@/stores/home";

const home = useHomeStore();

onServerPrefetch(async () => {
  await home.addLogs();
});
</script>

<template>
  <div class="home-page" data-allow-mismatch="children">
    <div v-for="l of home.logs.list" class="log" v-text="l.content"></div>
  </div>
</template>
<style lang="scss" scoped>
.log {
  margin-bottom: 10px;
  border: 1px solid red;
}
</style>
