<script setup lang="ts">
import HomeTopLog from '~/components/log/HomeTopLog.vue'

const Home = useHomeStore()
</script>

<template>
  <!-- 
     -->
  <div
    class="home-page"
    v-infinite-scroll="Home.addLogs"
    :infinite-scroll-disabled="Home.status !== 'success'"
  >
    <HomeTopLog />
    <div @click="Home.addLogs">123</div>

    <div v-for="log in Home.logs" :key="log.id" class="_m">
      {{ log.id }}
    </div>

    <!-- <Log v-for="log in home.list" :key="log.id" :log="log" /> -->

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
