<script setup lang="ts">
import { vOverflowEllipsis } from '@/utils/directives'
import { BucketCDN } from '@/stores/constant'
import useUserStore from '@/stores/user'
const User = useUserStore()
const router = useRouter()

// 判断是否在dev环境
const dev: boolean = import.meta.env.DEV
</script>

<template>
  <div class="header">
    <header v-m>
      <div class="center">
        <div class="left">
          <div class="logo" @click="router.push('/')">
            <img src="@/assets/img/favicon.svg" />
            多元记
            <div class="env" v-if="dev">DEV</div>
          </div>
        </div>
        <nav> 
          <!-- 我的记录（自己看见的） -->
          <RouterLink to="/mylog" v-overflow-ellipsis>记录</RouterLink>
          <RouterLink to="/album" v-overflow-ellipsis>相册</RouterLink>
          <RouterLink to="/map" v-overflow-ellipsis>地图</RouterLink>
          <RouterLink to="/relation" v-overflow-ellipsis>人脉</RouterLink>
        </nav>
        <div class="right">
          <RouterLink v-if="User.isLogined" class="user" to="/logger">
            {{ User.name }}
          </RouterLink>
          <ElLink v-else type="primary" @click="$router.push('login')">
            去登录
          </ElLink>
          <ThemeSwitch />
        </div>
      </div>
    </header>
    <div class="placeholder"></div>
  </div>
</template>

<style scoped lang="less">
.header {
  header {
    position: fixed;
    z-index: 50;
    width: 100%;
    display: flex;
    justify-content: center;
    line-height: var(--header-height);
    // 覆盖 -m 的一些样式
    border-top: 0;
    border-left: 0;
    border-right: 0;

    > .center {
      width: var(--center-width);
      transition: width 0.5s;

      display: flex;
      column-gap: var(--gap);
      justify-content: space-between;
      align-items: center;

      > nav {
        flex: 1;
        display: flex;
        justify-content: center;
        // justify-content: flex-start;
        font-size: 1.1rem;
        height: var(--header-height);

        > a {
          text-decoration: none;
          color: inherit;
          padding-left: 20px;
          padding-right: 20px;

          &:hover {
            background: #ccc5;
          }
        }
      }

      > .left {
        .logo {
          position: relative;
          font-size: 22px;
          width: var(--lan-width);
          height: var(--header-height);
          padding-left: 20px;
          padding-right: 20px;

          display: flex;
          justify-content: center;

          cursor: pointer;

          &:hover {
            background: #aaa5;
          }

          img {
            position: absolute;
            height: 34px;
            left: 80px;
            top: 25px;
            opacity: 0.7;
          }

          .env {
            position: absolute;
            top: 6px;
            left: 12px;
            line-height: 14px;
            height: 16px;
            font-size: 10px;
            padding: 0 6px;
            border-radius: 10px;
            background: #f55a;
          }
        }
      }

      > .right {
        display: flex;
        gap: 12px;
        align-items: center;
        justify-content: flex-end;

        .theme-switch {
          --el-switch-on-color: #2c2c2c;
          --el-switch-off-color: #f2f2f255;
          --color: #333;
        }

        > .user {
          text-decoration: none;
          color: inherit;
          padding-left: 20px;
          padding-right: 20px;

          &:hover {
            background: #ccc5;
          }
        }
      }

      @media (max-width: 700px) {
        flex-wrap: wrap;
        > .left {
          width: 45%;
        }
        > .right {
          width: 45%;
        }

        > nav {
          order: 2;
          font-size: 1rem;
        }
      }
    }
  }

  // 占位
  .placeholder {
    height: var(--header-top);
  }
}
</style>
