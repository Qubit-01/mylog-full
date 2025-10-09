<script lang="ts" setup>
import HomeTopLog from '~/components/log/HomeTopLog.vue'
import LogLoading from '~/components/log/LogLoading.vue'

const Home = useHomeStore()
</script>

<template>
  <div
    class="HomePage"
    v-infinite-scroll="Home.fetchLogs"
    :infinite-scroll-disabled="Home.status !== 'success'"
  >
    <HomeTopLog />

    <Log v-for="log in Home.logs" :key="log.id" :log="log" />

    <LogLoading :status="Home.status" @retry="Home.refresh" />
  </div>
</template>

<style lang="scss" scoped>
.HomePage {
  display: flex;
  flex-direction: column;
  gap: var(--gap);
}
</style>
