<template>
  <div id="root" class="home" ref="root">
    <header class="home-header">
      <h2 class="home-header-hello">你好，</h2>
      <h1 class="home-header-name">{{ userInfo.nickname }}</h1>
      <router-link to="/upload">
        <i class="el-icon-plus home-header-plus"></i></router-link>
    </header>
    <div class="home-middle">
      <div class="home-middle-scroll">
        <ul class="home-middle-list">
          <li class="home-middle-list-item" v-for="(item, index) in recommendInfo.slice(0, 8)" :key="item.postId">
            <img :src="require(`@/assets/images/${index}.png`)" alt="" />
          </li>
        </ul>
      </div>
    </div>

    <div class="home-titlemask" ref="mask"></div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="(item, index) in homeRoutes" :key="index" :label="item.meta.name" :name="item.name">
        <footer class="home-footer">
          <router-view :followingList="followingList" :key="$route.name"></router-view>
        </footer>
      </el-tab-pane>
    </el-tabs>

    <div class="blog-footer" v-if="isComment">
      <input type="text" class="blog-footer-input" place-holder="说点什么..." autofocus v-model="text" />
      <button class="blog-footer-btn" @touchstart="publish">转发</button>
    </div>
  </div>
</template>

<script>
import "@/css/user.less";
import { mapState } from "vuex";
import homeRoutes from "@/router/homeRoutes";
import MonitorKeyboard from "@/utils/MonitorKeyboard";
export default {
  name: "Home",
  mounted() {
    this.$store.dispatch("getUserInfo");
    this.getKeyboardState();
    this.getData();
    this.$bus.$on("forward", (data) => {
      this.to = data;
      this.isComment = true;
      this.$route.meta.footerShow = false;
    });
    this.activeName = this.$route.name;

    window.addEventListener("scroll", this.handleScroll);
    window.addEventListener("scroll", (e) => {
      if (this.timer) return;
      if (window.scrollY + window.innerHeight >= this.$refs?.root?.offsetHeight) {
        this.timer = setTimeout(() => {
          this.getData()
          this.timer = null;
        }, 1000);
      }
    });

    this.$bus.$on('reload', () => {
      location.reload();
    })
  },
  data() {
    return {
      homeRoutes,
      activeName: "",
      isComment: false,
      to: null,
      text: "",
      monitorKeyboard: null,
      pageNo: 1,
      pageSize: 10,
      timer: null,
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
      recommendInfo: (state) => state.home.recommendInfo,
      followingList: (state) => state.home.followingList,
    }),
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    getData() {
      this.$store.dispatch("getRecommendInfo", { page: this.pageNo, limit: this.pageSize, userId: this.$store.state.user.token });
      this.pageNo++;
    },
    handleClick(tab, event) {
      event.preventDefault();
      this.$router.push({ path: tab.name });
    },
    handleScroll() {
      if (this.$refs.mask)
        this.$refs.mask.style.opacity = window.scrollY / 100;
    },
    async publish() {
      let res = await this.$blogAxios.post("/post/forward", {
        content: this.text,
        userId: this.$store.state.user.token,
        postFrom: this.to,
        postTitle: "转发动态"
      });
      console.log(res);
      if (res.data.code) {
        location.reload();
        this.$notify({
          title: "成功",
          message: "转发成功",
          type: "success",
          offset: parseInt(getComputedStyle(document.documentElement).getPropertyValue("--safe-area-inset-top")),
        });
        this.isComment = false;
        this.$route.meta.footerShow = true;
      }
    },
    getKeyboardState() {
      this.monitorKeyboard = new MonitorKeyboard();
      this.monitorKeyboard.onStart();

      this.monitorKeyboard.onShow(() => {
        console.log(2);
        this.isComment = true;
        this.$route.meta.footerShow = false;
      });

      this.monitorKeyboard.onHidden(() => {
        this.isComment = false;
        this.$route.meta.footerShow = true;
      })
    }
  },
  beforeDestroy() {
    this.monitorKeyboard.onEnd();
  },
};
</script>

<style lang="less" scoped>
.home {
  position: relative;
  transition: all 0.5s;

  .blog-footer {
    width: 100%;
    height: 3.5rem;
    position: fixed;
    bottom: 0;
    left: 0;
    background-color: #fff;
    border-top: 1px solid #eee;
    padding: 0.5rem;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    display: flex;
    gap: .5rem;
    z-index: 9999999999999;

    &:focus-within {
      padding-bottom: 0 !important;
      margin-top: calc(constant(safe-area-inset-bottom) * -1);
      margin-top: calc(env(safe-area-inset-bottom) * -1);
    }

    &-input {
      width: 100%;
      height: 2.5rem;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      outline: none;
      padding: .5rem;
      font-size: 1rem;
      border: none;
      color: #666;
      background-color: #eee;
      border-radius: .5rem;

    }

    &-btn {
      height: 2.5rem;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      outline: none;
      padding: .5rem .75rem;
      font-size: 1rem;
      white-space: nowrap;
      width: max-content;
      border: none;
      color: #fff;
      background-color: @purple;
      border-radius: .5rem;
    }
  }

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
      user-select: none;

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