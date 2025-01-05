// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  // modules: ['@element-plus/nuxt'],
  // elementPlus: {  },
  vite: {
    // Sass 会在2.0 版本去除一些东西，会报警告，vite这样设置可以消除警告
    // @see https://vitejs.cn/vite5-cn/config/shared-options.html#css-preprocessoroptions
    // @see https://cn.vitejs.dev/guide/migration.html#sass-now-uses-modern-api-by-default
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler",
        },
      },
    },
  },
});
