<script lang="ts" setup>
definePageMeta({ middleware: 'auth' })
useHead({ title: '记录' })
const tab = ref('mylog')
// const tab = computed<string>({
//   get: () => route.name as string,
//   set: (v) => router.push({ name: v }),
// })
</script>

<template>
  <div class="MylogPage">
    <!-- <ElRadioGroup v-model="tab">
      <ElRadioButton label="时间线" value="mylog" />
      <ElRadioButton label="日历" value="calendar" />
    </ElRadioGroup> -->

    <NuxtPage />
  </div>
</template>

<style lang="scss" scoped>
.MylogPage {
  display: flex;
  flex-direction: column;
  gap: var(--gap);
}
</style>
