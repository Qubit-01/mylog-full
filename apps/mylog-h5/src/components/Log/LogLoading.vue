<script setup lang="ts">

</script>

<template>
  <div class="loading" v-m v-loading="true" element-loading-text="正在加载更多Log..." element-loading-background="transparent">
  </div>
</template>

<style scoped lang="less">
.loading {
  padding: var(--padding);
  border-radius: var(--border-radius);
  height: 150px;
  backdrop-filter: blur(4px);
}
</style>