import { createSSRApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";

// SSR中，每次请求都要有新的App实例，也会新创建一个Pinia
export function createApp() {
  console.log("🐔main执行，建立Pinia、app");
  const pinia = createPinia();
  const app = createSSRApp(App);
  app.use(pinia);

  return { app, pinia };
}
