import { createApp } from "./main";

const { app, router, pinia } = createApp();
// @ts-ignore
pinia.state.value = JSON.parse(window.__pinia);

router.isReady().then(() => {
  console.log("🐔entry-client.ts执行");
  app.mount("#app");
});
