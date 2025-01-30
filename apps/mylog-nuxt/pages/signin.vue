<script lang="ts" setup>
import ThemeSwitch from '~/components/utils/ThemeSwitch.vue'
definePageMeta({ layout: false })
// QQ登录 重定向后data-callback="true"?
useHead({
  script: [
    {
      type: 'text/javascript',
      src: 'https://connect.qq.com/qc_jssdk.js',
      'data-appid': '102099147',
      'data-redirecturi': 'https://mylog.cool/login/qq-redirect',
    },
  ],
})
const { isLogined } = refsGlobalStore()
</script>

<template>
  <NuxtLayout name="empty">
    <div class="signin-page">
      <div class="window _m">
        <div class="banner">
          <div class="text">
            <div>欢迎来到</div>
            <div class="title">多元记</div>
            <div>把你写成书 ~</div>
          </div>
          <ThemeSwitch class="theme-switch" />
        </div>
        <div class="main">
          <div v-if="isLogined" class="loged">
            <div>检测到您已经登录了，是否要</div>
            <el-button @click="replace('/')" type="primary">
              进入首页
            </el-button>
            <el-button @click="signout()">退出登录</el-button>
          </div>
          <NuxtPage v-else />
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<style lang="scss" scoped>
.signin-page {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: auto;

  .window {
    margin: auto;
    width: 700px;
    height: 500px;
    min-height: 100px;
    min-width: 100px;
    border-radius: var(--border-radius);

    display: flex;
    flex-direction: row;
    overflow: hidden;

    .banner {
      width: 300px;

      border-radius: var(--block-border-radius);
      // background-image: url("https://api.lyiqk.cn/scenery");
      background-position: center center;
      background-size: cover;
      box-shadow: 0 0 16px 3px #0001;

      .text {
        border-radius: 20px;
        padding: 24px;
        background-color: #aaa1;
        backdrop-filter: blur(16px);
        margin-top: 40px;
        margin-left: 40px;
        margin-right: 40px;

        .title {
          font-size: 2.5em;
          font-weight: bold;
        }
      }

      .theme-switch {
        position: absolute;
        bottom: 20px;
        left: 20px;
      }
    }

    .main {
      flex: 1;
      padding: 40px;
      width: 400px;
      display: flex;
      flex-direction: column;
      transition: width 1s linear;

      .loged {
        margin-bottom: 20px;

        > div:nth-child(1) {
          margin-bottom: 24px;
        }
      }

      // 这里统一写内部的样式
      :deep(.signin),
      :deep(.signup),
      :deep(.qq-redirect) {
        height: 100%;
        display: flex;
        flex-direction: column;

        > .title {
          font-size: 2.5em;
          font-weight: bold;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
        }

        > form {
          display: flex;
          flex-direction: column;
          gap: 24px;

          input {
            color: var(--color-text);
            background-color: #8882;
            font-size: 1.2rem;
            padding: 12px;
            border-radius: 6px;
            border: none;
            outline: none;
            transition: all 0.5s;

            /* 去除自动浏览器自动填充添加的样式 */
            &:-webkit-autofill,
            &:-webkit-autofill:hover,
            &:-webkit-autofill:focus,
            &:-webkit-autofill:active {
              -webkit-transition-delay: 99999s;
              -webkit-transition:
                color 99999s ease-out,
                background-color 99999s ease-out;
            }

            &:focus,
            &:hover {
              box-shadow: 1px 1px 2px 2px #0001;
            }
          }
        }

        // 表单模块下的文本，如：没有账号？
        > .text-link {
          display: flex;
          justify-content: flex-end;
          flex: 1;
        }
      }
    }

    @media (max-width: 800px) {
      & {
        width: 90%;
        min-width: 400px;
      }
      .banner {
        display: none;
      }
    }
  }
}
</style>
