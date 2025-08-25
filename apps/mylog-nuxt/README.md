# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies: `pnpm install`

## Development Server

Start the development server on `http://localhost:3000`: `pnpm dev`

## Production

Build the application for production: `pnpm build`

Locally preview production build: `pnpm preview`

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## 踩坑

### PM2

ecosystem.config.cjs 必须用 cjs 不能用 js 否则报错

```bash
[PM2][ERROR] File ./ecosystem.config.js malformated
Error [ERR_REQUIRE_ESM]: require() of ES Module /root/Repository/mylog-full/apps/mylog-nuxt/ecosystem.config.js from /root/.local/share/pnpm/global/5/.pnpm/pm2@5.4.3/node_modules/pm2/lib/Common.js not supported.
ecosystem.config.js is treated as an ES module file as it is a .js file whose nearest parent package.json contains "type": "module" which declares all .js files in that package scope as ES modules.
Instead either rename ecosystem.config.js to end in .cjs, change the requiring code to use dynamic import() which is available in all CommonJS modules, or change "type": "module" to "type": "commonjs" in /root/Repository/mylog-full/apps/mylog-nuxt/package.json to treat all .js files as CommonJS (using .mjs for all ES modules instead).
```