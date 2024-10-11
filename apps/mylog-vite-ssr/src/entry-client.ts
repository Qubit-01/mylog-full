import { createApp } from "./main";

const { app, router } = createApp();
router.isReady().then(() => {
  console.log("🐔entry-client.ts执行");
  app.mount("#app");
});
