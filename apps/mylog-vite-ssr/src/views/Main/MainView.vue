<!--
 主要页面的容器，包含上方导航栏，下面的链接栏，中间主体部分。
-->
<script setup lang="ts">
import FooterComp from "./comps/FooterComp.vue";
import HeaderComp from "./comps/HeaderComp.vue";
const a = ref(1);
</script>

<template>
  <div class="main-view">
    <HeaderComp />
    <div class="main-comp">
      <div class="main-container">
        <div class="left">123</div>
        <div class="middle">
          <NButton @click="a++">count is {{ a }}</NButton>
          <RouterView />
        </div>
        <div class="right">123</div>
      </div>
    </div>
    <FooterComp />
  </div>
</template>

<style scoped lang="scss">
.main-view {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--gap);

  // 中间主要部分的高度 = 屏幕高度 + Footer高度
  min-height: calc(100vh + var(--footer-height));

  .main-comp {
    flex: 1;
    display: flex;
    justify-content: center;

    .main-container {
      display: flex;
      gap: var(--gap);

      width: var(--main-container-width);

      > .middle {
        flex: 1;
        width: 0;
      }

      > .left,
      > .right {
        width: 130px;
        border: 1px solid green;
      }
    }
  }
}
</style>
