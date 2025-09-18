/**
 * 通用登录方法
 * @param data 登录数据
 * @param to 跳转的位置
 *   - undefined 不跳
 *   - string 传路径跳指定，空串刷新当前页
 * @returns 登录成功刷新页面
 *   - 如果登录失败，返回undefined
 */
export const signin = async (
  data: { name: string; pswd: string } | { unionidQq: string },
  to?: string,
) => {
  // 后端来设置cookie
  const token = await $fetch<string>('/user/token', {
    ...FetchOptsDefault,
    body: data,
  })
  if (!token) return

  await nextTick()
  if (to) location.href = to
  return token
}

/**
 * 退出登录方法：1.删token 2.退QC 3.跳转
 * @param to 跳转的页面，不传跳主页，传空串刷新当前页，传路径跳指定
 * todo: 删除 httpOnly
 */
export const signout = async (to: string = '/') => {
  const tokenCookie = useCookie('token', { domain: '.mylog.ink' })
  tokenCookie.value = null
  // QC.Login.signOut()
  await nextTick()
  if (to !== '') location.href = to
  else location.reload()
}

/**
 * 登录测试账号
 */
export const loginTest = async () => {
  signin({ name: '测试账号', pswd: '12345qaZ' }, '/')
}
