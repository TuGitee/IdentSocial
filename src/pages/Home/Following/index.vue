<template>
  <div id="box">
    <BlogItem v-for="(item) in followingPostList" :key="item.postId" :item="item" />
  </div>
</template>

<script>
import BlogItem from '@/components/BlogItem.vue';
import { mapGetters } from 'vuex';
export default {
  name: "Following",
  components: {
    BlogItem
  },
  computed: {
    ...mapGetters(['followingPostList']),
  },
}
</script>

<style lang="less" scoped>
#box {
  width: 100%;
  height: fit-content;
  margin-top: 1rem;
}
</style>