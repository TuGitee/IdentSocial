<template>
  <div id="app">
    <div class="title-mask" :style="{ opacity }"></div>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" :key="$route.fullPath"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" :key="$route.fullPath"></router-view>
    <ChangePage v-if="$route.meta.footerShow" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ChangePage from './components/ChangePage.vue';
import { emit, WebSocketType } from './ws';
export default {
  name: 'App',
  components: {
    ChangePage,
  },
  data() {
    return {
      opacity: 0,
    }
  },
  mounted() {
    if (this.token) {
      this.$store.dispatch('getUserInfo').then(()=>{
        if (this.$route.matched.some(item => !item.meta.requireAuth))
          this.$router.replace({ name: 'Home' });
      })
    }
    window.addEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.opacity = Math.min(1, window.scrollY / 300);
    }
  },
  computed: {
    ...mapState({
      token: state => state.user.token
    })
  },
  beforeDestroy() {
    emit(WebSocketType.Disconnet, this.token)
  }
}
</script>

<style lang="less">
@import "@/css/element.less";
@import "@/css/index.less";

.title-mask {
  backdrop-filter: blur(20px);
  height: var(--safe-area-inset-top);
  mask-image: linear-gradient(to top, transparent, #000 50%, #000);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
}
</style>
