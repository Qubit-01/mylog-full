<!--
  整个页面的容器，包含上方导航栏，下面的链接栏，中间主体部分。
-->

<script setup lang="ts">
</script>

<template>
  <div class="all-container">
    <HeaderComp />
    <MainComp />
    <FooterComp />
  </div>
  <el-backtop :right="20" :bottom="20" />
</template>

<style scoped lang="less">
.all-container {
  position: relative;
  min-height: 100vh;
}
</style>

