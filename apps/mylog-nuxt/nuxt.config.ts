// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devServer: {
    host: 'mylog.cool',
    port: 443,
    https: {
      key: './cert/mylog.cool.key',
      cert: './cert/mylog.cool.crt',
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
})
