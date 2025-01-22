<script setup lang="ts">
// app阶段就初始化一些东西
const { user } = useGlobalStore()
const { data } = await useFetch('https://mylog.cool:3000/user/get_user', {
  method: 'POST',
  headers: useRequestHeaders(['cookie']),
})
Object.assign(user, data.value)
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
    <!-- <NuxtWelcome /> -->
    <!-- <NuxtRouteAnnouncer /> -->
  </NuxtLayout>
</template>
