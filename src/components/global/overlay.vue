<template>
  <div class="overlay d-flex align-items-center justify-content-center">
    <slot></slot>
  </div>
</template>

<script setup>
</script>

<style scoped>
.overlay {
  height: 100vh;
  width: 100vw;
  background: rgba(0, 0, 0, 0.3);
  position: absolute;
  left: 0;
  top: 0;
}
</style>