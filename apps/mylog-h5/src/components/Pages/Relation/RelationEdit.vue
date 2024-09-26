<!-- 
    人员编辑组件
    如果是新增人员，传入add方法
 -->
<script setup lang="ts">
import type { Relation } from '@/types'
import { Check, Delete } from '@element-plus/icons-vue'

const relation = defineModel<Relation>({ required: true })
const { add } = defineProps<{
  add?: (relation: Relation) => void
}>()

const infoOther = reactive({
  key: '',
  value: '',
})
const addInfoOther = () => {
  if (infoOther.key && infoOther.value) {
    relation.value.info._other[infoOther.key] = infoOther.value
    infoOther.key = ''
    infoOther.value = ''
  }
}
</script>

<template>
  <!-- {{ relation }} -->
  <ElForm label-width="auto" @submit.native.prevent>
    <ElFormItem label="姓名">
      <ElInput v-model="relation.name" />
    </ElFormItem>
    <ElFormItem label="所属节点/组">
      <ElInput v-model="relation.from" />
    </ElFormItem>
    <ElFormItem label="和所属关系">
      <ElInput v-model="relation.info.label" />
    </ElFormItem>
    <ElFormItem label="电话号码">
      <ElInput v-model="relation.info.phone" />
    </ElFormItem>

    <ElFormItem label="更多信息项" />
    <ElFormItem
      v-for="(value, key) in relation.info._other"
      :label="key"
      :key="key"
      class="column"
    >
      <InputSwitch v-model="relation.info._other[key]" />
      <ElButton
        type="danger"
        :icon="Delete"
        text
        circle
        @click="delete relation.info._other[key]"
      />
    </ElFormItem>
    <ElFormItem class="column">
      <template #label>
        <ElInput
          v-model="infoOther.key"
          placeholder="项名称"
          style="width: 80px"
        />
      </template>
      <ElInput
        v-model="infoOther.value"
        placeholder="内容"
        @keyup.enter="addInfoOther"
      />
      <ElButton
        type="success"
        :icon="Check"
        text
        circle
        @click="addInfoOther"
      />
    </ElFormItem>
    <ElFormItem v-if="add">
      <ElButton type="primary" @click="add!(relation)">保存</ElButton>
    </ElFormItem>
  </ElForm>
</template>

<style scoped lang="less"></style>
