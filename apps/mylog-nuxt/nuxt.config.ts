// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devServer: {
    host: '0.0.0.0',
    port: 443,
    https: {
      key: './../../cert/mylog.ink.key',
      cert: './../../cert/mylog.ink.crt',
    },
  },
  devtools: { enabled: true },
  css: ['~/assets/css/base.scss', 'element-plus/theme-chalk/dark/css-vars.css'],
  vite: {
    css: {
      preprocessorOptions: {
        scss: { api: 'modern-compiler' },
      },
    },
  },
  modules: ['@element-plus/nuxt', '@pinia/nuxt', '@vueuse/nuxt'],
  elementPlus: {},
  runtimeConfig: {
    public: {},
  },
})
