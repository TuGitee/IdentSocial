<template>
  <div id="root" class="home">
    <header class="home-header">
      <h2 class="home-header-hello">你好，</h2>
      <h1 class="home-header-name">{{ userInfo.name }}</h1>
      <router-link to="/upload">
        <i class="el-icon-plus home-header-plus"></i></router-link>
    </header>
    <div class="home-middle">
      <div class="home-middle-scroll">
        <ul class="home-middle-list">
          <li class="home-middle-list-item" v-for="item in recommendInfo.slice(0, 6)" :key="item.id">
            <img :src="require('./images/Avatars/' + item.avatar)" />
          </li>
        </ul>
      </div>
    </div>

    <div class="home-titlemask" ref="mask"></div>

    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="(item, index) in homeRoutes" :key="index" :label="item.meta.name" :name="item.name">
        <footer class="home-footer">
          <router-view></router-view>
        </footer>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
import "@/css/user.less";
import { mapState } from "vuex";
import homeRoutes from "@/router/homeRoutes";
export default {
  name: "Home",
  mounted() {
    this.$store.dispatch("getUserInfo");
    this.$store.dispatch("getRecommendInfo");
    this.activeName = this.homeRoutes[0].name;
    window.addEventListener("scroll", this.handleScroll);
  },
  data() {
    return {
      homeRoutes,
      activeName: "",
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
      recommendInfo: (state) => state.home.recommendInfo,
    }),
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleClick(tab, event) {
      this.$router.push({ path: tab.name });
    },
    handleScroll() {
      this.$refs.mask.style.opacity = window.scrollY / 100;
    },
  },
};
</script>

<style lang="less" scoped>
.home {
  position: relative;
  transition: all 0.5s;

  &::-webkit-scrollbar {
    display: none;
  }

  &-header {
    position: relative;
    margin: 1rem 0;
    box-sizing: border-box;

    &-hello {
      font-size: 2rem;
      font-weight: 400;
    }

    &-name {
      margin: 0.5rem 0;
      width: 18rem;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      font-size: 2.5rem;
      font-weight: 500;
    }

    &-plus {
      padding: 0.5rem;
      position: absolute;
      right: 0;
      bottom: .5rem;
      border-radius: 50%;
      box-shadow: 0px 5px 10px 1px rgba(0, 0, 0, 0.1);
      text-shadow: 1px 0px 0px @purple, 1px 1px 0px @purple, 0px 1px 0px @purple,
        -1px 1px 0px @purple, -1px 0px 0px @purple, -1px -1px 0px @purple,
        0px -1px 0px @purple, 1px -1px 0px @purple;
      font-size: 1.5rem;
      color: @purple;
    }
  }

  &-middle {
    margin: 2rem 0 0;
    width: 100%;
    height: 4rem;
    left: 0;
    overflow: hidden;

    &-scroll {
      overflow: auto;
    }

    &::-webkit-scrollbar {
      display: none;
    }

    &-list {
      display: flex;
      width: fit-content;
      justify-content: space-evenly;
      align-items: center;
      overflow-x: overlay;
      gap: 1rem;

      &-item {
        position: relative;
        width: 3.5rem;
        height: 3.5rem;
        border-radius: 50%;
        border: 1px dashed @purple;

        img {
          width: 90%;
          height: 90%;
          position: absolute;
          top: 5%;
          left: 5%;
          border-radius: 50%;
        }
      }
    }
  }

  @nav-height: 3rem;

  &-titlemask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: calc(constant(safe-area-inset-top) + @nav-height);
    height: calc(env(safe-area-inset-top) + @nav-height);
    background: linear-gradient(rgba(255, 255, 255, 1) 75%, rgba(255, 255, 255, 0.5));
    z-index: 1;
    opacity: 0;
  }

  /deep/ .el-tabs__header {
    position: sticky;
    top: 0;
    top: constant(safe-area-inset-top);
    top: env(safe-area-inset-top);
    z-index: 999;
    height: @nav-height;
    margin: 0;

    .el-tabs__active-bar {
      background-color: @purple;
    }

    .el-tabs__item {
      height: @nav-height;
      line-height: @nav-height;
      font-size: 1.2rem;

      &:active {
        color: @purple;
      }

      &:hover {
        color: @purple;
      }

      &.is-active {
        color: @purple;
      }
    }
  }
}
</style>