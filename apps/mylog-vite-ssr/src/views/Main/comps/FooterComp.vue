<script setup lang="ts">
import dayjs from 'dayjs';
import useUserStore from '@/stores/global';
import { ElLink } from 'element-plus';
import beianImg from './assets/备案图标.png?preset=modern';

const User = useUserStore().user;

// 用户注册时间
const userCreatetime = dayjs(User.createtime).valueOf();

const webRuntime = ref([0, 0, 0, 0]);
const serverTime = ref([0, 0, 0, 0]);
const pageRuntime = ref([0, 0, 0, 0]);
// 建站时间
let startTime = dayjs('2021-11-21T22:25:20.000Z').valueOf();
let pageTime = dayjs().valueOf();

let timer = setInterval(() => {
  let lenth,
    d,
    h,
    m,
    time = dayjs().valueOf();
  // 建站运行时间
  lenth = Math.floor((time - startTime) / 1000);
  d = Math.floor(lenth / (60 * 60 * 24));
  lenth %= 60 * 60 * 24;
  h = Math.floor(lenth / (60 * 60));
  lenth %= 60 * 60;
  m = Math.floor(lenth / 60);
  lenth %= 60;
  webRuntime.value = [d, h, m, lenth];
  // 页面运行时间
  lenth = Math.floor((time - pageTime) / 1000);
  m = Math.floor(lenth / 60);
  lenth %= 60;
  pageRuntime.value = [d, h, m, lenth];

  // 服务时间
  lenth = Math.floor((time - userCreatetime) / 1000);
  d = Math.floor(lenth / (60 * 60 * 24));
  lenth %= 60 * 60 * 24;
  h = Math.floor(lenth / (60 * 60));
  lenth %= 60 * 60;
  m = Math.floor(lenth / 60);
  lenth %= 60;
  serverTime.value = [d, h, m, lenth];
}, 1000);

onBeforeUnmount(() => clearInterval(timer));
</script>
<template>
  <footer class="footer-comp">
    <div class="center">
      <div class="statistic">
        <div>
          <div class="title">页面已运行</div>
          <div class="time">
            {{ pageRuntime[2] }}<i>分</i> {{ pageRuntime[3] }}<i>秒</i>
          </div>
        </div>
        <div>
          <!-- <el-tooltip
            content="从您注册时间到现在"
            effect="light"
            placement="top"
          >
            <div class="title">已为你服务</div>
          </el-tooltip> -->
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
            <img :src="beianImg.img.src" alt="备案图标" />
            川公网安备51018102000743
          </el-link>
        </div>
      </div>
    </div>
  </footer>
</template>
<style lang="scss" scoped>
.footer-comp {
  background-color: var(--footer-background-color);

  position: sticky;
  top: 100vh;
  margin-top: var(--gap);

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
</style>
