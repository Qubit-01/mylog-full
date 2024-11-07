<!-- 
  MyLog和普通log有很多不同，但很多功能也要同步加入
 -->
<script setup lang="ts">
import type { Log } from '@/types'
import { delLog, editLog } from '@/stores/log'
import { Delete, Edit, Share, Promotion } from '@element-plus/icons-vue'
import { vDblclick } from '@/utils/directives'

const { log } = defineProps<{ log: Log }>()
provide('log', log)

// 双击log，展开和收起
const isExpand = ref(false)
provide('isExpand', isExpand)
const expand = () => {
  isExpand.value = !isExpand.value
}

// 点击编辑按钮
const isEdit = ref(false)

// 点击公开按钮
const toggleType = (log: Log) => {
  editLog({
    id: log.id!,
    type: log.type === 'public' ? 'log' : 'public',
  }).then(count => {
    console.log('修改了', count, '条记录')
  })
}
</script>

<template>
  <div class="log-mylog" v-m :id="'log' + log.id" v-dblclick="expand">
    <LogContent />

    <LogMedias />

    <LogTags />

    <LogBottom v-if="isExpand" noUsername />

    <!-- 编辑模块 -->
    <LogEdit v-if="isEdit" @onSuccess="isEdit = false" />

    <ElButtonGroup class="buttons">
      <ElButton :icon="Promotion" @click.stop="toggleType(log)" />
      <ElButton :icon="Edit" @click.stop="isEdit = !isEdit" />
      <ElButton :icon="Share" />
      <ElButton :icon="Delete" @click.stop="delLog(log)" />
    </ElButtonGroup>

    <!-- <div>log: {{ log }}</div> -->
  </div>
</template>

<style scoped lang="less">
.log-mylog {
  border-radius: var(--border-radius);
  padding: var(--padding);

  display: flex;
  flex-direction: column;
  gap: 6px;

  // 空div应该不占用gap
  > div:empty {
    display: none;
  }

  .buttons {
    display: none;
    position: absolute;
    top: -26px;
    right: var(--padding);
  }

  &:hover .buttons {
    display: block;
  }
}
</style>
