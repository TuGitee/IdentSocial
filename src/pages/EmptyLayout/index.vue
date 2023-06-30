<template>
  <div class="empty-layout">
  </div>
</template>

<script>
export default {
  name: 'Empty',
  mounted() {
    this.$router.replace({ name: this.$route.meta.cur });
  }
}
</script>