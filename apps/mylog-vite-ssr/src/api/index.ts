/**
 * 默认 POST ，json
 * @param p 自定义请求参数
 * @returns 默认请求参数
 */
export const options = (p: { body: object }) => {
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }, // 'application/x-www-form-urlencoded'
    body: JSON.stringify(p.body),
  };
};
