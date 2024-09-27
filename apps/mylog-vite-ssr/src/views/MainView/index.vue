<!--
 主要页面的容器，包含上方导航栏，下面的链接栏，中间主体部分。
-->
<script setup lang="ts">
import MainComp from "./comps/MainComp.vue";
</script>

<template>
  <div class="main-view">
    main-view

    <!-- <HeaderComp /> -->
    <MainComp />
    <!-- <FooterComp /> -->
  </div>
</template>

<style scoped lang="scss">
.main-view {
  position: relative;
  min-height: 100vh;
}
</style>
