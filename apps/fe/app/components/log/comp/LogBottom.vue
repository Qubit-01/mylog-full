<!-- 
  抽取Log底部的
  作者，时间，地点等信息

  默认都展示
 -->
<script lang="ts" setup>
import { vEllipsis } from '@mylog-full/mix/utils'

defineProps<{
  log: Log
  /** 是否展示用户名 */
  showUsername?: boolean
}>()
</script>

<template>
  <div class="LogBottom" v-ellipsis>
    <!-- @click="router.push({ name: 'logger', query: { id: log.userid } })" -->
    <span v-if="showUsername && log.user" style="cursor: pointer">
      {{ log.user.name }} ·
    </span>

    <ElTooltip effect="light" placement="top">
      <span>{{ dayjs(log.logtime).format('YYYY-MM-DD HH:mm') }}</span>
      <template #content>
        发送时间：{{ dayjs(log.sendtime).format('YYYY-MM-DD HH:mm') }}<br />
        记录时间：{{ dayjs(log.logtime).format('YYYY-MM-DD HH:mm') }}
      </template>
    </ElTooltip>

    <!-- <div>· {{ log.id }}</div> -->
    <ElTooltip v-if="log.location.length" effect="light" placement="top">
      <span> · {{ log.location[1] }}</span>
      <template #content>{{ log.location[1] }}</template>
    </ElTooltip>
    <!-- <template v-if="log.info.link">
      · <ElLink :href="log.info.link" target="_blank">查看原文</ElLink>
    </template> -->
  </div>
</template>

<style lang="scss" scoped>
.LogBottom {
  gap: 4px;
  font-size: 0.75rem;
  color: var(--color-2);
}
</style>
