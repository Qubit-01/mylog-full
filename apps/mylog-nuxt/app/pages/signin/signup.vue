<script lang="ts" setup>
// todo 使用短信服务注册
const login = reactive({
  name: '',
  pswd: '',
  captcha: '',
})

// 确认密码独立出来
const pswd2 = ref('')

// 验证码图片 DOM
const $Captcha = useTemplateRef('$Captcha')

// 刷新验证码
const changeImg = () => {
  login.captcha = ''
  if ($Captcha.value) {
    $Captcha.value.src = baseURL + '/user/captcha_img?' + Date.now()
  }
}

onMounted(changeImg)

const doSignup = async () => {
  // 普通校验
  if (!login.name.trim() || !login.pswd.trim() || !pswd2.value.trim()) {
    ElMessage.error('请输入相关信息')
    return
  }
  // 先确认密码
  if (login.pswd !== pswd2.value) {
    ElMessage.error('两次密码不一致')
    return
  }
  if (!login.captcha.trim()) {
    ElMessage.error('请输入验证码')
    return
  }

  try {
    await $fetchApi<{ token: string }>('/user/signup', { body: login })
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '注册失败')
    changeImg()
    return
  }

  ElMessage.success('注册成功，正在跳转...')
  await nextTick()
  location.href = '/'
}
</script>
<template>
  <div class="signup">
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
        <img ref="$Captcha" alt="" title="点击刷新" @click="changeImg" />
      </div>

      <ElButton @click="doSignup" size="large">注册</ElButton>
    </form>
    <div class="text-link">
      有账号？
      <ElButton link type="primary" @click="replace('/signin')">
        去登录
      </ElButton>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.signup {
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
        border-radius: 4px;
      }
    }
  }
}
</style>
