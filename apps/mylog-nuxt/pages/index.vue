<script setup lang="ts">
import HomeTopLog from '~/components/log/HomeTopLog.vue'
const { data } = useHomeStore()

// console.log('🐤logs', logs)
</script>

<template>
  <!-- v-infinite-scroll="home.addLogs!"
  :infinite-scroll-disabled="home.loading" -->
  <div class="home-page">
  <HomeTopLog />
    <!-- {{ logs.map(l => l.id) }} -->
    {{ data?.map(l => l.id) }}

    <!-- <div v-for="log in logRaws" :key="log.id" class="_m">
      {{ log }}
    </div> -->

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
