<!-- 公告栏 -->
<script setup lang="ts">
// import useGlobalStore from '@/stores/global'
import { ref } from 'vue';

// const Global = useGlobalStore()
const showBeg = ref(false)
</script>
<template>
  <div class="note-lan" v-m>
    <div class="title">公告</div>
    <div class="items">
      <ElButton text @click="showBeg = true">联系&资助</ElButton>
      <a href="https://gitee.com/bit-01/mylog2" target="_black">
        <!-- <img
          :src="`https://gitee.com/bit-01/mylog2/badge/star.svg?theme=${
            Global.isDark ? 'dark' : 'white'
          }`"
          alt="star"
        /> -->
      </a>
      <!-- <div><span @click="router.push('/about')">关于本站</span></div> -->
      <!-- <div>
        <span @click="router.push('/user?name=Sybit')">更新公告</span>
      </div> -->
    </div>
  </div>

  <TeleportBody v-if="showBeg" @close="showBeg = false">
    <div class="beg-window">
      <BegPage />
    </div>
  </TeleportBody>
</template>

<style scoped lang="less">
.note-lan {
  border-radius: var(--border-radius);
  padding: var(--border-radius);

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  .title {
    font-weight: bolder;
  }

  .items {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .beg-window {
    overflow: hidden;
    border-radius: var(--border-radius);
  }
}
</style>
