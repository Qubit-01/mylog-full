import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import fs from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      // vue 常见函数
      imports: ['vue', 'vue-router', 'pinia'],
      resolvers: [
        // element 相关函数
        ElementPlusResolver(),
      ],
      // 导入的函数给编辑器看的类型文件
      dts: 'src/auto-imports.d.ts',
      eslintrc: { enabled: true },
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: 'src/components.d.ts',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0', //显示当前局域网地址
    port: 443,
    https: {
      key: fs.readFileSync("cert/mylog.cool.key"),
      cert: fs.readFileSync("cert/mylog.cool.pem")
    },
    open: false, //是否自动启动浏览器
  },
})
