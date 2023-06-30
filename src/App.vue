<template>
  <div id="app">
    <keep-alive exclude="BlogDetail,ChatDetail,BlogItem,WorldDetail,Home">
      <router-view :key="$store.name"></router-view>
    </keep-alive>
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
  data() {
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
          return false;
        }
        iLastTouchTime = iNowTime;
      }, false);
    };
  }
}
</script>

<style lang="less">
:root {
  --safe-area-inset-top: constant(safe-area-inset-top);
  --safe-area-inset-top: env(safe-area-inset-top);
}

* {
  margin: 0;
  padding: 0;
  font-family: Helvetica, Tahoma, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei";
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  text-size-adjust: none;

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

  .el-message-box__wrapper {
    display: flex;
    align-items: center;
    justify-content: center;

    .el-message-box {
      width: 90%;
      padding: .5rem;

      .el-message-box__title {
        font-size: 1.2rem;
        font-weight: bold;
      }

      .el-message-box__content {
        font-size: 1rem;
        margin: .5rem 0;
      }

      .el-message-box__btns {
        display: flex;
        padding: .5rem;

        .el-button {
          flex: 1;
          height: 3rem;
          font-size: 1rem;
          border-radius: .5rem;

          &:active,
          &:hover {
            background-color: @purple;
            color: white;
            border-color: @purple;
          }

          &.el-button--primary {
            border: none;
            background-color: @purple;
          }
        }
      }

    }
  }
}
</style>
