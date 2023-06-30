<template>
  <div id="box" ref="root">
    <BlogItem v-for="item in recommendInfo" :key="item.postId+Math.random()" :item="item" />
  </div>
</template>

<script>
import BlogItem from '@/components/BlogItem.vue';
import { mapState } from 'vuex';
export default {
  name: "Recommend",
  components: {
    BlogItem
  },
  computed: {
    ...mapState({
      recommendInfo: state => state.home.recommendInfo,
    })
  },
  methods: {
  },
  mounted() {
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