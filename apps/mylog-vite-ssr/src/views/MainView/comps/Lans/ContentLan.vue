<!-- 目录栏 -->
<script setup lang="ts">
import useGlobalStore from '@/stores/global'

const Content = useGlobalStore().content
</script>

<template>
  <div v-if="Content.list.length" class="content-lan" v-m>
    <div class="title">目录</div>
    <div class="items">
      <!--  @click.stop="goAnchor(v.anchor)" -->
      <ElButton text v-for="(v, i) in Content.list" :key="i">
        {{ v.label }}
      </ElButton>
    </div>
  </div>
</template>

<style scoped lang="less">
.content-lan {
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

    :deep(.el-button) {
      justify-content: flex-start;
      margin: 0;
      border: 1px solid red;
      width: 100%;
      padding: 2px 4px;
    }
  }
}
</style>
