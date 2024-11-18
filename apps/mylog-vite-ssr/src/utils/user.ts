import * as UserApi from "@/api/user";
import Cookies from "js-cookie";

/**
 * 登录后跳转，一般在获取到token后使用
 * todo: https
 * @param token 用户token
 * @param to 跳转的位置，不传刷新当前页，传路径跳指定
 */
export const loginByToken = (token: string, to?: string) => {
  Cookies.set("token", token, {
    expires: 60,
    path: "/",
    domain: ".mylog.cool",
    secure: true, // 仅https
    sameSite: "strict", // 防止CSRF攻击和用户追踪
  });
  if (to) location.href = location.origin + to;
  else location.reload();
};

/**
 * 退出登录方法
 * 退出登录，删除 token、pageSetting
 * todo
 * @param to 跳转的页面，不传刷新当前页，传路径跳指定
 */
export const logout = (to?: string) => {
  Cookies.remove("token", { domain: "mylog.cool" });
  // localStorage.removeItem("pageSetting");
  // QC.Login.signOut();
  if (to) location.href = location.origin + to;
  else location.reload();
};

/**
 * 登录测试账号
 */
export const loginTest = async () => {
  const token = await UserApi.getToken({
    name: "测试账号",
    pswd: "12345qaZ",
  });
  loginByToken(token!, "/");
};
