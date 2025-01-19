<script setup lang="ts">
console.log('🐤app.vue')

// app阶段就初始化一些东西
useGlobalStore()
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
    <!-- <NuxtWelcome /> -->
    <!-- <NuxtRouteAnnouncer /> -->
  </NuxtLayout>
</template>
