<template>
  <div id="box" ref="root">
    <BlogItem v-for="item in postList" :key="item.id" :item="item" />
  </div>
</template>

<script>
import BlogItem from '@/components/BlogItem.vue';
import { mapGetters } from 'vuex';
export default {
  name: "Recommend",
  components: {
    BlogItem
  },
  computed: {
    ...mapGetters({
      postList: 'sortedPostList'
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
}
</style>