<script setup lang="ts">
import { signin } from '@/api/user'
import { baseURL } from '@/stores/constant'

const router = useRouter()

const captchaDom = ref<HTMLImageElement | null>(null)

const login = reactive({
  name: '',
  pswd: '',
  captcha: '',
})

// 确认密码独立出来
const pswd2 = ref('')

//刷新验证码
const changeImg = () => {
  captchaDom.value!.src = baseURL + '/user/signin/captcha_img?' + Math.random()
}
onMounted(changeImg)

const doSignin = async () => {
  // 普通校验
  if (!login.name.trim() || !login.pswd.trim() || !pswd2.value.trim()) {
    ElMessage.error('请输入相关信息')
    return false
  }
  // 先确认密码
  if (login.pswd !== pswd2.value) {
    ElMessage.error('两次密码不一致')
    return
  }
  const userid = await signin(login)
  console.log(userid)
  if (userid === 0) {
    ElMessage.error('用户名已存在')
    return
  }
  if (userid === -1) {
    ElMessage.error('验证码错误')
    return
  }
  ElMessage.success('注册成功')
  router.push('/login')
}
</script>

<template>
  <StructLogin>
    <div class="title">注册</div>

    <div class="login">
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

        <ElButton @click="doSignin" size="large">注册</ElButton>
        <div class="toSignin">
          有账号？
          <ElLink type="primary" @click="$router.replace('/login')">
            去登录
          </ElLink>
        </div>
      </form>

      <!-- <div>
        <div class="three">
          <div></div>
          <span>第三方</span>
          <div></div>
        </div>
        <div class="icons">
          <img src="https://s1.hdslb.com/bfs/static/jinkela/passport-pc/assets/wechat.png" alt="QQ登录">
          <img src="https://s1.hdslb.com/bfs/static/jinkela/passport-pc/assets/weibo.png" alt="QQ登录">
          <img src="https://s1.hdslb.com/bfs/static/jinkela/passport-pc/assets/qq.png" alt="QQ登录">
        </div>
      </div> -->
    </div>
  </StructLogin>
</template>

<style scoped lang="less">
.title {
  font-size: 2.5em;
  font-weight: bold;
  margin-bottom: 20px;
}

.loged {
  margin-bottom: 20px;

  > div:nth-child(1) {
    margin-bottom: 24px;
  }
}

.login {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  > form {
    display: flex;
    flex-direction: column;
    gap: 16px;

    input {
      color: var(--color-text);
      background-color: #8882;
      font-size: 1.2rem;
      padding: 12px;
      border-radius: 6px;
      border: none;
      outline: none;
      transition: all 0.5s;

      &:-webkit-autofill {
        -webkit-transition-delay: 111111s;
        transition: color 11111s ease-out, background-color 111111s ease-out;
      }

      &:focus,
      &:hover {
        box-shadow: 1px 1px 2px 2px #0001;
      }
    }

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

    .toSignin {
      display: flex;
      justify-content: flex-end;
    }
  }

  // 选中最后一个div
  > div:last-child {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .three {
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
        border-top: var(--m-border);
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
