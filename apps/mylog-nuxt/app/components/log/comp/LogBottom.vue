<!-- 
  抽取Log底部的
  作者，时间，地点等信息

  默认都展示
 -->

<script lang="ts" setup>
import dayjs from 'dayjs'
// const router = useRouter()
const log = inject<Log>('log')!
// const { noUsername } = defineProps<{
//   noUsername?: boolean
// }>()
</script>

<template>
  <!-- v-ellipsis -->
  <div class="log-bottom">
    <!-- <div
      v-if="!noUsername"
      @click="router.push({ name: 'logger', query: { id: log.userid } })"
      style="cursor: pointer"
    >
      {{ log.username }} ·
    </div> -->

    <el-tooltip effect="light" placement="top">
      <div>{{ dayjs(log.logtime).format('YYYY-MM-DD HH:mm') }}</div>
      <template #content>
        发送时间：{{ dayjs(log.sendtime).format('YYYY-MM-DD HH:mm') }}<br />
        记录时间：{{ dayjs(log.logtime).format('YYYY-MM-DD HH:mm') }}
      </template>
    </el-tooltip>
    <!-- <template v-if="log.location.length">
      ·
      <div>{{ log.location[1] }}</div>
    </template> -->
    ·
    <div>{{ log.id }}</div>
    <!-- <template v-if="log.info.link">
      · <ElLink :href="log.info.link" target="_blank">查看原文</ElLink>
    </template> -->
  </div>
</template>

<style lang="scss" scoped>
.log-bottom {
  display: flex;
  gap: 4px;
  font-size: 0.8rem;
  color: var(--color-2);
}
</style>
