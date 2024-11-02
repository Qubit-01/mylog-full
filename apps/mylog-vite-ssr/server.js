import fs from 'node:fs/promises'
import express from 'express'
import cookieParser from 'cookie-parser'
import https from 'node:https'

const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 443
const base = process.env.BASE || '/'

// 提前缓存静态文件
const templateHtml = isProduction
  ? await fs.readFile('./dist/client/index.html', 'utf-8')
  : ''
const ssrManifest = isProduction
  ? await fs.readFile('./dist/client/.vite/ssr-manifest.json', 'utf-8')
  : undefined

const app = express()
// 为了获取到cookie中的token
app.use(cookieParser())

// Vite 和生产中间件
let vite
if (!isProduction) {
  const { createServer } = await import('vite')
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base
  })
  app.use(vite.middlewares)
} else {
  const compression = (await import('compression')).default
  const sirv = (await import('sirv')).default
  app.use(compression())
  app.use(base, sirv('./dist/client', { extensions: [] }))
}

app.use('*', async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, '')
    console.log(`📃---- 被访问接口: ${url} --------------------------------`);

    let template
    let render
    if (!isProduction) {
      // 开发环境，每次都去读新模版
      template = await fs.readFile('./index.html', 'utf-8')
      template = await vite.transformIndexHtml(url, template)
      render = (await vite.ssrLoadModule('/src/entry-server.ts')).render
    } else {
      template = templateHtml
      render = (await import('./dist/server/entry-server.js')).render
    }

    const rendered = await render(url, ssrManifest, req.cookies.token || undefined)

    const html = template
      .replace(`<!--app-head-->`, rendered.head ?? '')
      .replace(`<!--app-html-->`, rendered.html ?? '')

    console.log('🐔SSR HTML渲染好了，返回给浏览器');
    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  } catch (e) {
    vite?.ssrFixStacktrace(e)
    console.log(e.stack)
    res.status(500).end(e.stack)
  }
})

https.createServer({
  key: await fs.readFile('./cert/mylog.cool.key', 'utf-8'),
  cert: await fs.readFile('./cert/mylog.cool.crt', 'utf-8')
}, app).listen(port, () => {
  console.log(`🍁ViteSSR前端启动: https://mylog.cool`)
})
