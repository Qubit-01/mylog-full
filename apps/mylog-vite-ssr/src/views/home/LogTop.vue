<script setup lang="ts">
import bgImg from '@/assets/bg-light-raw.jpg?h=240'
</script>

<template>
  <n-carousel autoplay>
    <img
      class="carousel-img"
      :src="bgImg"
    />
    <img
      class="carousel-img"
      src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg"
    />
    <img
      class="carousel-img"
      src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg"
    />
    <img
      class="carousel-img"
      src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg"
    />
  </n-carousel>
</template>

<style scoped lang="scss">
.carousel-img {
  width: 100%;
  height: 240px;
  object-fit: cover;
}
</style>
