<script lang="ts" setup>
import HomeTopLog from '~/components/log/HomeTopLog.vue'
import LogLoading from '~/components/log/LogLoading.vue'

const Home = useHomeStore()
</script>

<template>
  123{{ Home.status }}123
  <div
    class="home-page"
    v-infinite-scroll="Home.addLogs"
    :infinite-scroll-disabled="Home.status !== 'success'"
  >
    <HomeTopLog />

    <Log v-for="log in Home.logs" :key="log.id" :log="log" />

    <LogLoading :status="Home.status" />
  </div>
</template>

<style lang="scss" scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: var(--gap);
}
</style>
