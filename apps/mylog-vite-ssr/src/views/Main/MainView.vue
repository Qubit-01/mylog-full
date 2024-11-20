<!--
 主要页面的容器，包含上方导航栏，下面的链接栏，中间主体部分。
-->
<script setup lang="ts">
import FooterComp from "./comps/FooterComp.vue";
import HeaderComp from "./comps/HeaderComp.vue";
</script>

<template>
  <div class="main-view">
    <HeaderComp />
    <div class="main-comp">
      <div class="main-container">
        <div class="left">123</div>
        <div class="middle">
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
  min-width: 500px;

  min-height: 100vh;

  * {
    transition: width 0.5s;
  }

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

      @media (max-width: 890px) {
        > .left,
        > .right {
          display: none;
        }
      }
    }
  }
}
</style>
