<script setup lang="ts">
// 判断是否在dev环境
const dev: boolean = import.meta.dev;
</script>
<template>
  <div class="all-container">
    <header></header>
    <!-- 顶栏在主文档流中的占位 -->
    <div class="placeholder" style="height: var(--header-top)" />
    <slot />
    <footer></footer>
    <!-- <MainComp />
    <FooterComp /> -->
  </div>
</template>
<style lang="scss" scoped>
.all-container {
  position: relative;
  min-height: 100vh;
}
</style>
