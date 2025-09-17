<script lang="ts" setup>
const time = defineModel<number>({ required: true })
const editTime = computed({
  get: () => new Date(time.value),
  set: (v) => (time.value = +v),
})
</script>
<!--
  传入dayjs，但是编辑要编辑date类型
  不能为null（el组件删除会返回null）
 -->
<template>
  <ElDatePicker
    class="EditTime"
    v-model="editTime"
    type="datetime"
    :clearable="false"
    :editable="false"
    placeholder="记录时间"
    format="YYYY-MM-DD HH:mm"
  />
</template>

<style lang="scss" scoped>
.EditTime {
}
</style>
