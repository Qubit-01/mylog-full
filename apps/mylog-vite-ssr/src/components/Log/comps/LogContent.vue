<!-- 
  抽取Log的内容
 -->
<script setup lang="ts">
import type { Log } from '@/types'
import { vOverflowEllipsis } from '@/utils/directives'

const log = inject<Log>('log')!
const isExpand = inject<Ref<boolean>>('isExpand')!
</script>

<template>
  <div class="log-content">
    <!-- 标题 -->
    <div
      class="title"
      v-if="log.info?.title"
      v-overflow-ellipsis="isExpand ? 0 : 1"
    >
      {{ log.info?.title }}
    </div>

    <!-- 内容 -->
    <pre
      class="content"
      v-overflow-ellipsis="isExpand ? 0 : 3"
      v-text="log.content"
    ></pre>
  </div>
</template>

<style scoped lang="scss">
.log-content {
  display: flex;
  flex-wrap: wrap;

  .title {
    font-size: 1.2rem;
    font-weight: bolder;
  }

  .content {
    font-size: 1rem;
    width: fit-content;
    white-space: pre-wrap;
    // 继承父元素的字体
    font-family: unset;
    // 长英语要换行
    word-break: break-all;
  }
}
</style>
