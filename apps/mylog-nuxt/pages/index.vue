<script setup lang="ts">
import HomeTopLog from '~/components/log/HomeTopLog.vue'

console.info('🐤pages/index.vue')
</script>
<template>
  <!-- v-infinite-scroll="home.addLogs!"
  :infinite-scroll-disabled="home.loading" -->
  <div class="home-page">
    <HomeTopLog />

    <!-- <Log v-for="log in home.list" :key="log.id" :log="log" /> -->

    <!-- <LogLoading v-if="home.loading" /> -->
  </div>
  <!-- <AfadsfsVfasdf>fasdfa</AfadsfsVfasdf>
    <AppAlert> This is an auto-imported component 主页 </AppAlert> -->
</template>
<style lang="scss" scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: var(--gap);
}
</style>
