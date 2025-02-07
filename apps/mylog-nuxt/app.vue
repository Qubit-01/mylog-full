<script lang="ts" setup>
useGlobalStore()
</script>

<template>
  <div class="app">
    <NuxtLayout>
      <NuxtPage />
      <!-- <NuxtWelcome /> -->
    </NuxtLayout>
    <el-backtop :right="20" :bottom="20" />
    <DevOnly>
      <div class="env">DEV</div>
    </DevOnly>
  </div>
</template>

<style lang="scss" scoped>
.app {
  .env {
    position: fixed;
    bottom: 6px;
    left: 12px;
    line-height: 14px;
    height: 16px;
    font-size: 10px;
    padding: 0 6px;
    border-radius: 10px;
    background: #f55a;
  }
}
</style>
