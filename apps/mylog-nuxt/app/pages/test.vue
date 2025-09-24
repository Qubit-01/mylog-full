<script lang="ts" setup>
definePageMeta({ layout: false })

const { params } = refsTestStore()

const a = ref(0)

watch(a, () => {
  params.value.skip++
})
</script>

<template>
  <div class="TestPage _m">
    <ElButton @click="a++">test</ElButton>
  </div>
</template>

<style lang="scss" scoped>
.TestPage {
}
</style>
