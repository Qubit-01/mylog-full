<script setup lang="ts"></script>
<template>
  <footer class="footer-comp">footer</footer>
</template>
<style lang="scss" scoped>
:global(:root) {
  --footer-height: 200px;
}
.footer-comp {
  background-color: var(--footer-background-color);
  height: var(--footer-height);
}
</style>
