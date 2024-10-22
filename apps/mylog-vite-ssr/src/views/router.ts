import {
  createMemoryHistory,
  createRouter,
  createWebHistory,
} from "vue-router";
// 文件夹大写的是大框架，小写是框架里面的主要内容
import MainView from "./Main/MainView.vue";
import HomeView from "./home/HomeView.vue";
import LoginView from "./login/LoginView.vue";

declare module "vue-router" {
  interface RouteMeta {
    /** 是否需要登录验证，否则跳转login */
    requiresAuth?: boolean;
    /** 页面标题，没有就重置为 '多元记 - 把你写成书' */
    title?: string;
  }
}

const router = createRouter({
  history: import.meta.env.SSR
    ? createMemoryHistory(import.meta.env.BASE_URL)
    : createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "",
      redirect: "/home",
      component: MainView,
      children: [
        {
          path: "",
          name: "home", // 主页
          component: HomeView,
        },
        {
          path: "logger", // 我的主页（别人看的）
          component: () => import("./logger/LoggerView.vue"),
          props: ({ query: { id } }) => ({ id }),
          meta: { title: "主页 - 多元记" },
          // children: [
          //   {
          //     path: '',
          //     name: 'logger', // 时间线
          //     component: () =>
          //       import('../components/Pages/Logger/LoggerComp.vue'),
          //     props: ({ query: { id } }) => ({ id }),
          //   },
          //   {
          //     path: 'setting',
          //     name: 'setting', // 设置
          //     component: () =>
          //       import('../components/Pages/Logger/SettingComp.vue'),
          //   },
          // ],
        },
      ],
    },
    {
      path: "/login",
      component: LoginView,
    },
    {
      path: "/:pathMatch(.*)*",
      name: "404",
      component: () => import("./404/404View.vue"),
      meta: { title: "404 - 多元记" },
    },
  ],
});

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

export default router;
