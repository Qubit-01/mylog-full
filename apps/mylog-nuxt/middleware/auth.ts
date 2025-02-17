export default defineNuxtRouteMiddleware((to, from) => {
  const { isLogined } = refsGlobalStore()
  if (!isLogined.value) {
    ElMessage.info('请先登录')
    return navigateTo('/signin')
  }
})
