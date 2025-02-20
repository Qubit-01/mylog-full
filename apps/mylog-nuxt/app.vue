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
  min-width: 300px;
  .env {
    position: fixed;
    bottom: 6px;
    left: 6px;
    z-index: 999;
    height: 16px;

    line-height: 14px;
    font-size: 10px;
    padding: 0 6px;
    border-radius: 10px;
    background: #f55a;
    pointer-events: none;
  }
}
</style>
