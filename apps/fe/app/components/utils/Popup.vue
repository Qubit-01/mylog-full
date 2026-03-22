<!-- 
  自己用v-if或v-show控制显示
  close事件是点击背景遮罩的事件
 -->
<script lang="ts" setup>
const emit = defineEmits(['close'])
</script>

<template>
  <teleport to="body">
    <div class="popup" @click.self="emit('close')">
      <div class="window">
        <slot />
      </div>
    </div>
  </teleport>
</template>

<style lang="scss" scoped>
.popup {
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;

  height: 100vh;
  width: 100vw;
  background-color: #111a;
  backdrop-filter: blur(4px);

  display: flex;

  .window {
    margin: auto;
    max-height: 100vh;
    max-width: 100vw;
    overflow: auto;
  }
}
</style>
