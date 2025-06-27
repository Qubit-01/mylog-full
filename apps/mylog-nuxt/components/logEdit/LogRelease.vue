<script lang="ts" setup>
import { useLogRelease } from '~/composables/log/release';
import ControlIcons from './comp/ControlIcons.vue';

const { logEdit, uploadInfo, releaseLog } = useLogRelease();

</script>
<!-- 
  发布Log模块
  - 显示上传进度/类型选择区，发布按钮
  - 编辑项选择区
  - 内容输入区
  - 编辑数据组件
-->
<template>
  <div class="LogRelease  _m">
    <!-- 第一行 -->
    <ElProgress v-if="uploadInfo.percent > -1" :percentage="uploadInfo.percent" :text-inside="true" :stroke-width="20"
      striped striped-flow :duration="10">
      {{ uploadInfo.percent }}% {{ uploadInfo.speed }}MB/s
    </ElProgress>
    <div class="control">
      <ElRadioGroup v-model="logEdit.type" size="small">
        <ElRadioButton label="记录" value="log" />
        <ElRadioButton label="公开" value="public" />
      </ElRadioGroup>
      <ElButton size="small" type="primary" @click="releaseLog">发布</ElButton>
    </div>
    <ControlIcons />

    <ElInput v-model="logEdit.content" :autosize="{ minRows: 3 }" type="textarea" placeholder="记录生活，记录你" />

  </div>
</template>

<style lang="scss" scoped>
.LogRelease {
  border-radius: 8px;
  padding: var(--padding);

  display: flex;
  flex-direction: column;
  gap: 8px;

  .control {
    display: flex;
    justify-content: space-between;
  }
}
</style>
