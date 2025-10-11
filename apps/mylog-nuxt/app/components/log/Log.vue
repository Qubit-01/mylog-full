<!-- 
  几个注意点
  0. 首页展示和我的展示是否要一样? 待定
      首页要展示用户名, 而我的不用
      首页用发布时间排序, 我的用记录时间排序
  1. 标题有才显示
  2. 视频记录首帧, 展示在图片后面是最好的方式, 但工作量大
      现在采用更多来下拉展示
 -->
<script lang="ts" setup>
import { Share, Delete } from '@element-plus/icons-vue'
import LogContent from './comp/LogContent.vue'
import LogMedias from './comp/LogMedias.vue'
import LogTags from './comp/LogTags.vue'
import LogBottom from './comp/LogBottom.vue'
import { vDblclick } from '@mylog-full/mix/utils'

const { log } = defineProps<{ log: Log }>()
provide('log', log) // 暴露给子组件

const { logsMap } = refsMylogStore()

// 双击log，展开和收起
const isExpand = ref(false)
provide('isExpand', isExpand)
const expand = () => (isExpand.value = !isExpand.value)

// 删除log，todo 防暴击，加载态
const onDeleteLog = async () => {
  const logDel = await deleteLog(log)
  if (logDel?.id) {
    ElMessage({ message: '删除成功：' + logDel?.id, type: 'success' })
    delete logsMap.value[logDel.id]
  }
}
</script>

<template>
  <div class="Log _m" :id="`log${log.id}`" v-dblclick="expand">
    <LogContent />
    <LogMedias />
    <LogTags />
    <LogBottom />

    <ElButtonGroup class="buttons">
      <ElButton :icon="Share" />
      <ElButton :icon="Delete" @click="onDeleteLog" />
    </ElButtonGroup>

    <slot name="bottom" />
  </div>
</template>

<style lang="scss" scoped>
.Log {
  border-radius: var(--border-radius);
  padding: var(--padding);

  display: flex;
  flex-direction: column;
  gap: 4px;

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
