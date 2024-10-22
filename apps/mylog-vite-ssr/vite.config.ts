import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath } from "url";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import { imagetools } from "vite-imagetools";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      // 自动导入
      imports: ["vue", "vue-router", "pinia", "@vueuse/core"],
      dts: "src/types/auto-imports.d.ts",
    }),
    Components({
      resolvers: [NaiveUiResolver()],
      dts: "src/types/components.d.ts",
    }),
    // vite-imagetools 配置
    imagetools({
      defaultDirectives: (url) => {
        if (url.searchParams.get("preset") === "modern") {
          return new URLSearchParams({ format: "webp", as: "picture" });
        }
        return new URLSearchParams();
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  ssr: {
    noExternal: ["naive-ui", "vueuc", "date-fns"],
  },
});
