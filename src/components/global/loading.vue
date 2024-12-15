<template>
  <div>
    <overlay v-if="loading.state.status">
      <h1>Loading...</h1>
    </overlay>
  </div>
</template>

<script setup>
import { inject } from 'vue'
import overlay from './overlay.vue'

const loading = inject('loading')
</script>