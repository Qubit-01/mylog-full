<!--
  加载页面必须做的事情
-->
<script setup lang="ts">
import useGlobalStore from '@/stores/global'
const Global = useGlobalStore()
</script>

<template>
  <RouterView />
</template>

<style scoped>
</style>
