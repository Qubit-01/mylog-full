<script setup lang="ts">
// todo 一个方案是避免使用验证码，把我之前定的短信服务搞起来
// import { signin } from "@/api/user";
import { baseURL } from "@/stores/constant";

const router = useRouter();

const captchaDom = ref<HTMLImageElement | null>(null);

const login = reactive({
  name: "",
  pswd: "",
  captcha: "",
});

// 确认密码独立出来
const pswd2 = ref("");

//刷新验证码
const changeImg = () => {
  captchaDom.value!.src = baseURL + "/user/signin/captcha_img?" + Math.random();
};
onMounted(changeImg);

const doSignin = async () => {
  // 普通校验
  if (!login.name.trim() || !login.pswd.trim() || !pswd2.value.trim()) {
    // ElMessage.error("请输入相关信息");
    return false;
  }
  // 先确认密码
  if (login.pswd !== pswd2.value) {
    // ElMessage.error("两次密码不一致");
    return;
  }
  const userid = await signin(login);
  console.log(userid);
  if (userid === 0) {
    // ElMessage.error("用户名已存在");
    return;
  }
  if (userid === -1) {
    // ElMessage.error("验证码错误");
    return;
  }
  // ElMessage.success("注册成功");
  router.push("/login");
};
</script>
<template>
  <div class="signin-comp">
    <div class="title">注册</div>

    <form autocomplete="off">
      <input
        v-model="login.name"
        placeholder="用户名"
        type="text"
        autocomplete="off"
      />
      <input
        v-model="login.pswd"
        placeholder="密码"
        type="password"
        autocomplete="off"
      />
      <input
        v-model="pswd2"
        placeholder="确认密码"
        type="password"
        autocomplete="off"
      />
      <div class="captcha">
        <input
          v-model="login.captcha"
          placeholder="验证码"
          type="text"
          autocomplete="off"
        />
        <img ref="captchaDom" alt="验证码看不清，换一张" @click="changeImg" />
      </div>

      <n-button @click="doSignin" size="large">注册</n-button>
    </form>
    <div class="text-link">
      有账号？
      <n-button text type="primary" @click="$router.replace('/login')">
        去登录
      </n-button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.signin-comp {
  > form {
    .captcha {
      display: flex;
      align-items: center;
      gap: 16px;

      input {
        flex: 1;
        width: 0;
      }

      img {
        height: 34px;
        cursor: pointer;
      }
    }
  }
}
</style>
