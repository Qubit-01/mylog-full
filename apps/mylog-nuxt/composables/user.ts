/**
 * 通过token登录
 * 不管是什么登录方式，最终都会拿到token，然后调用这个方法
 * @param token 用户token
 * @param to 跳转的位置，不传跳主页，传空串刷新当前页，传路径跳指定
 */
export const loginByToken = (token: string, to: string = '/') => {
  const tokenCookie = useCookie('token')
  tokenCookie.value = token
  // Cookies.set("token", token, {
  //   expires: 60,
  //   path: "/",
  //   domain: ".mylog.cool",
  //   secure: true, // 仅https
  //   sameSite: "strict", // 防止CSRF攻击和用户追踪
  // });
  if (to !== '') location.href = to
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
  const res = await $fetch<string>('https://mylog.cool:20914/user/token', {
    method: 'POST',
    body: { name: '测试账号', pswd: '12345qaZ' },
  })
  loginByToken(res)
}
