<script setup lang="ts">
import { loginTest } from '@/stores/user';
import { useVisNetwork } from '@/utils/vis-network'
import Cookie from 'js-cookie'

// const networkDom = ref<HTMLDivElement>()

console.log('🐤', Cookie.get('token'))

</script>

<template>
  <div class="test-page" v-m>
    <ElButton @click="loginTest">登录测试账号</ElButton>

  </div>
</template>

<style scoped lang="less">
.test-page {
  border-radius: var(--border-radius);
  padding: var(--padding);

  height: calc(100vh - var(--header-top) - var(--gap));

  display: flex;
  flex-direction: column;

  .network {
    height: 0;
    flex: 1;
  }
}
</style>
