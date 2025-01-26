<script lang="ts" setup>
import { vImgSrc } from '@mylog-full/mix/utils'
const { user, isLogined } = refsGlobalStore()
</script>

<template>
  <div class="user-aside _m">
    <div class="img">
      <img
        v-img-src="
          user.img ||
          'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
        "
      />
    </div>
    <template v-if="isLogined">
      <div class="title" @click="navigateTo('/logger')">
        {{ user.name }}
      </div>
      <div class="items">
        <ElButton type="primary" text @click="navigateTo('/mylog')">
          发个Log
        </ElButton>
      </div>
    </template>
    <div class="items" v-else>
      <ElButton type="primary" @click="navigateTo('/login')">登录</ElButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user-aside {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-radius: var(--border-radius);

  z-index: 2;

  .img {
    margin-top: 8px;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .title {
    font-size: 1.5rem;
    cursor: pointer;

    &:hover {
      color: var(--color-2);
    }
  }

  .items {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
}
</style>
