<script setup lang="ts">
import { getMylogs } from '@/api/log'
import { handleLog, type AllStore, type PageStore } from '@/stores/log'
import type { Log } from '@/types'

const route = useRoute()

// 日历Tags，不分页直接获取全部
const share: AllStore & PageStore = reactive({
  list: computed<Log[]>(() => share.listAll.slice(0, share.params.skip)),
  params: { skip: 0, limit: 20 },
  listAll: [],
  loading: true,
  noMore: false,
  getLogs: async () => {
    share.loading = true
    const data = await getMylogs({ share: route.query.share as string })
    data.forEach(handleLog)
    share.listAll = data
    share.addLogs()
    share.loading = false
  },
  addLogs: async () => {
    share.params.skip += share.params.limit
  },
})

/**
 * LDO207Hey4cK64NInAgNwwt5Eoe3BYVR/shdDnxACEkJVQXv2rRNj38OZDmVhvSssbrjXKSHMeApoDDkOZN2jG3TiaLlWlL+iNMRZiZ53drlMZIkFt2Womx+peXL5OBvPtyhddU5aEaE93lnXdo7gLLchu+GlC7qdOeh6/2H0KAWEci3Y/avN9BhUA7ecKrUfimHauCW923bhNLPLCtURw==
 * LDO207Hey4cK64NInAgNwwt5Eoe3BYVR/shdDnxACEkJVQXv2rRNj38OZDmVhvSssbrjXKSHMeApoDDkOZN2jG3TiaLlWlL iNMRZiZ53drlMZIkFt2Womx peXL5OBvPtyhddU5aEaE93lnXdo7gLLchu GlC7qdOeh6/2H0KAWEci3Y/avN9BhUA7ecKrUfimHauCW923bhNLPLCtURw==
 */

share.getLogs()
</script>

<template>
  <div
    class="share-page"
    v-infinite-scroll="share.addLogs!"
    :infinite-scroll-disabled="share.loading"
  >
    <Log v-for="log in share.list" :log="log" />

    <LogLoading v-if="share.loading" />
  </div>
</template>

<style scoped lang="less">
.share-page {
  display: flex;
  flex-direction: column;
  gap: var(--gap);
}
</style>
