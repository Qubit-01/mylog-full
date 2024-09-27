<script setup lang="ts">
</script>

<template>
  <div class="login-view">
    login-view

    <div class="window">
      <RouterView />
    </div>

  </div>
</template>

<style scoped lang="scss">
.login-view {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: auto;

  .window {
    margin: auto;
    min-height: 100px;
    min-width: 100px;
  }
}
</style>
