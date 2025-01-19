<script setup lang="ts">
const { data, refresh } = useFetch<any>('https://v2.jinrishici.com/one.json')
</script>

<template>
  <div class="one-sentence _m" @click="refresh()">
    <div class="title">一言</div>
    <div class="items">{{ data.data?.content }}</div>
  </div>
</template>

<style scoped lang="scss">
.one-sentence {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: var(--border-radius);
  padding: var(--border-radius);
  font-size: 14px;

  .title {
    font-weight: bolder;
    margin-bottom: 8px;
  }
}
</style>
