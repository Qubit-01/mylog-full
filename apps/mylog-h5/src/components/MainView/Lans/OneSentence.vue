<script setup lang="ts">
import axios from 'axios'

const hitokoto = ref("")
const getHitoketo = async () => {
  const res = await axios.get("https://v2.jinrishici.com/one.json")
  hitokoto.value = res.data.data.content
}

onMounted(getHitoketo)
</script>

<template>
  <div class="one-sentence" @click="getHitoketo()" v-m>
    <div class="title">一言</div>
    <div class="items">{{ hitokoto }}</div>
  </div>
</template>

<style scoped lang="less">
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