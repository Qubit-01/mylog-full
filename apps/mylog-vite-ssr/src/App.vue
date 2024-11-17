<!--
  App.vue 的任务：
  1. 放一些全局 JS
  2. 获取用户信息
  2. style中放无关主题的全局css
-->
<script setup lang="ts">
import { useSSRContext } from "vue";
import useGlobalStore from "./stores/global";

const global = useGlobalStore();

onServerPrefetch(async () => {
  const token = useSSRContext()!.token;
  if (token) {
    const userdata = await trpc.user.getUser.query({ token });
    Object.assign(global.user, userdata);
  }
});

onMounted(async () => {
  console.log("🐔", "App.vue");
  // const a = await trpc.test.test1.query();
  // const a = await trpc.user.getToken.query({
  //   // name: "sybit", pswd: "12345qaZ"
  //   unionidQq: "UID_A01CA2BA124F884F93A78348AB6B8DA5",
  // });
});
</script>

<template>
  <RouterView />
</template>

<style lang="scss">
/** 这里放的是一些全局CSS，无关主题 */
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

  // 平板横向
  @media (max-width: 1424px) {
    /* 页面宽度在小挡位时的宽度 */
    --main-container-width: 95%;
  }
  // 手机，平板纵向
  @media (max-width: 890px) {
  }
}

@media (prefers-color-scheme: light) {
}

/* 模块通用 */
.m {
  position: relative;
  transition: box-shadow 0.2s linear, width 0.2s linear;
  background-color: var(--block-background-color);
  border-radius: var(--block-border-radius);
  padding: var(--block-padding);

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

// 去除百度地图坐下角的信息
.amap-container {
  a.amap-logo,
  div.amap-copyright {
    display: none !important;
  }
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-weight: normal;
}

// body {
//   min-height: 100vh;
//   background-position: center center;
//   background-repeat: no-repeat;
//   background-size: cover;
//   background-attachment: fixed;
//   min-height: 100%;

//   transition: color 0.5s, background-color 0.5s, background-image 0.5s,
//     width 0.5s;
//   font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
//     Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
//     sans-serif;
// }
</style>
