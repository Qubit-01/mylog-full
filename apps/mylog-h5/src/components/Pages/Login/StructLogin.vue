<script setup lang="ts">
import useUserStore, { logout } from '@/stores/user'

const User = useUserStore()
const router = useRouter()
</script>

<template>
  <div class="login-comp" v-m>
    <div class="banner">
      <div class="text">
        <div>欢迎来到</div>
        <div class="title">多元记</div>
        <div></div>
        <div>把你写成书 ~</div>
      </div>
      <div class="theme-switch">
        <ThemeSwitch />
      </div>
    </div>

    <div class="main">
      <div v-if="User.isLogined" class="loged">
        <div>检测到您已经登录了，是否要</div>
        <ElButton @click="router.push('/')" type="primary">进入首页</ElButton>
        <ElButton @click="logout('')">退出登录</ElButton>
      </div>

      <template v-else>
        <slot>加载中...</slot>
      </template>
    </div>
  </div>
</template>

<style scoped lang="less">
.login-comp {
  border-radius: 24px;
  width: 70vw;
  min-width: 300px;
  max-width: 1000px;
  height: 50vh;
  min-height: 550px;
  display: flex;

  .banner {
    flex: 1;
    // width: 400px;
    max-width: 600px;
    border-radius: 24px;
    background-image: url('https://api.lyiqk.cn/scenery');
    background-position: center center;
    background-size: cover;
    position: relative;
    box-shadow: 0 0 4px 4px #0003;

    .text {
      border-radius: 20px;
      padding: 24px;
      border: 1px solid var(--m-border);
      background-color: var(--m-background-color);
      backdrop-filter: blur(16px);
      margin-top: 40px;
      margin-left: 40px;
      margin-right: 40px;

      .title {
        font-size: 2.5em;
        font-weight: bold;
        color: var(--m-text-color);
      }
    }

    .theme-switch {
      position: absolute;
      bottom: 20px;
      left: 20px;
    }
  }

  .main {
    padding: 40px;
    width: 400px;
    display: flex;
    flex-direction: column;

    .loged {
      margin-bottom: 20px;

      > div:nth-child(1) {
        margin-bottom: 24px;
      }
    }
  }

  @media (max-width: 1024px) {
    & {
      width: inherit;
    }

    .banner {
      display: none;
    }
  }
}
</style>
