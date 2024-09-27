<script setup lang="ts">
import useUserStore, { logout } from '@/stores/user'
import { vImgSrc } from '@/utils/directives'
const User = useUserStore()
</script>
<!-- 可以加点数量统计 -->
<template>
  <div class="user-lan" v-m>
    <div class="img">
      <img
        v-img-src="
          User.img ||
          'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
        "
        alt="用户头像"
      />
    </div>
    <template v-if="User.isLogined">
      <div class="title" @click="$router.push('/logger')">
        {{ User.name }}
      </div>
      <div class="items">
        <ElButton type="primary" text @click="$router.push('/mylog')">
          发个Log
        </ElButton>
        <ElButton text size="small" @click="logout()" style="margin: 0">
          退出登录
        </ElButton>
      </div>
    </template>
    <template v-else>
      <div class="items">
        <ElButton type="primary" @click="$router.push('/login')">登录</ElButton>
        <ElButton text @click="$router.push('/login/signin')" style="margin: 0"
          >注册</ElButton
        >
      </div>
    </template>
  </div>
</template>

<style scoped lang="less">
.user-lan {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-radius: var(--border-radius);

  z-index: 2;

  .img {
    margin-top: 8px;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .title {
    font-size: 1.5rem;
    cursor: pointer;

    &:hover {
      color: var(--color-2);
    }
  }

  .items {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
}
</style>
