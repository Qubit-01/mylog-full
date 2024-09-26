import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
// https://vitepress.dev/reference/default-theme-config
export default defineConfig({
  lang: "zh-CN",
  title: "多元记",
  description: "把你写成书~",
  head: [
    ['link', { rel: 'icon', href: 'https://cos.mylog.cool/web-files/favicon.svg' }]
  ],
  themeConfig: {
    // 默认用上面title，这里单独设置导航栏的
    siteTitle: "多元记",
    
    // 顶部标题左边的logo
    logo: "https://cos.mylog.cool/web-files/favicon.svg",
    // 顶部导航栏
    nav: [
      { text: "首页", link: "/" },
      { text: "简介", link: "/简介" },
      {
        text: "其他功能",
        items: [
          { text: "相册", link: "/相册" },
          { text: "地图", link: "/地图" },
        ],
      },
    ],
    // 顶部社交平台跳转
    socialLinks: [
      { icon: "github", link: "https://github.com/Qubit-01/mylog2" },
    ],
    // 开启搜索
    search: {
      provider: "local",
    },
    // 底部
    footer: {
      message: '如果喜欢小站，不妨分享给你的朋友哦~',
    },
    // 文档页面侧边栏
    sidebar: [
      {
        text: "简介",
        items: [
          { text: "什么是多元记？", link: "/简介" },
          { text: "快速开始", link: "/快速开始" },
        ],
      },
      {
        text: "记录",
        items: [
          { text: "开始你的第一条记录", link: "/简介" },
          { text: "快速开始", link: "/快速开始" },
        ],
      },
      {
        text: "其他功能",
        // 是否可折叠
        // collapsed: false,
        items: [
          { text: "相册", link: "/简介" },
          { text: "地图", link: "/快速开始" },
        ],
      },
    ],
    // 文档中下一页按钮
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    }
  },
});
