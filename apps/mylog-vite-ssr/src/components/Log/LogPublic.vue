<script setup lang="ts">
import type { Log } from "@/types";
// import LogContent from "./comps/LogContent.vue";
// import LogMedias from "./comps/LogMedias.vue";
// import LogTags from "./comps/LogTags.vue";
// import LogBottom from "./comps/LogBottom.vue";

const { log } = defineProps<{ log: Log }>();
provide("log", log); // 暴露给子组件
</script>
<template>
  <div class="log-public">
    {{ log }}
    <!-- <LogContent /> -->

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
