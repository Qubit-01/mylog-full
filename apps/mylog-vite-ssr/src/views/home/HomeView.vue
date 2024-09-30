<script setup lang="ts">
import trpc from "@/api";
import { log } from "@mylog-full/mylog-trpc-prisma";

const logs = ref<log[]>();

onServerPrefetch(async () => {
  logs.value = await trpc.log.getPublics.query({
    // userid: 1,
    skip: 0,
    limit: 20,
  });

  // console.log("🐔", logs.value);
});

onMounted(async () => {
  console.log('🐔', logs.value);
  if (!logs.value) {
    logs.value = await trpc.log.getPublics.query({
      // userid: 1,
      skip: 0,
      limit: 20,
    });
  }
});

// trpc.log.getPublics.query({ skip: 0, limit: 20 });
</script>
<template>
  <div class="home-page">
    <div v-for="l of logs" class="log">123{{ l.content }}</div>
  </div>
</template>
<style lang="scss" scoped>
.log {
  margin-bottom: 10px;
  border: 4px solid red;
}
</style>
