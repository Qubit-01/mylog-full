<script setup lang="ts">
import useGlobalStore from "./stores/global";
useGlobalStore();
</script>

<template>
  <RouterView />
</template>

<style lang="scss">
@import "public/css/light.scss";
/**
 * 这里放的是一些全局CSS，无关主题
 */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-weight: normal;
}

:root {
  // 主要内容的显示区域
  --main-container-width: 65%;
  // 文字颜色
  --color: #111;
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  // line-height: 1.5;
  // font-weight: 400;

  // color-scheme: light dark;
  // color: rgba(255, 255, 255, 0.87);
  // background-color: #242424;
  background-color: var(--body-background-color);

  // font-synthesis: none;
  // text-rendering: optimizeLegibility;
  // -webkit-font-smoothing: antialiased;
  // -moz-osx-font-smoothing: grayscale;
}

@media (prefers-color-scheme: light) {
}

/* 中间模块通用 */
.m {
  // position: relative;
  // transition: box-shadow 0.2s linear, width 0.2s linear;
  // background-color: var(--m-background-color);

  // border: var(--m-border);

  // box-shadow: var(--m-shadow);
  // backdrop-filter: blur(8px);

  // &:hover {
  //   box-shadow: var(--m-hover-shadow);
  // }
}

a {
  text-decoration: none;
}

/* 超出省略号 */
// 单行省略号
.overflow-ellipsis-s {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// 多行省略号， 默认3行，但是会被指令调用时要被覆盖
.overflow-ellipsis-m {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  line-clamp: 3;
  -webkit-line-clamp: 3;
}
</style>
