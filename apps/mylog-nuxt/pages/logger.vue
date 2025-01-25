<script lang="ts" setup>
const { user } = useGlobalStore()

</script>

<template>
  <div class="logger-page">
    用户页
    <div class="_m">
      {{ user }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.logger-page {}
</style>