<template>
  <div id="box">
    <BlogItem v-for="(item, index) in followingInfo" :key="item.id" :item="item" />
  </div>
</template>

<script>
import BlogItem from '@/components/BlogItem.vue';
import { mapState } from 'vuex';
export default {
  name: "Following",
  components: {
    BlogItem
  },
  mounted() {
    this.$store.dispatch('getFollowingInfo');
  },
  computed: {
    ...mapState({
      followingInfo: state => state.home.followingInfo,
    })
  },
}
</script>

<style lang="less" scoped>
#box {
  width: 100%;
  height: fit-content;
  margin-top: 2rem;
  padding-bottom: calc(constant(safe-area-inset-bottom) + 4rem);
  padding-bottom: calc(env(safe-area-inset-bottom) + 4rem);
}
</style>