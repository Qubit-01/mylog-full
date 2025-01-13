<!-- 公告栏 -->
<script setup lang="ts">
import Popup from '~/components/utils/Popup.vue'

// import useGlobalStore from '@/stores/global'
const Global = undefined // useGlobalStore() // todo
const showBeg = ref(false)
</script>
<template>
  <div class="note-lan _m">
    <div class="title">公告</div>
    <div class="items">
      <el-button text @click="showBeg = true">联系&资助</el-button>
      <el-button text @click="$router.push('/about')">关于本站</el-button>
      <el-button text @click="$router.push('/user?name=Sybit')">更新公告</el-button>
      <a href="https://gitee.com/bit-01/mylog2" target="_black">
        <img
          :src="`https://gitee.com/bit-01/mylog2/badge/star.svg?theme=${
            Global?.isDark ? 'dark' : 'white'
          }`"
          alt="star"
        />
      </a>
    </div>
  </div>

  <Popup v-if="showBeg" @close="showBeg = false">
    <div class="beg-window">
      <BegPage />
    </div>
  </Popup>
</template>

<style scoped lang="scss">
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
    > * {
      margin: 0;
    }
  }

  .beg-window {
    overflow: hidden;
    border-radius: var(--border-radius);
  }
}
</style>
