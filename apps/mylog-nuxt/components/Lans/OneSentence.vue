<script setup lang="ts">
const hitokoto = ref("")
const getHitoketo = async () => {
  const res = await fetch("https://v2.jinrishici.com/one.json")
  const data = await res.json()
  hitokoto.value = data.data.content
}
onMounted(getHitoketo)
</script>

<template>
  <div class="one-sentence _m" @click="getHitoketo()">
    <div class="title">一言</div>
    <div class="items">{{ hitokoto }}</div>
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