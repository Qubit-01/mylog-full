<script lang="ts" setup>
defineProps<{
  status: 'idle' | 'pending' | 'success' | 'error'
}>()
</script>

<template>
  <div class="log-loading _m">
    <div
      v-if="status === 'pending'"
      class="loading"
      v-loading="true"
      element-loading-text="加载中..."
      element-loading-background="transparent"
    />
    <el-result
      v-else-if="status !== 'success'"
      icon="error"
      title="加载失败"
      sub-title="去检查一下网络"
    >
      <!-- <template #extra>
        <el-button type="primary">重试</el-button>
      </template> -->
    </el-result>
  </div>
</template>

<style lang="scss" scoped>
.log-loading {
  border-radius: var(--border-radius);
  overflow: hidden;

  > .loading {
    height: 100px;

    :deep(.el-loading-mask) {
      margin-top: -20px;
    }
  }
}
</style>
