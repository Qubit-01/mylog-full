import { createApp } from "./main";
import router from "./views/router";

const { app, pinia } = createApp();
// @ts-ignore
pinia.state.value = window.__pinia;

app.use(router);

router.isReady().then(() => {
  console.log("🐔entry-client执行");
  app.mount("#app");
});
