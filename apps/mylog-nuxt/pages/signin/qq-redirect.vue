<script lang="ts" setup>
import { QC } from '@mylog-full/mix/utils'
const state = ref(0) // 0加载 1选择（没找到用户） 2登录 3注册
// 存储QQ登录的用户信息
const user = reactive<{ data: any; unionidQq: string }>({
  data: {},
  unionidQq: '',
})

// 先获取用户基本信息，再用jsonp获取unionid
onMounted(() => {
  // @ts-ignore 获取 unionid
  window.callback = async (res: any) => {
    user.unionidQq = res.unionid
    // 先看数据库有没有这个openId
    const token = await $fetch<string>('https://mylog.cool:20914/user/token', {
      method: 'POST',
      body: { unionidQq: user.unionidQq },
    })
    if (token)
      loginByToken(token) // 有账号就登录
    else state.value = 1 // 没找到用户，选择
  }

  if (QC.Login.check()) {
    QC.api('get_user_info').success((res: any) => {
      user.data = res.data // 这里面只有用户信息，头像那些
    })
    // 如果是登录状态，这里用了jsonp，看上面的callback
    QC.Login.getMe(async (unionId, accessToken) => {
      const script = document.createElement('script')
      script.src = `https://graph.qq.com/oauth2.0/me?access_token=${accessToken}&unionid=1`
      document.head.appendChild(script)
    })
  } else {
    replace('/signin') // 没有QQ登录跳转登录页
  }
})

// 选择绑定时的输入数据
const input = reactive({ name: '', pswd: '', captcha: '' })
// 确认密码独立出来
const pswd2 = ref('')
const qqImg = ref(false)

// 1.绑定已有账号
const bd = async () => {
  // 先登录获取token，再token和openid一起绑定
  const token = await $fetch<string>('https://mylog.cool:20914/user/token', {
    method: 'POST',
    body: { name: input.name, pswd: input.pswd },
  })
  if (token) {
    console.log('🐔', token)

    // 先绑定平台，再更新头像
    await $fetch<string>('https://mylog.cool:20914/user/set_userlogin', {
      method: 'POST',
      body: { token, unionidQq: user.unionidQq },
    })
    if (qqImg.value) {
      await $fetch<string>('https://mylog.cool:20914/user/set_user', {
        method: 'POST',
        body: { img: user.data.figureurl_qq },
      })
    }
    loginByToken(token, '/')
  } else {
    console.log('🐔用户名或密码错误')
    return
    // return ElMessage.error("用户名或密码不正确");
  }
}
</script>
<template>
  <div class="qq-redirect">
    <!-- {{ user }} -->
    <div class="title">
      <n-button circle quaternary @click="state = 1" style="margin-right: 12px">
        <template #icon>
          <n-icon><ArrowBack /></n-icon>
        </template>
      </n-button>
      QQ登录
      <div style="flex: 1"></div>
      <div class="right">
        <div>{{ user.data.nickname }}</div>
        <img :src="user.data.figureurl_qq" />
      </div>
    </div>

    <!-- 
      v-loading="state === 0"
      element-loading-background="transparent" -->

    <form v-if="state === 1">
      <div class="title2">没有找到对应的用户</div>
      <div>以前有注册过本网站吗？可以直接进行绑定</div>
      <n-button @click="state = 2" size="large">绑定已有账号</n-button>
      <!-- <n-button @click="handleNew" size="large">注册新用户</n-button> -->
    </form>

    <!-- 绑定已有 -->
    <form v-if="state == 2">
      <div class="title2">绑定已有账号</div>
      <input
        type="text"
        class="username"
        v-model="input.name"
        placeholder="用户名"
      />
      <input
        type="password"
        class="password"
        v-model="input.pswd"
        placeholder="密码"
      />
      <div><n-switch v-model:value="qqImg" />&nbsp;&nbsp;使用QQ头像</div>
      <n-button
        @click="bd"
        size="large"
        :disabled="!input.name.trim() || !input.pswd.trim()"
      >
        绑定并登录
      </n-button>
    </form>

    <!-- 注册新用户 -->
    <!-- <form v-if="state == 3">
        <div class="title2">注册新用户</div>
        <input
          type="text"
          v-model="input.name"
          autocomplete="off"
          placeholder="用户名"
        />
        <input
          type="password"
          v-model="input.pswd"
          autocomplete="off"
          placeholder="密码"
        />
        <input
          type="password"
          v-model="pswd2"
          autocomplete="off"
          placeholder="确认密码"
        />
        <div class="captcha">
          <input
            v-model="input.captcha"
            placeholder="验证码"
            type="text"
            autocomplete="off"
          />
          <img ref="captchaDom" alt="验证码看不清，换一张" @click="changeImg" />
        </div>
        <n-button
          class="btn"
          @click="zc"
          size="large"
          :disable="
            !input.name.trim() || !input.pswd.trim() || !pswd2.trim()
          "
        >
          注册并登录
        </n-button>
      </form> -->
  </div>
</template>
<style lang="scss" scoped>
.qq-redirect {
  > .title {
    // 用户QQ昵称和头像
    .right {
      display: flex;
      // flex-direction: column;
      align-items: center;
      font-size: 1rem;
      gap: 8px;

      img {
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
      }
    }
  }

  > form {
    .title2 {
      font-size: 1.3em;
    }
  }
}
</style>
