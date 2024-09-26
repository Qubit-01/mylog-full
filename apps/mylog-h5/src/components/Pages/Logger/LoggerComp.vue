<script setup lang="ts">
import { getPublics } from '@/api/log'
import useLogStore, { handleLog, type PageStore } from '@/stores/log'
import useUserStore from '@/stores/user'

// 有id说明是带id查询（访客页面），没id就是自己（有设置）
const props = defineProps<{ id?: string }>()

const User = useUserStore()

// 主页
const logger = reactive<PageStore>({
  list: [],
  params: { skip: 0, limit: 20 },
  loading: true,
  noMore: false,
  addLogs: async () => {
    if (logger.noMore) return
    logger.loading = true
    const data = await getPublics({
      userid: props.id || User.id,
      ...logger.params,
    })
    if (data.length < logger.params.limit) logger.noMore = true
    data.forEach(handleLog)
    logger.list.push(...data)
    logger.params.skip += logger.params.limit
    logger.loading = false
  },
})
watch(
  () => props.id,
  () => {
    logger.list = []
    logger.params.skip = 0
    logger.loading = true
    logger.noMore = false
    logger.addLogs!()
  },
  { immediate: true }
)
</script>

<template>
  <div
    class="logger-comp"
    v-infinite-scroll="logger.addLogs!"
    :infinite-scroll-disabled="logger.loading"
  >
    <Log v-for="log in logger.list" :log="log" />

    <div
      v-if="!logger.list.length && !logger.loading"
      v-m
      style="padding: var(--padding); border-radius: var(--border-radius)"
    >
      没有公开的数据哦，快去发一个吧~
    </div>

    <LogLoading v-if="logger.loading" />
  </div>
</template>

<style scoped lang="less">
.logger-comp {
  display: flex;
  flex-direction: column;
  gap: var(--gap);
}
</style>
