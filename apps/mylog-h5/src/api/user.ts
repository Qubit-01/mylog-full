import type { User } from "@/types";
import request from "@/utils/request";
import Cookie from "js-cookie";

/**
 * 通过用户名密码获取带token的用户信息
 *
 * @augments data { name: string, pswd: string }
 */
export const login = (
  data:
    | {
        name: string
        pswd: string
      }
    | {
        unionidQq: string
      }
): Promise<User> => {
  return request({
    url: "user/login",
    method: "post",
    data,
  })
}

/**
 * 通过token获取用户信息，没找到返回null
 *
 * @augments data { name: string, pswd: string }
 */
export const getUser = (
  params: { token: string } | { unionidQq: string } | { id: string }
): Promise<User> => {
  return request({
    url: "user/get_user",
    method: "get",
    params,
  })
}

/**
 * 查用户名有没有，返回0或1，不区分大小写
 * name 优先级高于 openId
 *
 * @augments data { name: string }
 */
export const haveUser = (
  data: { name: string } | { unionidQq: string }
): Promise<number> => {
  return request({
    url: "user/have_user",
    method: "get",
    params: data,
  })
}

/**
 * 注册 user/signin/signin
 * 用户ID  -1验证码错误 0用户名已存在
 *
 * @augments data { name: string }
 */
export const signin = (data: {
  name: string;
  pswd: string;
  captcha: string;
}): Promise<number> => {
  return request({
    url: "user/signin/signin",
    method: "post",
    data,
  });
};

/**
 * 更新用户设置 user/update_setting
 *
 * @augments setting 用户设置的JSON字符串
 * @return 受影响的条数
 */
export const updateSetting = (data: {
  token?: string;
  settingJson: string;
}): Promise<number> => {
  return request({
    url: "user/update_setting",
    method: "post",
    data: { token: Cookie.get("token"), ...data },
  });
};

/**
 * 更新用户数据 user/update_user
 *
 * @augments userJson userEdit
 * @return 受影响的条数
 */
export const updateUser = (data: {
  token?: string
  userJson: string;
}): Promise<number> => {
  return request({
    url: "user/update_user",
    method: "post",
    data: { token: Cookie.get("token"), ...data },
  });
};

/**
 * 绑定第三方平台
 *
 * @augments userJson userEdit
 * @augments userJson userEdit
 * @augments userJson userEdit
 * @return 受影响的条数
 */
export const bindPlatform = (data: {
  token?: string;
  platform: string;
  unionid: string;
}): Promise<number> => {
  return request({
    url: "user/bind_platform",
    method: "POST",
    data: { token: Cookie.get("token"), ...data },
  });
};
