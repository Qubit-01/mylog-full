# mylog-full

#### 介绍

项目采用 Monorepo 结构，包含各种代码。

- apps
    - h5 
        mylog2运行最久最稳定的一个h5项目
    - nest 
        新后端服务，之前是用 java spring boot 开发的，感觉技术栈太多了，太麻烦了，每次新设备都要重新配一堆开发环境，直接 all in js
    - nuxt
        新前项目，采用SSR 
    - trpc-prisma
        
    - uni
    - vite-ssr

本站正式进入3.0，使用 Vue 3.5 + Nuxt + Vite + Element Plus + TypeScript + Pinia + SSR 等技术栈。

#### 软件架构
软件架构说明

#### ChangeLog
##### 2025.1.5 3.0.0 bate
开始升级3.0版本。
2.0最大的痛点是个人页加载慢，因为最开始的设计是后端发送全部的Log，前端来进行筛选，这个数据量很大。
先是使用 Vite SSR 开发，发现SSR是真好用啊，加载速度有明显改善。
后来接触到了Nuxt，学了一下，突然想到，Nuxt是迟早要接入的，不如早点接，现在就直接用Nuxt开始写项目。

#### 体感升级
- 页面流畅，主题设置等数据从用户一看到页面时就都是正确的，不会再出现状态转变的过程。
- 请求更快  
过去的过程是，用户请求html到客户端，客户端解析html再向各种服务器发请求  
现在的过程是，用户请求html，服务端提前把用户需要发送的请求数据先拿到，再返回一个完好的html给用户  
从服务器请求数据到服务器，这个过程相比过去会节约大量时间，用户体验有质的飞跃！  
- 设计更加合理，从页面架构到数据存储都做了大量考虑和优化
- 后端摒弃掉Java，转为使用Nest框架开发，服务器只用安装node环境即可，使我可以更加专注开发功能。
- 面向未来，为未来开发APP应用和桌面端应用做准备

# 探索记录

### PM2

- ecosystem.config.cjs 必须用 cjs 不能用 js 否则报错 (模块化方案)

```bash
[PM2][ERROR] File ./ecosystem.config.js malformated
Error [ERR_REQUIRE_ESM]: require() of ES Module /root/Repository/mylog-full/apps/mylog-nuxt/ecosystem.config.js from /root/.local/share/pnpm/global/5/.pnpm/pm2@5.4.3/node_modules/pm2/lib/Common.js not supported.
ecosystem.config.js is treated as an ES module file as it is a .js file whose nearest parent package.json contains "type": "module" which declares all .js files in that package scope as ES modules.
Instead either rename ecosystem.config.js to end in .cjs, change the requiring code to use dynamic import() which is available in all CommonJS modules, or change "type": "module" to "type": "commonjs" in /root/Repository/mylog-full/apps/mylog-nuxt/package.json to treat all .js files as CommonJS (using .mjs for all ES modules instead).
```

### Docker 在 Ubuntu 24 上的安装

Ubuntu 24 的什么 apt key 管理方式变了，找教程必须找 24 的。

[Ubuntu 24.04 完整Docker安装指南：从零配置到实战命令大全_ubuntu24.04安装docker-CSDN博客](https://blog.csdn.net/u014796292/article/details/147686532?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522b6610b9b702473aac4b235c77b514c07%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request_id=b6610b9b702473aac4b235c77b514c07&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~baidu_landing_v2~default-5-147686532-null-null.142%5Ev102%5Epc_search_result_base4&utm_term=ubuntu%2024%20docker&spm=1018.2226.3001.4187)

