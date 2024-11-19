import { options } from '.';

const url = 'https://mylog.cool:3000';

/**
 * 获取token。用于登录，getUser不行，目前token只包含id信息
 * @param body unionidQq > name+pswd
 * @returns 用户token
 */
export const getPublic = async (body: { id: number }) => {
  const response = await fetch(url + '/log/get_public', options({ body }));
  return await response.json(); // 这里不是json了
};

/**
 * 获取token。用于登录，getUser不行，目前token只包含id信息
 * @param body unionidQq > name+pswd
 * @returns 用户token
 */
export const getPublics = async (body: {
  userid?: number;
  skip: number;
  limit: number;
}) => {
  const response = await fetch(url + '/log/get_publics', options({ body }));
  return await response.json(); // 这里不是json了
};
