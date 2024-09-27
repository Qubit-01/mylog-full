<!--
  垂直方向的中间部分，包含左右栏，和主要展示内容（是个路由组件）
-->
<script setup lang="ts">
// import NoteLan from "./Lans/NoteLan.vue";
import OneSentence from "./Lans/OneSentence.vue";
</script>

<template>
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
        <OneSentence />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
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
</style>
