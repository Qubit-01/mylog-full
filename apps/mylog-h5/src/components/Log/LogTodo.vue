<!-- 
	代办Todo的单独组件
	日历的标签不用实现，直接用tag
 -->

<script setup lang="ts">
import type { Log } from '@/types'
import { ArrowUpBold, ArrowDownBold } from '@element-plus/icons-vue'
import { vOverflowEllipsis, vDblclick } from '@/utils/directives'
import { editLog } from '@/stores/log'

const { log } = defineProps<{ log: Log }>()
provide('log', log) // 暴露给子组件

// 双击log，展开和收起
const isExpand = ref(false)
provide('isExpand', isExpand)
const expand = () => {
  isExpand.value = !isExpand.value
}

const complete = (log: Log) => {
  console.log('完成了', log)
}

watch(
  () => log.info.todo!.complete,
  () => {
    editLog({
      id: log.id!,
      info: log.info,
    }).then(count => {
      console.log('修改了', count, '条记录')
    })
  }
)

// 点击公开按钮
const toggleType = (log: boolean) => {}
</script>

<template>
  <div class="log-todo" v-m v-dblclick="expand">
    <ElCheckbox v-model="log.info.todo!.complete" style="height: 15px" />

    <!-- 两种状态
      1. 已完成: 默认只展示content，双击展示全部
      2. 未完成: 默认普通展示（mylog），双击展示全部
    -->
    <div v-if="log.info.todo?.complete && !isExpand" class="completed">
      {{ log.content }}
    </div>
    <!-- 未完成 -->
    <div v-else class="log">
      <LogContent />
      <LogMedias />
      <LogTags noTodo />
      <LogBottom v-if="isExpand" noUsername />
    </div>

    <ElButtonGroup class="buttons">
      <ElButton :icon="ArrowUpBold" /><!-- 增加优先级 -->
      <ElButton :icon="ArrowDownBold" /><!-- 降低优先级 -->
    </ElButtonGroup>
  </div>
</template>

<style scoped lang="less">
.log-todo {
  border-radius: var(--border-radius);
  padding: var(--padding);

  display: flex;
  align-items: center;
  gap: 10px;

  // 已完成
  .completed {
    text-decoration: line-through;
  }

  .log {
    display: flex;
    flex-direction: column;
    gap: 6px;

    // 空div应该不占用gap
    > div:empty {
      display: none;
    }
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
