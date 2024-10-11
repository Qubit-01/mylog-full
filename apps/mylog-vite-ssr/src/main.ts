import { createSSRApp } from "vue";
// import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./views/router";

// SSR中，每次请求都要有新的App实例，也会新创建一个Pinia
export function createApp() {
  console.log("🐔main.ts执行");
  const pinia = createPinia();
  const app = createSSRApp(App);
  app.use(router);
  app.use(pinia);

  return { app, router, pinia };
}
