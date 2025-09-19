<script lang="ts" setup>
const { user } = refsGlobalStore()

// 只能在水合后执行
onMounted(() => {
  // 自动保存 user 设置
  watchDebounced(
    user,
    (u) => {
      $fetch<string>('/user/set_user', {
        ...FetchOptsDefault,
        body: { img: u.img, info: u.info, setting: u.setting },
      })
    },
    { debounce: 2000, deep: true },
  )
})
</script>

<template>
  <div class="app">
    <NuxtLayout>
      <NuxtPage />
      <!-- <NuxtWelcome /> -->
    </NuxtLayout>
    <el-backtop :right="20" :bottom="20" />
    <DevOnly>
      <div class="env">DEV</div>
    </DevOnly>
  </div>
</template>

<style lang="scss" scoped>
.app {
  min-width: 300px;
  max-width: 100vw;
  max-height: 100vh;
  overflow: auto;
  .env {
    position: fixed;
    top: 4px;
    left: 4px;
    z-index: 999;
    height: 12px;

    line-height: 12px;
    font-size: 8px;
    padding: 0 4px;
    border-radius: 10px;
    background: #f55a;
    pointer-events: none;
  }
}
</style>
