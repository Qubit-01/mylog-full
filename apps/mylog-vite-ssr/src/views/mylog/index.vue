<script setup lang="ts"></script>
<template>
  <div class="mylog-page">
    <n-tabs type="line" animated>
      <n-tab-pane name="oasis" tab="Oasis"> <RouterView /> </n-tab-pane>
      <n-tab-pane name="the beatles" tab="the Beatles"> Hey Jude </n-tab-pane>
      <n-tab-pane name="jay chou" tab="周杰伦"> 七里香 </n-tab-pane>
    </n-tabs>
  </div>
</template>
<style lang="scss" scoped>
.mylog-page {
  display: flex;
  flex-direction: column;
  gap: var(--gap);
  // background-color: var(--m-background-color);
}
</style>
