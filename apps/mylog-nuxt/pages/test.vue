<script lang="ts" setup>
const { refresh } = useFetch<Log[]>('/test/hello-post', {
  method: 'POST',
  // credentials: 'include',
  // headers: {
  //   cookie: 'token=' + useCookie('token').value,
  // },
  baseURL,
  onResponse({ response }) {
    console.log('🐤 ', response._data)
  },
})
const test = () => {
  const cookie = useRequestHeaders(['cookie'])
  console.log('🐔 useRequestHeaders', cookie)
  console.log('🐔 useCookie(token)', useCookie('token').value)
  refresh()
}

// test()
</script>

<template>
  <div class="test-page _m">
    <el-button @click="test">test</el-button>
  </div>
</template>

<style lang="scss" scoped>
.test-page {
}
</style>
