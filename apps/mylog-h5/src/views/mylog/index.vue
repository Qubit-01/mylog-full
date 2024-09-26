<script setup lang="ts">
import { getUser } from '@/stores/global'
import useLogStore from '@/stores/log'

const router = useRouter()
const route = useRoute()
const Log = useLogStore()
getUser.then(user => {
  Log.mylog.getLogs()
  Log.tags.getLogs()
}, null) // 进入页面再获取数据

const tab = computed<string>({
  get: () => route.name as string,
  set: v => router.push({ name: v }),
})
</script>

<template>
  <div class="mylog-page">
    <ElRadioGroup v-model="tab">
      <!-- size="large" -->
      <ElRadioButton label="时间线" value="mylog" />
      <ElRadioButton label="待办" value="todo" />
      <ElRadioButton label="日历" value="calendar" />
    </ElRadioGroup>

    <RouterView />
  </div>
</template>

<style scoped lang="less">
.mylog-page {
  display: flex;
  flex-direction: column;
  gap: var(--gap);
  // background-color: var(--m-background-color);
}
</style>
