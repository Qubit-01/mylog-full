<script lang="ts" setup>
// definePageMeta({ middleware: 'auth' })
const tab = ref('mylog')
// const tab = computed<string>({
//   get: () => route.name as string,
//   set: (v) => router.push({ name: v }),
// })
</script>

<template>
  <div class="mylog-page">
    <!-- <el-radio-group v-model="tab">
      <el-radio-button label="时间线" value="mylog" />
      <el-radio-button label="日历" value="calendar" />
    </el-radio-group> -->

    <NuxtPage />
  </div>
</template>

<style lang="scss" scoped>
.mylog-page {
  display: flex;
  flex-direction: column;
  gap: var(--gap);
}
</style>
