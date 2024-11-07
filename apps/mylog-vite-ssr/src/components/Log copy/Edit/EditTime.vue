<!--
  传入dayjs，但是编辑要编辑date类型
  不能为null（el组件删除会返回null）
 -->
<script setup lang="ts">
import dayjs from 'dayjs'
const time = defineModel<dayjs.Dayjs>({ required: true })

const editTime = computed({
  get: () => time.value.toDate(),
  set: v => (time.value = dayjs(v)),
})
</script>

<template>
  <ElDatePicker
    v-model="editTime"
    type="datetime"
    :clearable="false"
    :editable="false"
    placeholder="记录时间"
    format="YYYY-MM-DD HH:mm"
  />
</template>

<style scoped lang="less"></style>
