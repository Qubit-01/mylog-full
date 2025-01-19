<script setup lang="ts">
import dayjs from 'dayjs'
import '~/assets/css/light.scss'
import OneSentence from '~/components/aside/OneSentence.vue'
import NoteAside from '~/components/aside/NoteAside.vue'
import ThemeSwitch from '~/components/utils/ThemeSwitch.vue'

console.info('🐤layouts/default.vue')

// 判断是否在dev环境
const dev: boolean = import.meta.dev

const webRuntime = ref([0, 0, 0, 0])
const serverTime = ref([0, 0, 0, 0])
const pageRuntime = ref([0, 0, 0, 0])
let timer: NodeJS.Timeout

onMounted(() => {
  // 用户注册时间
  const userCreatetime = dayjs('2021-11-21T22:25:20.000Z').valueOf() // dayjs(User.createtime).valueOf()
  const startTime = dayjs('2021-11-21T22:25:20.000Z').valueOf() // 建站时间
  const pageTime = dayjs().valueOf()

  timer = setInterval(() => {
    let time = dayjs().valueOf()
    // 建站运行时间
    let lenth = Math.floor((time - startTime) / 1000)
    let d = Math.floor(lenth / (60 * 60 * 24))
    lenth %= 60 * 60 * 24
    let h = Math.floor(lenth / (60 * 60))
    lenth %= 60 * 60
    let m = Math.floor(lenth / 60)
    lenth %= 60
    webRuntime.value = [d, h, m, lenth]
    // 页面运行时间
    lenth = Math.floor((time - pageTime) / 1000)
    m = Math.floor(lenth / 60)
    lenth %= 60
    pageRuntime.value = [d, h, m, lenth]

    // 服务时间
    lenth = Math.floor((time - userCreatetime) / 1000)
    d = Math.floor(lenth / (60 * 60 * 24))
    lenth %= 60 * 60 * 24
    h = Math.floor(lenth / (60 * 60))
    lenth %= 60 * 60
    m = Math.floor(lenth / 60)
    lenth %= 60
    serverTime.value = [d, h, m, lenth]
  }, 1000)
})

onBeforeUnmount(() => clearInterval(timer))
</script>
<template>
  <div class="default-layout">
    <header>
      <div class="center">
        <div class="left">
          <div class="logo" @click="$router.push('/')">
            <img src="/favicon.png" />
            多元记
            <div class="env" v-if="dev">DEV</div>
          </div>
        </div>
        <nav>
          <el-button text to="/mylog">记录</el-button>
          <el-button text to="/album">相册</el-button>
          <el-button text to="/map">地图</el-button>
          <el-button text to="/relation">人脉</el-button>
        </nav>
        <div class="right">
          <div class="mix">
            <!-- <el-button v-if="User.isLogined" class="user" to="/logger">
              {{ User.name }}
            </el-button> -->
            <!-- @click="$router.push('login')" -->
            <el-button text type="primary" to="/relation">去登录</el-button>
            <ThemeSwitch />
          </div>
        </div>
      </div>
    </header>
    <!-- 顶栏在主文档流中的占位 -->
    <div class="placeholder" />

    <main>
      <div class="center">
        <div class="middle">
          <slot />
        </div>
        <aside class="left">
          <!-- <UserLan /> -->
          <NoteAside />
        </aside>
        <aside class="right">
          <!-- 目录栏 -->
          <!-- <ContentLan /> -->
          <OneSentence />
        </aside>
      </div>
    </main>
    <footer>
      <div class="center">
        <div class="statistic">
          <div>
            <div class="title">页面已运行</div>
            <div class="time">
              {{ pageRuntime[2] }}<i>分</i> {{ pageRuntime[3] }}<i>秒</i>
            </div>
          </div>
          <div>
            <el-tooltip
              content="从您注册时间到现在"
              effect="light"
              placement="top"
            >
              <div class="title">已为你服务</div>
            </el-tooltip>
            <div class="time">
              {{ serverTime[0] }}<i>天</i> {{ serverTime[1] }}<i>时</i>
              {{ serverTime[2] }}<i>分</i> {{ serverTime[3] }}<i>秒</i>
            </div>
          </div>
          <div>
            <div class="title">网站已成立</div>
            <div class="time">
              {{ webRuntime[0] }}<i>天</i> {{ webRuntime[1] }}<i>时</i>
              {{ webRuntime[2] }}<i>分</i> {{ webRuntime[3] }}<i>秒</i>
            </div>
          </div>
        </div>

        <div class="texts">
          <div class="item">
            喜欢本站的话，不妨分享给你身边的同学们，万分感谢！
          </div>
          <div class="item">
            <el-link
              type="primary"
              href="https://beian.miit.gov.cn/"
              target="_black"
            >
              蜀ICP备2020030786号
            </el-link>
            <el-link
              type="primary"
              href="https://beian.mps.gov.cn/#/query/webSearch?code=51018102000743"
              target="_black"
              class="beian"
            >
              <img src="~/assets/img/备案图标.png" alt="备案图标" />
              川公网安备51018102000743
            </el-link>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
