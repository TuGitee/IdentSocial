<template>
  <div id="box">
    <BlogItem v-for="(item,index) in recommendInfo" :key="item.id" :item="item"/>
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
  mounted() {
    this.$store.dispatch('getRecommendInfo');
  },
  computed: {
    ...mapState({
      recommendInfo: state => state.home.recommendInfo,
    })
  },

}
</script>

<style lang="less" scoped>
#box {
  width: 100%;
  height: fit-content;
  margin-top: 1rem;
  padding-bottom: calc(constant(safe-area-inset-bottom) + 4rem);
  padding-bottom: calc(env(safe-area-inset-bottom) + 4rem);
}
</style>