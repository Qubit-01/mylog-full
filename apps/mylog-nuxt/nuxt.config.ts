// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  app: {
    head: {
      meta: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1.0, user-scalable=no',
        },
        // 网站自定义信息
        { name: 'author', content: 'Qubit' },
        {
          name: 'keywords',
          content: '多元记,MyLog,mylog,廖世强,bit,2928318801,四川农业大学',
        },
        { name: 'description', content: '宇宙很大，生活更大' },
        // http自动升级为https
        {
          'http-equiv': 'Content-Security-Policy',
          content: 'upgrade-insecure-requests',
        },
      ],
    },
  },
  devServer: {
    host: '0.0.0.0',
    port: 443,
    // https: true,
    https: {
      key: './../../cert/mylog.ink.key',
      cert: './../../cert/mylog.ink.crt',
    },
  },
  devtools: { enabled: true },
  css: ['~/assets/css/base.scss', 'element-plus/theme-chalk/dark/css-vars.css'],
  vite: {},
  modules: ['@element-plus/nuxt', '@pinia/nuxt', '@vueuse/nuxt'],
  elementPlus: {
    defaultLocale: 'zh-cn',
  },
  runtimeConfig: {
    public: {},
  },
  // nitro: {
  //   devProxy: {
  //     "/api": {
  //       target: "http://localhost:20914", // 这里是接口地址
  //       changeOrigin: true,
  //       prependPath: true,
  //     },
  //   },
  //   routeRules: {
  //     '/api/**': {
  //       proxy: 'http://localhost:20914/**'
  //     }
  //   }
  // }
})