<style lang="scss" scoped>
.default-layout {
  position: relative;
  min-height: 100vh;
  /* 页面宽度在最大挡位时的宽度 */
  --center-width: 65%;
  /* 顶栏高度 */
  --header-height: 50px;
  /* 左右栏宽 */
  --lan-width: 130px;

  > header {
    position: fixed;
    z-index: 50;
    width: 100vw;
    background-color: var(--m-background-color);
    border-bottom: var(--m-border);
    box-shadow: var(--m-shadow);
    backdrop-filter: blur(var(--backdrop-filter-blur));

    display: flex;
    justify-content: center;

    > .center {
      width: var(--center-width);
      transition: width 0.3s;

      display: flex;
      justify-content: space-between;
      align-items: center;

      > nav {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        height: var(--header-height);
        min-width: 330px; // 按钮宽58*5 + 间隔10*4 = 330 预计只有5个按钮

        > * {
          margin: 0;
          color: inherit;
        }
      }

      > .left {
        > .logo {
          position: relative;
          font-size: 22px;
          width: var(--lan-width);
          height: var(--header-height);

          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;

          &:hover {
            background: #fff8;
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
        justify-content: flex-end;

        > .mix {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;

          height: var(--header-height);
          width: var(--lan-width);

          // .theme-switch {
          //   --el-switch-on-color: #2c2c2c;
          //   --el-switch-off-color: #f2f2f255;
          //   --color: #333;
          // }
        }
      }
    }
  }

  > .placeholder {
    height: var(--header-height);
    margin-bottom: var(--gap);
  }

  > main {
    display: flex;
    justify-content: center;

    .center {
      width: var(--center-width);
      display: flex;
      gap: var(--gap);
      transition: width 0.3s;

      .middle {
        width: 0;
        order: 2;
        flex: 1;
      }

      .left {
        order: 1;
        width: var(--lan-width);

        // 栏固定
        > div:nth-child(1) {
          position: sticky;
          top: calc(var(--header-height) + var(--gap));
        }
      }

      .right {
        order: 3;
        width: var(--lan-width);
      }

      .left,
      .right {
        display: flex;
        flex-direction: column;
        gap: var(--gap);
        > * {
          border-radius: var(--border-radius);
        }
      }

      @media (max-width: 890px) {
        .left,
        .right {
          display: none;
        }
      }
    }
  }

  > footer {
    position: sticky;
    top: 100vh;
    margin-top: var(--gap);

    background-color: var(--m-background-color);
    border-top: var(--m-border);
    backdrop-filter: blur(var(--backdrop-filter-blur));

    > .center {
      width: var(--center-width);
      transition: width 0.5s;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;

      .statistic {
        display: flex;
        width: 100%;
        justify-content: space-around;

        .title {
          font-weight: 400;
          font-size: 12px;
          color: var(--mini-text-color);
          margin-bottom: 4px;
          margin-top: 10px;
          text-align: center;
        }

        .time {
          font-weight: 400;
          font-size: 20px;
        }

        i {
          font-size: 10px;
          color: var(--mini-text-color);
        }
      }

      .texts {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin: 16px 0;

        .item {
          display: flex;
          justify-content: space-evenly;
          gap: 10px;

          .beian {
            img {
              width: 16px;
              height: 16px;
              margin-right: 4px;
            }
          }
        }
      }
    }
  }

  @media (max-width: 1424px) {
    /* 页面宽度在小挡位时的宽度 */
    --center-width: calc(100vw - var(--gap) * 2);
  }

  // nav330 + 左右栏130*2 + margin10*2
  @media (max-width: 600px) {
    > header {
      // 顶栏换行
      > .center {
        flex-wrap: wrap;
        > nav {
          order: 2;
        }
      }
    }

    > .placeholder {
      height: calc(var(--header-height) * 2);
    }
  }
}
</style>
