<script setup lang="ts">
import useLogStore from '@/stores/log'

const logStore = useLogStore()
const home = logStore.home
home.addLogs!()
</script>

<template>
  <div
    class="home-page"
    v-infinite-scroll="home.addLogs!"
    :infinite-scroll-disabled="home.loading"
  >
    <HomeTopLog />

    <Log v-for="log in home.list" :key="log.id" :log="log" />

    <LogLoading v-if="home.loading" />
  </div>
</template>

<style scoped lang="less">
.home-page {
  display: flex;
  flex-direction: column;
  gap: var(--gap);
}
</style>
