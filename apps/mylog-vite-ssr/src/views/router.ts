import { createMemoryHistory, createRouter } from "vue-router";
import MainView from "./MainView/index.vue";

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
          component: () => import("./home/index.vue"),
        },
        //   {
        //     path: 'logger', // 我的主页（别人看的）
        //     component: () => import('./logger/index.vue'),
        //     props: ({ query: { id } }) => ({ id }),
        //     meta: { title: '主页 - 多元记' },
        //     children: [
        //       {
        //         path: '',
        //         name: 'logger', // 时间线
        //         component: () =>
        //           import('../components/Pages/Logger/LoggerComp.vue'),
        //         props: ({ query: { id } }) => ({ id }),
        //       },
        //       {
        //         path: 'setting',
        //         name: 'setting', // 设置
        //         component: () =>
        //           import('../components/Pages/Logger/SettingComp.vue'),
        //       },
        //     ],
        //   },
        //   {
        //     path: 'mylog', // 我的记录（自己看的）
        //     component: () => import('./mylog/index.vue'),
        //     meta: { title: '记录 - 多元记', requiresAuth: true },
        //     children: [
        //       {
        //         path: '',
        //         name: 'mylog', // 时间线
        //         component: () =>
        //           import('../components/Pages/Mylog/TimelineComp.vue'),
        //       },
        //       {
        //         path: 'todo',
        //         name: 'todo', // 待办
        //         component: () => import('../components/Pages/Mylog/TodoComp.vue'),
        //       },
        //       {
        //         path: 'calendar',
        //         name: 'calendar', // 日历
        //         component: () =>
        //           import('../components/Pages/Mylog/CalendarComp.vue'),
        //       },
        //     ],
        //   },
        //   {
        //     path: 'album',
        //     name: 'album', // 相册
        //     component: () => import('./album/index.vue'),
        //     meta: { title: '相册 - 多元记', requiresAuth: true },
        //   },
        //   {
        //     path: 'map',
        //     name: 'map', // 地图
        //     component: () => import('./map/index.vue'),
        //     meta: { title: '地图 - 多元记', requiresAuth: true },
        //   },
        //   {
        //     path: 'relation',
        //     name: 'relation', // 人脉
        //     component: () => import('./relation/index.vue'),
        //     meta: { title: '人脉 - 多元记', requiresAuth: true },
        //   },
        //   {
        //     path: 'share',
        //     name: 'share', // 分享
        //     component: () => import('./share/index.vue'),
        //     meta: { title: '分享 - 多元记' },
        //   },
        //   {
        //     path: '/test',
        //     name: 'test',
        //     component: () => import('./test/index.vue'),
        //     meta: { title: '测试 - 多元记' },
        //   },
      ],
    },
    // {
    //   path: '/login',
    //   component: LoginView,
    //   children: [
    //     {
    //       path: '',
    //       name: 'login', // 登录
    //       component: () => import('../components/Pages/Login/LoginComp.vue'),
    //       meta: { title: '登录 - 多元记' },
    //     },
    //     {
    //       path: 'signin',
    //       name: 'signin', // 注册
    //       component: () => import('../components/Pages/Login/SigninComp.vue'),
    //       meta: { title: '注册 - 多元记' },
    //     },
    //     {
    //       path: 'qq-redirect',
    //       name: 'qq-redirect', // QQ重定向页面
    //       component: () => import('../components/Pages/Login/QQRedirect.vue'),
    //       meta: { title: 'QQ登录 - 多元记' },
    //     },
    //   ],
    // },
    {
      path: "/:pathMatch(.*)*",
      name: "404",
      component: () => import("./404/index.vue"),
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
