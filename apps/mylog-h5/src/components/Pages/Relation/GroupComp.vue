<script setup lang="ts">
import type { Relation } from '@/types'
import { Check, Delete } from '@element-plus/icons-vue'

const { group, add } = defineProps<{
  group: string
  add: (relation: Relation) => void
}>()
const curTab = ref('new')

const relation = reactive<Relation>({
  id: '',
  userid: '1',
  username: 'Sybit',
  from: Number(group) === 0 ? '' : group,
  name: '',
  info: {
    _other: {},
  },
})
</script>

<template>
  <div class="group-comp" v-m>
    <div class="node" v-if="Number(group) !== 0">{{ group }} 组</div>

    <div class="info">
      <ElTabs v-model="curTab">
        <ElTabPane label="添加人员" name="new">
          <RelationEdit v-model="relation" :add />
        </ElTabPane>
      </ElTabs>
    </div>
  </div>
</template>

<style scoped lang="less">
.group-comp {
  padding: var(--padding);
  border-radius: var(--border-radius);

  display: flex;
  flex-direction: column;
  gap: 4px;

  .info {
    // border: 1px solid red;
    flex: 1;
    width: 100%;

    :deep(.el-tabs__content) {
      height: 200px;
      overflow: auto;
      .el-form-item {
        margin-bottom: 8px;
      }
    }

    .column {
      :deep(.el-form-item__content) {
        // display: flex;
        gap: 8px;
        // align-items: center;
        flex-wrap: nowrap;
      }
    }
  }
}
</style>
