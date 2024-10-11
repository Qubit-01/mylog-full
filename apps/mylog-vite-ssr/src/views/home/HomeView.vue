<script setup lang="ts">
import trpc from "@/api";
import useLogStore from "@/stores/log";

const home = useLogStore().home;

const test = () => {
  console.log("🐔", home);
};
</script>

<template>
  <div class="home-page" data-allow-mismatch="children">
    <div @click="test">123</div>
    <!-- <div v-for="l of home.list" class="log">{{ l.content }}</div> -->
  </div>
</template>
<style lang="scss" scoped>
.log {
  margin-bottom: 10px;
  border: 1px solid red;
}
</style>
