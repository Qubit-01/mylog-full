// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  // ssr: false,
  app: {
    head: {
      // title: '多元记', // 兜底的标题，可以不设置，在 app.vue 里面处理
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, user-scalable=no',
      meta: [
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
  vite: {
    define: {
      // 把 API_LOCAL 环境变量注入到客户端构建中
      'process.env.API_LOCAL': process.env.API_LOCAL,
    }, 
  },
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
