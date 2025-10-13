<!-- 
  抽取Log的内容
 -->
<script lang="ts" setup>
import { vEllipsis } from '@mylog-full/mix/utils'

defineProps<{ log: Log }>()
const isExpand = inject<Ref<boolean>>('isExpand')!
</script>

<template>
  <div class="LogContent">
    <!-- 标题 -->
    <div class="title" v-if="log.info?.title" v-ellipsis="isExpand ? 0 : 1">
      {{ log.info?.title }}
    </div>
    <!-- 内容 -->
    <pre class="content" v-ellipsis="isExpand ? 0 : 3" v-text="log.content" />
  </div>
</template>

<style lang="scss" scoped>
.LogContent {
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
