// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/base.scss'],
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