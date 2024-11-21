<script setup lang="ts">
import { logout } from '@/utils/user';
</script>
<template>
  <div class="logger-view">
    用户主页
    <NButton @click="logout()">退出登录</NButton>
  </div>
</template>
<style lang="scss" scoped>
.logger-view {
}
</style>
