<script setup lang="ts">
import HomeTopLog from '~/components/log/HomeTopLog.vue'

const Home = useHomeStore()
</script>

<template>
  <div
    class="home-page"
    v-infinite-scroll="Home.addLogs"
    :infinite-scroll-disabled="Home.status === 'pending'"
  >
    <HomeTopLog />
    <div @click="Home.addLogs">123</div>

    <Log v-for="log in Home.logs" :key="log.id" :log="log" />

    <!-- <LogLoading v-if="home.loading" /> -->
  </div>
</template>

<style lang="scss" scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: var(--gap);
}
</style>
