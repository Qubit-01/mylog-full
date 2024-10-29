<script setup lang="ts">
import useGlobalStore from "@/stores/global";
import { SunnyOutline, MoonOutline } from "@vicons/ionicons5";
const global = useGlobalStore();
</script>
<template>
  <n-switch class="theme-switch" v-model:value="global.isDark" size="large">
    <template #unchecked-icon>
      <n-icon :component="SunnyOutline" />
    </template>
    <template #checked-icon>
      <n-icon :component="MoonOutline" />
    </template>
  </n-switch>
</template>
<style lang="scss" scoped></style>
