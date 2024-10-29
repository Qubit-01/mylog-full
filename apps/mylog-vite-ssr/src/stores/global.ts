import dayjs from "dayjs";
// import { getUser as getUserApi } from '@/api/user'
// import type { User } from '@/types'
// import useUserStore, { setToken } from './user'
// import Cookies from 'js-cookie'

import { UserVO } from "@mylog-full/mylog-trpc-prisma";

/** Global 全局数据的类型 */
interface Global {
  //   /** 用户Token */
  //   token: string
  //   /**
  //    * # 是否是暗黑模式（计算属性）
  //    * 监视 user.setting.page.theme 变化
  //    * 改变 html class属性
  //    */
  //   isDark: boolean
}

export const useGlobalStore = defineStore("global", () => {
  // user的数据得做默认值，因为数据库里面的数据是不全的
  // 设置默认值后，从获取的数据中覆盖
  const user = reactive<UserVO>({
    id: 0,
    name: "",
    img: "",
    info: {},
    setting: {
      page: {
        theme: "light",
      },
      mylog: {
        tags: [],
        filters: [],
        filterIndex: 0,
        calendarTags: [],
      },
      map: {
        diyPoints: [],
      },
    },
    createtime: dayjs(),
  });

  // 主题相关 ===============================

  /** 是否是暗黑模式 */
  const isDark = computed<boolean>({
    get: () => user.setting.page.theme === "dark",
    set: (v) => (user.setting.page.theme = v ? "dark" : "light"),
  });

  // 主题切换
  // const html = document.getElementsByTagName("html")[0];
  // watchEffect(() => {
  //   localStorage.setItem("theme", user.setting.page.theme!);
  //   html.className = user.setting.page.theme!;
  // });

  const isLogined = computed(() => user.id !== 0);

  return {
    user,
    isLogined,
    isDark,
  };
});

export default useGlobalStore;
