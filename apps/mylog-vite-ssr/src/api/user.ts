import { options } from ".";

const url = 'https://mylog.cool:3000';

/**
 * 获取token。用于登录，getUser不行，目前token只包含id信息
 * @param body unionidQq > name+pswd
 * @returns 用户token
 */
export const getToken = async (
  body: { unionidQq: string } | { name: string; pswd: string },
) => {
  const response = await fetch(url + '/user/token', options({ body }));
  return await response.text(); // 这里不是json了
};

/**
 * 获取用户信息，id > name > token
 * @param id 用户ID
 * @param name 用户名
 * @param token 用户token
 * @returns 用户信息
 */
export const getUser = async (
  body: { id: number } | { name: string } | { token: string },
) => {
  const response = await fetch(url + '/user/get_user', options({ body }));
  return await response.json();
};

/**
 * 设置用户信息
 * @param token 用户令牌，
 * @param data 要设置的数据。目前只能设置img/info/setting
 */
export const setUser = async (body: {
  token: string;
  data: {
    img?: string;
    info?: string;
    setting?: string;
  };
}) => {
  const response = await fetch(url + '/user/set_user', options({ body }));
  return await response.text();
};

/**
 * 设置用户登录数据
 * @param token 用户令牌
 * @param unionidQq QQ的unionid
 * @param unionidWeixin 微信的unionid
 */
export const setUserLogin = async (body: {
  token: string;
  unionidQq?: string;
  unionidWeixin?: string;
}) => {
  const response = await fetch(url + '/user/set_userlogin', options({ body }));
  return await response.text();
};
