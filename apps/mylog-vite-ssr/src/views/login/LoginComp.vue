<script setup lang="ts">
import * as UserApi from "@/api/user";
import { appId, redirectURI } from "@/utils/qq-connect";
import { loginByToken, loginTest } from "@/utils/user";

const route = useRoute();

const loginData = reactive({
  name: "",
  pswd: "",
});

const doLogin = async () => {
  const token = await UserApi.getToken(loginData);
  if (token) {
    loginByToken(token, route.query.redirect as string ?? '/');
  } else {
    console.log("🐔用户名或密码错误");
  }
};

/** 跳转QQ登录 */
const qqLogin = () => {
  let state = "login"; // 防止CSRF攻击的随机参数，必传，登录成功之后会回传，最好后台自己生成然后校验合法性
  location.href = `https://graph.qq.com/oauth2.0/authorize?response_type=token&client_id=${appId}&redirect_uri=${encodeURIComponent(
    redirectURI
  )}&state=${state}`;
};
</script>
<template>
  <div class="login-comp">
    <div class="title">登录</div>

    <form>
      <input
        v-model="loginData.name"
        placeholder="用户名"
        type="text"
        autocomplete="on"
      />
      <input
        v-model="loginData.pswd"
        placeholder="密码"
        type="password"
        autocomplete="on"
      />
      <n-button @click="doLogin" size="large">登录</n-button>
    </form>

    <div class="text-link">
      <span>
        没有账号？
        <n-button text @click="$router.replace('/login/signin')" type="primary">
          去注册
        </n-button>
        或
        <n-button text @click="loginTest" type="primary">
          登录测试账号
        </n-button>
      </span>
    </div>

    <div class="three">
      <div class="text">
        <div></div>
        <span>第三方登录</span>
        <div></div>
      </div>
      <div class="icons">
        <img
          @click="qqLogin"
          src="https://s1.hdslb.com/bfs/static/jinkela/passport-pc/assets/qq.png"
          alt="QQ登录"
        />
        <!-- <img
          src="https://s1.hdslb.com/bfs/static/jinkela/passport-pc/assets/wechat.png"
          alt="微信登录"
        />
        <img
          src="https://s1.hdslb.com/bfs/static/jinkela/passport-pc/assets/weibo.png"
          alt="微博登录"
        /> -->
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.login-comp {
  // 选中最后一个div
  > .three {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .text {
      display: flex;
      align-items: center;
      opacity: 0.6;

      > span {
        margin: 0 20px;
      }

      > div {
        display: inline-block;
        height: 0;
        flex: 1;
        border-top: 1px solid #ccc;
      }
    }

    .icons {
      display: flex;
      justify-content: space-evenly;

      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
      }
    }
  }
}
</style>
