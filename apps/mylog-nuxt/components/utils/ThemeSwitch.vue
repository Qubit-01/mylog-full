<!-- 
  主题切换组件，直接引入就能用
 -->
<script setup lang="ts">
import { Sunny, Moon } from '@element-plus/icons-vue'
const Global = useGlobalStore()

/** 是否是暗黑模式 */
const isDark = computed<boolean>({
  get: () => Global.user.setting.page.theme === 'dark',
  set: v => (Global.user.setting.page.theme = v ? 'dark' : 'light'),
})
</script>

<template>
  <ElSwitch
    v-model="isDark"
    class="theme-switch"
    :active-action-icon="Moon"
    :inactive-action-icon="Sunny"
  />
</template>

<style scoped lang="scss">
.theme-switch {
  --el-switch-on-color: #2b2f3d;
  --el-switch-off-color: #69929c;
}
</style>
