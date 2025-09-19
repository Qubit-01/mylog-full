<script lang="ts" setup>
definePageMeta({ layout: false })

const { refresh } = useFetch<Log[]>('/test/hello-post', {
  ...FetchOptsDefault,
  headers: { Cookie: `token=${useCookie('token').value}` },
  onResponse({ response }) {
    console.log('🐤 ', response._data)
  },
})
const test = () => {
  // 测试能不能拿到 token
  // console.log('token', useCookie('token').value)
  // 测试访问后端接口
  // const cookie = useRequestHeaders(['cookie'])
  // console.log('🐔 useRequestHeaders', cookie)
  // console.log('🐔 useCookie(token)', useCookie('token').value)
  // refresh()
}

// test()

/**
 * credentials: 'include' 要在后端设置 credentials: true
 * 但是后端拿不到cookie
 *
 * 用 useRequestHeaders(['cookie']) 可以，但是在客户端拿不到，会返回 {}
 *
 * 最终用 useCookie('token').value 拿到了
 *
 *
 * 现在是同时加 credentials: 'include' 和 useCookie('token').value
 * 服务器上走 headers.cookie
 * 客户端上走 credentials: 'include'
 *
 */
</script>

<template>
  <div class="test-page _m">
    <el-button @click="test">test</el-button>
  </div>

  <!-- <LiquidGlass /> -->
</template>

<style lang="scss" scoped>
.test-page {
}
</style>
