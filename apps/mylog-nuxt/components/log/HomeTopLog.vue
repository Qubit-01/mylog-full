<!-- 主页的置顶模块 -->
<script lang="ts" setup></script>

<template>
  <div class="top-log _m">
    <el-carousel height="270px" class="carousel">
      <el-carousel-item>
        <img :src="BucketCDN + 'web-files/img/carousel-0.jpg'" />
      </el-carousel-item>
      <el-carousel-item>
        <img :src="BucketCDN + 'web-files/img/carousel-1.jpg'" />
      </el-carousel-item>
      <el-carousel-item>
        <img :src="BucketCDN + 'web-files/img/carousel-2.jpg'" />
      </el-carousel-item>
      <el-carousel-item>
        <img :src="BucketCDN + 'web-files/img/bg-light.jpg'" />
      </el-carousel-item>
      <div class="title">✨宇宙很大，生活更大</div>
    </el-carousel>
    <div class="text">
      <div>
        2021年只有两种人在写博客：一种是试图建立受众并从中获利的人，另一种是只想写出想法而没有任何目的的人。
        这两种人的行为都非常好。选择做你喜欢的事，坚持下去，最终都可以对他人产生价值。——
        <a href="https://bhupesh.me//what-i-have-learned-from-blogging-so-far-retrospect/" target="_blank">
          《我从博客中学到的东西》
        </a>
      </div>
      <div>
        朋友们帮我点个免费的Star吧，感谢：
        <a href="https://gitee.com/bit-01/mylog-full" target="_black">
          gitee.com/bit-01/mylog-full
        </a>
      </div>
      <div>
        如果想快速体验本网站功能，可以点击
        <a href="#" @click.prevent="loginTest">登录测试账号</a>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.top-log {
  overflow: hidden;
  border-radius: var(--border-radius);

  .carousel {
    position: relative;

    .title {
      position: absolute;
      left: 24px;
      bottom: 24px;

      border-radius: var(--border-radius);
      padding: 12px;
      background-color: var(--m-background-color);
      backdrop-filter: blur(16px);

      font-size: 1.5em;
      font-weight: bold;
    }

    img {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  }

  .text {
    display: flex;
    flex-direction: column;
    padding: var(--padding);
  }
}
</style>
