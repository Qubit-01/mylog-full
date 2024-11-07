<!-- 
    切换显示和编辑状态的输入框
 -->
<script setup lang="ts">
const value = defineModel<string | undefined>({ required: true })
const { lazy } = defineProps<{ lazy?: boolean }>()
const inputValue = ref<string>(value.value || '')

const isEdit = ref(false)
const InputDom = ref<HTMLInputElement>()

const showEdit = () => {
  isEdit.value = true
  nextTick(() => {
    InputDom.value?.focus()
  })
}

const hideEdit = () => {
  value.value = inputValue.value
  isEdit.value = false
}

if (!lazy) watch(inputValue, v => (value.value = v))
</script>

<template>
  <span class="isShow" v-if="!isEdit" @click="showEdit">{{ value }}</span>
  <ElInput
    v-else
    ref="InputDom"
    v-model="inputValue"
    @blur="hideEdit"
    @keyup.enter="hideEdit"
  />
</template>

<style scoped lang="less">
.isShow {
  cursor: pointer;
  display: inline-block;
  min-width: 100px;
  height: 100%;
  // user-select: none;
  // overflow: hidden;
  // text-overflow: ellipsis;
  // white-space: nowrap;
}
</style>
