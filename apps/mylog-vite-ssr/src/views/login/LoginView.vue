<script setup lang="ts">
import useGlobalStore from "@/stores/global";
import LoginComp from "./LoginComp.vue";
const global = useGlobalStore();
</script>

<template>
  <div class="login-view">
    <div class="window m">
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
      <div>
        <div v-if="global.isLogined" class="loged">
          <div>检测到您已经登录了，是否要</div>
          <!-- <ElButton @click="$router.push('/')" type="primary">进入首页</ElButton> -->
          <!-- <ElButton @click="logout('')">退出登录</ElButton> -->
        </div>
        <LoginComp v-else />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-view {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: auto;

  .window {
    width: 700px;
    height: 500px;
    margin: auto;
    min-height: 100px;
    min-width: 100px;

    display: flex;
    flex-direction: row;

    .banner {
      width: 200px;
    }
  }
}
</style>
