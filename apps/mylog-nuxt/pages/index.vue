<script lang="ts" setup>
import HomeTopLog from '~/components/log/HomeTopLog.vue'
import LogLoading from '~/components/log/LogLoading.vue'

const Home = useHomeStore()
</script>

<template>
  <div
    class="home-page"
    v-infinite-scroll="Home.addLogs"
    :infinite-scroll-disabled="Home.status === 'pending'"
  >
    <HomeTopLog />

    <Log v-for="log in Home.logs" :key="log.id" :log="log" />

    <LogLoading v-if="Home.status === 'pending'" />
  </div>
</template>

<style lang="scss" scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: var(--gap);
}
</style>
