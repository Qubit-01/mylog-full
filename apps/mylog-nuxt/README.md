# Mylog-Nuxt

多元记 H5 前端 （服役中）

## 开发前置依赖

### 证书文件

去腾讯云下载证书文件（Nginx），删除 `_bundle` 后缀，其中 pem 和 crt 文件是一样的，可以删掉 pem

### 代理服务器

1. 安装 Whistle `pnpm i -g ` ，配置证书参考 https://cloud.tencent.com/developer/article/1861183

2. 运行代理服务器 `w2 restart -n bit -w 123456`

## Setup

Make sure to install dependencies: `pnpm install`

## Development Server

Start the development server on `http://localhost:3000`: `pnpm dev`

## Production

Build the application for production: `pnpm build`

Locally preview production build: `pnpm preview`

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
