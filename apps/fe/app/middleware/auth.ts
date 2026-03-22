export default defineNuxtRouteMiddleware((to, from) => {
  if (!useCookie('token').value) {
    ElMessage.error('请先登录')
    return navigateTo('/signin')
  }
})
