import {
  createMemoryHistory,
  createRouter,
  createWebHistory,
} from "vue-router";
// 文件夹大写的是大框架，小写是框架里面的主要内容

declare module "vue-router" {
  interface RouteMeta {
    /** 是否需要登录验证，否则跳转login */
    requiresAuth?: boolean;
    /** 页面标题，没有就重置为 '多元记 - 把你写成书' */
    title?: string;
  }
}

const history = import.meta.env.SSR
  ? createMemoryHistory(import.meta.env.BASE_URL)
  : createWebHistory(import.meta.env.BASE_URL);

const routes = [
  {
    path: "",
    redirect: "/home",
    component: () => import("./Main/MainView.vue"),
    children: [
      {
        path: "",
        name: "home", // 主页
        component: () => import("./home/HomeView.vue"),
      },
      {
        path: "logger", // 我的主页（别人看的）
        component: () => import("./logger/index.vue"),
        props: ({ query: { id } }: { query: { id: string } }) => ({ id }),
        meta: { title: "主页 - 多元记", requiresAuth: true },
        children: [
          {
            path: "",
            name: "logger", // 时间线
            component: () => import("./logger/LoggerComp.vue"),
            props: ({ query: { id } }: { query: { id: string } }) => ({ id }),
          },
          {
            path: "setting",
            name: "setting", // 设置
            component: () => import("./logger/SettingComp.vue"),
          },
        ],
      },
      {
        path: "mylog", // 我的记录（自己看的）
        component: () => import("./mylog/index.vue"),
        meta: { title: "记录 - 多元记", requiresAuth: true },
        children: [
          {
            path: "",
            name: "mylog", // 时间线
            component: () => import("./mylog/TimelineComp.vue"),
          },
          {
            path: "calendar",
            name: "calendar", // 日历
            component: () => import("./mylog/CalendarComp.vue"),
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    component: () => import("./login/index.vue"),
    children: [
      {
        path: "",
        name: "login", // 登录
        component: () => import("./login/LoginComp.vue"),
        meta: { title: "登录 - 多元记" },
      },
      {
        path: "signin",
        name: "signin", // 注册
        component: () => import("./login/SigninComp.vue"),
        meta: { title: "注册 - 多元记" },
      },
      {
        path: "qq-redirect",
        name: "qq-redirect", // QQ重定向页面
        component: () => import("./login/QQRedirectComp.vue"),
        meta: { title: "QQ登录 - 多元记" },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "404",
    component: () => import("./404/404View.vue"),
    meta: { title: "404 - 多元记" },
  },
];

export function newRouter() {
  const router = createRouter({ history, routes });

  router.beforeEach((to, from) => {
    if (!import.meta.env.SSR) {
      if (import.meta.env.DEV) document.title = "测试";
      else document.title = to.meta.title || "多元记 - 把你写成书";
    }

    // 这里是处理没有token的情况，token是否错误或过期这里不处理
    // if (to.meta.requiresAuth && !Cookies.get('token')) {
    //   ElMessage({ message: '请先登录', type: 'warning' })
    //   return {
    //     name: 'login',
    //     query: { redirect: to.fullPath },
    //   }
    // }
  });

  return router;
}

export default newRouter();
