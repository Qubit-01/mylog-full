import { renderToString } from "vue/server-renderer";
import { createApp } from "./main";
import { RouteLocationRaw } from "vue-router";

export async function render(url: RouteLocationRaw) {
  console.log("🐔entry-server.ts执行");

  const { app, router, pinia } = createApp();
  router.push(url);
  await router.isReady();
  // 上下文对象ctx会通过 useSSRContext 获得
  // @vitejs/plugin-vue 会将代码注入组件的setup，setup会注册自身到ctx.modules
  // 渲染后，ctx.modules 将包含调用期间实例化的所有组件
  const ctx = {};
  const html = await renderToString(app, ctx);

  // 自己添加head，对提前获取的数据注入进html的head中
  const head = `<script>window.__pinia = ${JSON.stringify(
    pinia.state.value
  )}</script>`;

  return { html, head };
}
