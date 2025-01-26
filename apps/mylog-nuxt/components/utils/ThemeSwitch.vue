<!-- 
  主题切换组件，直接引入就能用
 -->
<script lang="ts" setup>
import { Sunny, Moon } from '@element-plus/icons-vue'
const { user } = refsGlobalStore()
</script>

<template>
  <el-switch
    v-model="user.setting.page.theme"
    class="theme-switch"
    :active-action-icon="Moon"
    :inactive-action-icon="Sunny"
    active-value="dark"
    inactive-value="light"
  />
</template>

<style lang="scss" scoped>
.theme-switch {
  --el-switch-on-color: #2c2c2c;
  --el-switch-off-color: #f2f2f255;
  --color: #333;
}
</style>
