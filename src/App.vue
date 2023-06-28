<template>
  <div id="app">
    <router-view></router-view>
    <ChangePage v-if="$route.meta.footerShow" />
  </div>
</template>

<script>
import ChangePage from './components/ChangePage.vue';
export default {
  name: 'App',
  components: {
    ChangePage,
  },
  data(){
    return {
    }
  },
  mounted() {
    let agent = navigator.userAgent.toLowerCase();
    let iLastTouchTime = null;
    if (agent.indexOf('iphone') >= 0 || agent.indexOf('ipad') >= 0) {
      document.addEventListener('touchend', function (event) {
        let iNowTime = new Date().getTime();
        iLastTouchTime = iLastTouchTime || iNowTime + 1;
        let delta = iNowTime - iLastTouchTime;
        if (delta < 500 && delta > 0) {
          event.preventDefault();
          return false;
        }
        iLastTouchTime = iNowTime;
      }, false);
    };
  }
}
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
  -webkit-tap-highlight-color: transparent;
  font-family: Helvetica, Tahoma, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei";
  box-sizing: border-box;

  &::-webkit-scrollbar {
    display: none;
  }

  #app {
    height: 100vh;
  }

  a {
    text-decoration: none;
    color: black;

    &:active {
      color: black;
    }
  }

  ul {
    li {
      list-style: none;
    }
  }
}
</style>
