<template>
  <div id="box">
    <BlogItem v-for="(item,index) in nearbyInfo" :key="item.id" :item="item"/>
  </div>
  
</template>

<script>
import BlogItem from '@/components/BlogItem.vue';
import { mapState } from 'vuex';
export default {
  name: "Nearby",
  data() {
    return {
    }
  },
  components: {
    BlogItem
  },
  mounted() {
    this.$store.dispatch('getNearbyInfo');
  },
  computed: {
    ...mapState({
      nearbyInfo: state => state.home.nearbyInfo,
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