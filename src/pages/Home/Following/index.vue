<template>
  <div id="box">
    <BlogItem v-for="(item, index) in followingInfo" :key="item.postId" :item="item" />
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
    this.$store.dispatch('getFollowingInfo', { id: this.$store.state.user.token });
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
  margin-top: 1rem;
  padding-bottom: 2rem;
}
</style>