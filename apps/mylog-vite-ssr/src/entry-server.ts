import { renderToString, SSRContext } from 'vue/server-renderer';
import { createApp } from './main';
import { RouteLocationRaw } from 'vue-router';
import { newRouter } from './views/router';
import { setup } from '@css-render/vue3-ssr';
import { basename } from 'node:path';

/**
 * Vite 生成的 manifest.json 文件的类型
 * 键是没有被 hash 过的资源文件名, 值是 hash 后版本的映射(生产的js,css,需要的资源等)
 * "src/stores/home.ts": ['/assets/HomeView-DX5h5jF5.js', '/assets/HomeView-CvTstxih.css', '/assets/bg-light-raw-8QGx7fMM.webp']
 */
type Manifest = Record<string, string[]>;

/**
 * 通过renderToString，渲染HTML和head
 * @param url 用户访问到的页面
 * @param manifest SSR生产阶段的manifest.json
 * @param token 用户cookie中的token
 * @returns
 */
export async function render(
  url: RouteLocationRaw,
  manifest?: string,
  token?: string,
) {
  console.log(`🐔entry-server执行, url: ${url}; token: ${token};`);

  const ssrManifest: Manifest = JSON.parse(manifest ?? '{}');

  const { app, pinia } = createApp();
  const { collect } = setup(app);
  const router = newRouter();
  app.use(router);
  router.push(url);
  await router.isReady();
  // 上下文对象ctx会通过 useSSRContext 获得
  // @vitejs/plugin-vue 会将代码注入组件的setup，setup会注册自身到ctx.modules
  const ctx: SSRContext = { token }; // 这里把用户cookie里面的token带进去
  const appHtml = await renderToString(app, ctx); // 会多个 ctx.modules 将包含调用期间实例化的所有组件

  const preloadLinks = renderPreloadLinks(ctx.modules, ssrManifest);
  const teleports = renderTeleports(ctx.teleports);

  const cssHead = collect();

  // 自己添加head，对提前获取的数据注入进html的head中
  const head = `<script>window.__pinia = ${JSON.stringify(pinia.state.value)}</script>`;

  console.log('🐤teleports', teleports)

  return {
    /** Vue渲染的主要HTML代码 */
    appHtml,
    /** Naive UI 注入的CSS代码 */
    cssHead,
    /** Pinia 服务器获取到的数据存储在window上 */
    head,
    /** 通过ctx.modules预加载manifest中用到的资源 */
    preloadLinks,
    /** 有些需要瞬移组件的挂载点 */
    teleports,
  };
}

function renderPreloadLinks(modules: any, manifest: Manifest) {
  let links = '';
  const seen = new Set();
  modules.forEach((module: string) => {
    const files = manifest[module];
    if (files) {
      files.forEach((file) => {
        if (!seen.has(file)) {
          seen.add(file);
          const filename = basename(file);
          if (manifest[filename]) {
            for (const depFile of manifest[filename]) {
              links += renderPreloadLink(depFile);
              seen.add(depFile);
            }
          }
          links += renderPreloadLink(file);
        }
      });
    }
  });
  return links;

  function renderPreloadLink(file: string) {
    if (file.endsWith('.js')) {
      return `<link rel="modulepreload" crossorigin href="${file}">`;
    } else if (file.endsWith('.css')) {
      return `<link rel="stylesheet" href="${file}">`;
    } else if (file.endsWith('.woff')) {
      return ` <link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`;
    } else if (file.endsWith('.woff2')) {
      return ` <link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`;
    } else if (file.endsWith('.gif')) {
      return ` <link rel="preload" href="${file}" as="image" type="image/gif">`;
    } else if (file.endsWith('.jpg') || file.endsWith('.jpeg')) {
      return ` <link rel="preload" href="${file}" as="image" type="image/jpeg">`;
    } else if (file.endsWith('.png')) {
      return ` <link rel="preload" href="${file}" as="image" type="image/png">`;
    } else if (file.endsWith('.webp')) {
      return ` <link rel="preload" href="${file}" as="image" type="image/webp">`;
    } else {
      return '';
    }
  }
}

function renderTeleports(teleports: SSRContext['teleports']) {
  if (!teleports) return '';
  return Object.entries(teleports).reduce((all, [key, value]) => {
    if (key.startsWith('#el-popper-container-')) {
      return `${all}<div id="${key.slice(1)}">${value}</div>`;
    }
    return all;
  }, teleports.body || '');
}
