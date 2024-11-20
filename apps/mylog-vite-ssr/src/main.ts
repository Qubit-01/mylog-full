import { createSSRApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import 'dayjs/locale/zh-cn';
import { ID_INJECTION_KEY, ZINDEX_INJECTION_KEY } from 'element-plus';

// SSR中，每次请求都要有新的App实例，也会新创建一个Pinia
export function createApp() {
  console.log('🐔main执行，建立Pinia、app');
  const pinia = createPinia();
  const app = createSSRApp(App);
  app.use(pinia);
  app.provide(ID_INJECTION_KEY, { prefix: 1024, current: 0 });
  app.provide(ZINDEX_INJECTION_KEY, { current: 0 });

  return { app, pinia };
}
