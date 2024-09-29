<template>
  <div id="app">
    <div class="title-mask" :style="{opacity}"></div>
    <router-view :key="$store.name"></router-view>
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
      opacity: 0,
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.opacity = Math.min(1, window.scrollY / 300);
    }
  }
}
</script>

<style lang="less">
::view-transition-group(root) {
  animation-duration: .3s;
}

:root {
  --safe-area-inset-top: constant(safe-area-inset-top);
  --safe-area-inset-top: env(safe-area-inset-top);
}

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
      max-width: 80%;
      padding-bottom: 14px;

      .el-message-box__title {
        font-size: 1.2rem;
        font-weight: bold;
      }

      .el-message-box__content {
        padding-top: 0;
        padding-bottom: 0;
      }

      .el-message-box__btns {
        display: flex;

        .el-button {
          flex: 1;

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
