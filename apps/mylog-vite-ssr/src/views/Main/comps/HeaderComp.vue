<script setup lang="ts">
// todo: 接入pinia
const User = {};

// 判断是否在dev环境
const dev: boolean = import.meta.env.DEV;
</script>
<template>
  <div class="header-comp" v-if="!dev">
    <header>
      <div class="main-container">
        <div class="left">
          <div class="logo" @click="$router.push('/')">
            多元记
            <img src="/img/favicon.svg" />
            <div class="env" v-if="dev">DEV</div>
          </div>
        </div>
        <nav class="center">
          <!-- 我的记录（自己看见的） -->
          <RouterLink to="/mylog">记录</RouterLink>
          <RouterLink to="/album">相册</RouterLink>
          <RouterLink to="/map">地图</RouterLink>
          <RouterLink to="/relation">人脉</RouterLink>
        </nav>
        <div class="right">
          <RouterLink v-if="User.isLogined" class="user" to="/logger">
            {{ User.name }}
          </RouterLink>
          <RouterLink v-else to="/login"> 去登录 </RouterLink>
          <!-- <ThemeSwitch /> -->
        </div>
      </div>
    </header>
    <div class="placeholder"></div>
  </div>
</template>
<style lang="scss" scoped>
:global(:root) {
  --header-height: 64px;
}
.header-comp {
  * {
    transition: width 0.5s;
  }

  header {
    position: fixed;
    top: 0;

    width: 100%;
    height: var(--header-height);

    display: flex;
    justify-content: center;

    background-color: var(--header-background-color);
    backdrop-filter: blur(8px);

    min-width: 500px;

    .main-container {
      display: flex;
      justify-content: space-between;
      width: var(--main-container-width);
      height: 100%;

      > * {
        display: flex;
        align-items: center;

        > * {
          border-radius: 12px;
          transition: all 0.5s;

          &:hover {
            background-color: var(--header-item-hover-background-color);
          }
        }
      }

      > .center {
        flex: 1;

        justify-content: center;
        gap: 10px;

        a {
          color: var(--color);
          padding: 8px 24px;
          display: flex;
          align-items: center;
          font-size: 14px;
        }
      }

      > .left {
        .logo {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 6px 16px;

          font-size: 22px;
          cursor: pointer;

          img {
            position: absolute;
            height: 34px;
            right: 0;
            bottom: 0;
            opacity: 0.7;
          }

          .env {
            position: absolute;
            top: 0;
            left: 0;
            line-height: 14px;
            height: 16px;
            font-size: 10px;
            padding: 0 6px;
            border-radius: 10px;
            background: #f55a;
          }
        }
      }

      @media (max-width: 890px) {
        :global(:root) {
          --header-height: 96px;
        }

        & {
          flex-wrap: wrap;
        }
        > .center {
          min-width: 100%;
          order: 1;
          height: 48px;
        }
        > .left,
        > .right {
          height: 48px;
        }
      }
    }
  }

  .placeholder {
    width: 100%;
    height: var(--header-height);
  }
}
</style>
