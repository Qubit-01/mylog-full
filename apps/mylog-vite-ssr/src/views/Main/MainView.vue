<!--
 主要页面的容器，包含上方导航栏，下面的链接栏，中间主体部分。
-->
<script setup lang="ts">
import HeaderComp from "./comps/HeaderComp.vue";
// import OneSentence from "./comps/Lans/OneSentence.vue";

const a = ref(1)

console.log('🐔main view');

</script>

<template>
  <div class="main-view">
    <HeaderComp />
    <div @click="a++">count is {{ a }}</div>
    <div class="main-comp">
      <div class="center">
        <div class="middle">
          <RouterView />
        </div>
        <div class="left">
          <!-- <UserLan /> -->
          <!-- <NoteLan /> -->
        </div>
        <div class="right">
          <!-- 目录栏 -->
          <!-- <ContentLan /> -->
          <!-- <OneSentence /> -->
        </div>
      </div>
    </div>
    <!-- <FooterComp /> -->
  </div>
</template>

<style scoped lang="scss">
.main-view {
  position: relative;
  min-height: 100vh;

  .main-comp {
    display: flex;
    justify-content: center;

    .center {
      width: var(--center-width);
      display: flex;
      gap: var(--gap);
      transition: width 0.5s;

      .middle {
        width: 0;
        order: 2;
        flex: 1;
      }

      .left {
        order: 1;
        width: var(--lan-width);

        // 栏固定
        > div:nth-child(1) {
          position: sticky;
          top: calc(var(--header-height) + var(--gap));
        }
      }

      .right {
        order: 3;
        width: var(--lan-width);
      }

      .left,
      .right {
        display: flex;
        flex-direction: column;
        gap: var(--gap);
        > * {
          border-radius: var(--border-radius);
        }
      }

      @media (max-width: 890px) {
        .left,
        .right {
          display: none;
        }
      }
    }
  }
}
</style>
