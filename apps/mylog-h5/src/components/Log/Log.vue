<!-- 
  几个注意点
  0. 首页展示和我的展示是否要一样? 待定
      首页要展示用户名, 而我的不用
      首页用发布时间排序, 我的用记录时间排序
  1. 标题有才显示
  2. 视频记录首帧, 展示在图片后面是最好的方式, 但工作量大
      现在采用更多来下拉展示
 -->
<script setup lang="ts">
import type { Log } from '@/types'
import { Star, Share } from '@element-plus/icons-vue'
import { vDblclick } from '@/utils/directives'

const { log } = defineProps<{ log: Log }>()
provide('log', log) // 暴露给子组件

// 双击log，展开和收起
const isExpand = ref(false)
provide('isExpand', isExpand)
const expand = () => (isExpand.value = !isExpand.value)
</script>

<template>
  <div class="log" v-m :id="'log' + log.id" v-dblclick="expand">
    <LogContent />

    <LogMedias />

    <LogTags noPublic />

    <LogBottom />

    <ElButtonGroup class="buttons">
      <ElButton :icon="Share" />
      <ElButton :icon="Star" />
      <!-- StarFilled -->
      <ElButton>
        <ElIcon><CaretTop /></ElIcon>0
      </ElButton>
    </ElButtonGroup>

    <slot name="bottom"></slot>
  </div>
</template>

<style scoped lang="less">
.log {
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
