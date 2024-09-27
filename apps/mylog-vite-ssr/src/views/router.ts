import { createMemoryHistory, createRouter } from "vue-router";
import MainView from "./MainView/index.vue";
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
  history: createMemoryHistory(),
  routes: [
    {
      path: "/",
      component: MainView,
      children: [
        {
          path: "",
          name: "home", // 主页
          component: HomeView,
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
  document.title = to.meta.title || "多元记 - 把你写成书";

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
