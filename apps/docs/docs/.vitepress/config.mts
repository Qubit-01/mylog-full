import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "多元记 - 记录生活，记录你",
  description: "一个帮助你记录、管理所有媒体资源的应用",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    // 右上角的导航栏
    nav: [
      { text: "首页", link: "/" },
      { text: "介绍", link: "/introduction" },
    ],
    // 左侧的侧边栏
    sidebar: [
      {
        text: "开始",
        items: [
          {
            text: "介绍",
            link: "/introduction",
            items: [
              { text: "主页", link: "/introduction" },
              { text: "记录页", link: "/api-examples" },
              { text: "时间线", link: "/timeline" },
            ],
          },
          {
            text: "技术栈",
            link: "/introduction",
            items: [
              { text: "前端", link: "/api-examples" },
              { text: "后端", link: "/api-examples" },
              { text: "服务器", link: "/api-examples" },
            ],
          },
          { text: "时间线", link: "/timeline" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
});
