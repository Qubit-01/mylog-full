<!-- 
  抽取Log的内容
 -->
<script lang="ts" setup>
import type { LogVO as Log } from '@mylog-full/mix/types'
import { vEllipsis } from '@mylog-full/mix/utils'

const log = inject<Log>('log')!
const isExpand = inject<Ref<boolean>>('isExpand')!
</script>

<template>
  <div class="log-content">
    <!-- 标题 -->
    <div class="title" v-if="log.info?.title" v-ellipsis="isExpand ? 0 : 1">
      {{ log.info?.title }}
    </div>
    <!-- 内容 -->
    <pre class="content" v-ellipsis="isExpand ? 0 : 3" v-text="log.content" />
  </div>
</template>

<style lang="scss" scoped>
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
