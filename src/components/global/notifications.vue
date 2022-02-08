<template>
  <div class="notifHolder">
    <template v-for="(notif, index) in $notif.state.notifs">
      <div
        v-if="notif.show"
        :class="['notif', notif.color]"
        :style="`bottom: ${index * 60}px;`"
        @click="() => $notif.remove(index)"
        :key="index"
      >
        <p>{{ notif.msg }}</p>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "notifications",
};
</script>

<style scoped>
.notifHolder {
  position: absolute;
  left: 20px;
  bottom: 0;
}
.notif {
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  min-width: 100px;
}
.notif.red {
  color: #842029;
  background-color: #f8d7da;
  border-color: #f5c2c7;
}
.notif.green {
  color: #0f5132;
  background-color: #d1e7dd;
  border-color: #badbcc;
}
</style>