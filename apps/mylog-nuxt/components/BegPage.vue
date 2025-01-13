<script setup lang="ts"></script>

<template>
  <div class="beg-page">
    <div class="quote">
      <div>
        <div class="box box1">
          <img
            src="https://cos.mylog.cool/web-files/contact&pay/pay-wechat.png"
          />

          <el-tooltip>
            <template #content>
              <img
                style="height: 150px"
                src="https://cos.mylog.cool/web-files/contact&pay/contact-wechat.png"
              />
            </template>
            <span>微信号：QQ_0xAE8A9951</span>
          </el-tooltip>

          <h2>微信</h2>
        </div>
        <div class="bg"></div>
      </div>

      <div>
        <div class="box box3">
          <img src="https://cos.mylog.cool/web-files/contact&pay/pay-qq.png" />
          <el-tooltip>
            <template #content>
              <img
                style="height: 150px"
                src="https://cos.mylog.cool/web-files/contact&pay/contact-qq.jpg"
              />
            </template>
            <span>QQ号：2928318801</span>
          </el-tooltip>

          <h2>QQ钱包</h2>
        </div>
        <div class="bg"></div>
      </div>

      <div>
        <div class="box box2">
          <img src="https://cos.mylog.cool/web-files/contact&pay/pay-ali.jpg" />
          <span>昵称：Qubit</span>
          <h2>支付宝</h2>
        </div>
        <div class="bg"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.beg-page {
  position: relative;
  background: linear-gradient(#000046, #1cb5e0);
  font-size: 15px;
  width: 720px;
  height: 100%;

  * {
    color: black;
    transition: 0.5s !important;
  }

  .quote {
    // border: 1px solid red;
    height: 340px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;

    > div {
      display: inline-block;
    }

    .box {
      position: relative;
      width: 200px;
      height: 280px;
      background: #fff;
      overflow: hidden;

      z-index: 2;
      box-sizing: border-box;
      padding: 30px;
      box-shadow: -5px 15px 10px rgba(0, 0, 0, 0.2);
      // margin: 10px;

      h2 {
        position: absolute;
        bottom: 20px;
        right: 30px;
        font-size: 18px;
      }

      &:hover {
        box-shadow: -10px 30px 40px rgba(0, 0, 0, 0.5);

        span {
          color: #fff;
        }

        h2 {
          color: #fff;
        }
      }

      img {
        height: 140px;
        margin-bottom: 5px;
      }

      /* 加栏目中线，分割阴影 */
      &:before {
        content: '';
        position: absolute;
        top: 0;
        left: -50%;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.2);
        pointer-events: none;
      }
    }

    .box1:hover ~ .bg,
    .box1:hover {
      opacity: 1;
      background: linear-gradient(#03a9f4, #e91e63);
    }

    .box2:hover ~ .bg,
    .box2:hover {
      opacity: 1;
      background: linear-gradient(#ffc107, #19fd36);
    }

    .box3:hover ~ .bg,
    .box3:hover {
      opacity: 1;
      background: linear-gradient(#ffc107, #e91e63);
    }

    .bg {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      opacity: 0;
      transition: 0.5s;
      pointer-events: none;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
