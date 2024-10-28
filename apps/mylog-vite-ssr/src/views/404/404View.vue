<script setup lang="ts">
console.log("👁️[NotFoundView.vue] start loading");
</script>

<template>
  <div class="not-found-view">
    <n-result
      status="404"
      title="404 资源不存在"
      description="左上角，出门左转"
    >
      <template #footer>
        <n-button @click="$router.push('/')">回到首页</n-button>
      </template>
    </n-result>
  </div>
</template>

<style scoped lang="scss">
.not-found-view {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center
}
</style>
