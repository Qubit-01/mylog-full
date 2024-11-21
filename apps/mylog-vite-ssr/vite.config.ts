import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'url';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { imagetools } from 'vite-imagetools';

// https://vitejs.dev/config/
export default defineConfig({
  // Sass 会在2.0 版本去除一些东西，会报警告，vite这样设置可以消除警告
  // @see https://vitejs.cn/vite5-cn/config/shared-options.html#css-preprocessoroptions
  // @see https://cn.vitejs.dev/guide/migration.html#sass-now-uses-modern-api-by-default
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  plugins: [
    vue(),
    AutoImport({
      // 自动导入
      resolvers: [ElementPlusResolver({ ssr: true })],
      imports: ['vue', 'vue-router', 'pinia', '@vueuse/core'],
      dts: 'src/types/auto-imports.d.ts',
    }),
    Components({
      resolvers: [
        ElementPlusResolver({ ssr: true }),
        NaiveUiResolver(),
      ],
      dts: 'src/types/components.d.ts',
    }),
    // vite-imagetools 配置
    imagetools({
      defaultDirectives: (url) => {
        if (url.searchParams.get('preset') === 'modern') {
          return new URLSearchParams({ format: 'webp', as: 'picture' });
        }
        return new URLSearchParams();
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  ssr: {
    noExternal: ['naive-ui', 'vueuc', 'date-fns', 'element-plus'],
  },
  server: {
    hmr: {
      protocol: 'ws',
      host: 'localhost',
    },
    // host: "0.0.0.0",
    // port: 443,
    // https: {
    //   key: fs.readFileSync("./cert/mylog.cool.key"),
    //   cert: fs.readFileSync("./cert/mylog.cool.crt"),
    // },
  },
});
