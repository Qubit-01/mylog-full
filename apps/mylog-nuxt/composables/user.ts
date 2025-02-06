/**
 * 通过token登录
 * 不管是什么登录方式，最终都会拿到token，然后调用这个方法
 * @param token 用户token
 * @param to 传入函数，跳转的位置
 *   - 不传，默认() => '/' 跳转主页
 *   - () => undefined 刷新当前页
 *   - () => string 传路径跳指定
 */
export const loginByToken = async (
  token: string,
  to: () => string | void | Promise<string | void> = () => '/',
) => {
  const tokenCookie = useCookie('token', {
    maxAge: 60 * 60 * 24 * 60, // 秒
    secure: true, // 仅https
    sameSite: 'strict', // 防止CSRF攻击和用户追踪
    domain: '.mylog.ink', // 二级域名共享
    path: '/',
  })
  tokenCookie.value = token
  await nextTick()
  const path = await to()
  if (path) location.href = path
  else location.reload()
}

/**
 * 退出登录方法：1.删token 2.退QC 3.跳转
 * @param to 跳转的页面，不传跳主页，传空串刷新当前页，传路径跳指定
 */
export const signout = (to: string = '/') => {
  const token = useCookie('token')
  token.value = null
  // QC.Login.signOut()
  if (to !== '') location.href = to
  else location.reload()
}

/**
 * 登录测试账号
 */
export const loginTest = async () => {
  const res = await $fetch<string>(BaseURL + '/user/token', {
    method: 'POST',
    body: { name: '测试账号', pswd: '12345qaZ' },
  })
  loginByToken(res)
}
