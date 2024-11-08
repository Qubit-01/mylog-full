<script setup lang="ts">
import LogContent from './comps/LogContent.vue'
import { vDblclick } from '@/utils/directives'

// import LogMedias from "./comps/LogMedias.vue";
// import LogTags from "./comps/LogTags.vue";
// import LogBottom from "./comps/LogBottom.vue";

const { log } = defineProps<{ log: Log }>()
provide('log', log) // 暴露给子组件

/** 是否展开 */
const isExpand = ref(false)
provide('isExpand', isExpand) // 暴露给子组件
const expand = () => {
  isExpand.value = !isExpand.value
}
</script>
<template>
  <div class="log-public" :id="'log' + log.id" v-dblclick="expand">
    <!-- {{ log }} -->
    <LogContent />

    <!-- <LogMedias /> -->

    <!-- <LogTags noPublic /> -->

    <!-- <LogBottom /> -->

    <!-- <ElButtonGroup class="buttons">
      <ElButton :icon="Share" />
      <ElButton :icon="Star" />
      <ElButton>
        <ElIcon><CaretTop /></ElIcon>0
      </ElButton>
    </ElButtonGroup> -->

    <slot name="bottom"></slot>
  </div>
</template>
<style lang="scss" scoped>
.log-public {
  background-color: var(--block-background-color);
  border-radius: 8px;
  padding: 8px;
}
</style>
