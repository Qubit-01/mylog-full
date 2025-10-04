<script lang="ts" setup>
// definePageMeta({ middleware: 'auth' })
const { user } = refsGlobalStore()
</script>

<template>
  <div class="LoggerPage">
    用户页
    <div>
      <el-button @click="signout()">退出登录</el-button>
    </div>
    <div class="_m">
      {{ user }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.LoggerPage {
}
</style>
