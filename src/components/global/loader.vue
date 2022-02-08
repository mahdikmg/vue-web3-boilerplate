<template>
  <div>
    <overlay v-if="$loading.state.status">
      <h1>Loading...</h1>
    </overlay>
  </div>
</template>

<script>
export default {
  components: { overlay: () => import("./overlay.vue") },
  name: "loader",
};
</script>