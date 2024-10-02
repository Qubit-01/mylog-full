<script setup lang="ts">
import trpc from "@/api";
import { Log } from "@mylog-full/mylog-trpc-prisma";

const logs = ref();

onMounted(async () => {
  console.log("🐔客户端上发请求");
  logs.value = await trpc.log.getPublics.query({
    skip: 100,
    limit: 20,
  });
});

onServerPrefetch(async () => {
  console.log("🐔服务器上发请求");

  // logs.value = await trpc.log.getPublics.query({
  //   skip: 0,
  //   limit: 20,
  // })

  // logs.value = await trpc.log.getPublics.query({
  //   // userid: 1,
  //   skip: 0,
  //   limit: 20,
  // });

  // console.log("🐔", logs.value);
});

onMounted(async () => {
  console.log("🐔", logs.value);
  // if (!logs.value) {
  //   logs.value = await trpc.log.getPublics.query({
  //     // userid: 1,
  //     skip: 0,
  //     limit: 20,
  //   });
  // }
});

// trpc.log.getPublics.query({ skip: 0, limit: 20 });
</script>
<template>
  <div class="home-page">
    <div v-for="l of logs" class="log">{{ l.content }}</div>
  </div>
</template>
<style lang="scss" scoped>
.log {
  margin-bottom: 10px;
  border: 4px solid red;
}
</style>
