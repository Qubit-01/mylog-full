<!-- 
  主页的置顶模块
 -->
<script setup lang="ts">
import { BucketCDN } from '@/stores/constant'
import { loginTest } from '@/stores/user'
</script>

<template>
  <div class="top-log" v-m>
    <ElCarousel height="270px" class="carousel">
      <ElCarouselItem>
        <img :src="BucketCDN + 'web-files/carousel-0.jpg'" />
      </ElCarouselItem>
      <ElCarouselItem>
        <img :src="BucketCDN + 'web-files/carousel-1.jpg'" />
      </ElCarouselItem>
      <ElCarouselItem>
        <img :src="BucketCDN + 'web-files/carousel-2.jpg'" />
      </ElCarouselItem>
      <ElCarouselItem>
        <img :src="BucketCDN + 'web-files/bg-light.jpg'" />
      </ElCarouselItem>
      <div class="title">✨多元记2.0 全新亮相 ~</div>
    </ElCarousel>
    <div class="text">
      <div>
        本站正式进入2.0，使用 Vue 3.4 + Vite + Element Plus + TypeScript + Pinia
        等技术栈，全新设计，全新体验，全新的未来。
      </div>
      <div>
        原名川农资讯网，现更名为多元记Mylog，旨在记录多元的生活，多元的知识，多元的感悟，多元的未来。
      </div>
      <div>
        朋友们帮我点个免费的Star吧，感谢：
        <a href="https://gitee.com/bit-01/mylog2" target="_black">
          gitee.com/bit-01/mylog2
        </a>
      </div>
      <div>
        如果你想快速体验本网站功能，可以点击
        <a href="" @click="loginTest">登录测试账号</a>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
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
