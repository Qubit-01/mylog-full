<!-- 
  抽取Log底部的
  作者，时间，地点等信息

  默认都展示
 -->

<script setup lang="ts">
import { vOverflowEllipsis } from '@/utils/directives'
import type { Log } from '@/types'

const router = useRouter()
const log = inject<Log>('log')!
const { noUsername } = defineProps<{
  noUsername?: boolean
}>()
</script>

<template>
  <div class="log-bottom" v-overflow-ellipsis>
    <div
      v-if="!noUsername"
      @click="router.push({ name: 'logger', query: { id: log.userid } })"
      style="cursor: pointer"
    >
      {{ log.username }} ·
    </div>

    <ElTooltip effect="light" placement="top">
      <div>{{ log.logtime.format('YYYY-MM-DD HH:mm') }}</div>
      <template #content>
        发送时间：{{ log.sendtime!.format('YYYY-MM-DD HH:mm') }}<br />
        记录时间：{{ log.logtime.format('YYYY-MM-DD HH:mm') }}
      </template>
    </ElTooltip>
    <template v-if="log.location.length">
      ·
      <div>{{ log.location[1] }}</div>
    </template>
    ·
    <div>{{ log.id }}</div>
    <template v-if="log.info.link">
      · <ElLink :href="log.info.link" target="_blank">查看原文</ElLink>
    </template>
  </div>
</template>

<style scoped lang="less">
.log-bottom {
  display: flex;
  gap: 4px;
  font-size: 0.8rem;
  color: var(--color-2);
}
</style>
