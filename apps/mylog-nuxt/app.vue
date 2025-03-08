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
    top: 4px;
    left: 4px;
    z-index: 999;
    height: 12px;

    line-height: 12px;
    font-size: 8px;
    padding: 0 4px;
    border-radius: 10px;
    background: #f55a;
    pointer-events: none;
  }
}
</style>
