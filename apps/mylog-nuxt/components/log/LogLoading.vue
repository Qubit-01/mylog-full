<script lang="ts" setup></script>

<template>
  <div
    class="log-loading _m"
    v-loading="true"
    element-loading-text="加载中..."
    element-loading-background="transparent"
  />
</template>

<style lang="scss" scoped>
.log-loading {
  border-radius: var(--border-radius);
  height: 100px;
  overflow: hidden;
  :deep(.el-loading-mask) {
    margin-top: -20px;
  }
}
</style>
