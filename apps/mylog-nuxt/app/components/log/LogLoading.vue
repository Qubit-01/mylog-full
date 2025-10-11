<script lang="ts" setup>
defineProps<{ status: 'idle' | 'pending' | 'success' | 'error' }>()
const emits = defineEmits<{ (e: 'retry'): void }>()
</script>

<template>
  <div class="LogLoading _m">
    <div
      v-if="status === 'pending'"
      class="loading"
      v-loading="true"
      element-loading-text="加载中..."
      element-loading-background="transparent"
    />
    <ElResult
      v-else-if="status !== 'success'"
      icon="error"
      title="加载失败"
      sub-title="去检查一下网络"
    >
      <template #extra>
        <ElButton type="primary" @click="emits('retry')">重试</ElButton>
      </template>
    </ElResult>
  </div>
</template>

<style lang="scss" scoped>
.LogLoading {
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
