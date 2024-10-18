<template>
  <div id="root" class="home" ref="root">
    <header class="home-header">
      <h2 class="home-header-hello">你好，</h2>
      <h1 class="home-header-name">{{ userInfo.username ?? '加载中...' }}</h1>
      <router-link to="/upload">
        <i class="el-icon-plus home-header-plus"></i>
      </router-link>
      <transition name="line">
        <div class="home-header-line" v-if="isScrolling">
          <i class="el-icon-s-opportunity icon"></i>
        </div>
      </transition>
    </header>
    <div class="home-middle">
      <div class="home-middle-scroll">
        <ul class="home-middle-list">
          <li class="home-middle-list-item" v-for="(user) in userList" :key="user.id">
            <router-link :to="{ name: 'UserDetail', params: { uid: user.id } }">
              <MyImage border-type="round" :src="user.avatarUrl" alt="" />
            </router-link>
          </li>
        </ul>
      </div>
    </div>

    <div class="home-titlemask" ref="mask"></div>
    <el-tabs v-model="activeName">
      <el-tab-pane v-for="(item, index) in homeRoutes" :key="index" :label="item.meta.name" :name="item.name">
        <router-view></router-view>
        <p class="loading"><i class="el-icon el-icon-loading"></i></p>
      </el-tab-pane>
    </el-tabs>

    <form class="form" @submit.prevent="publish" v-if="isComment">
      <input type="text" autofocus class="form-input" placeholder="说点什么..." ref="input" v-model="text"
        @blur="closeComment" />
    </form>
  </div>
</template>

<script>
import "@/css/user.less";
import { mapState } from "vuex";
import homeRoutes from "@/router/homeRoutes";
import MyImage from "@/components/MyImage.vue";
export default {
  name: "Home",
  components: {
    MyImage,
  },
  activated() {
    this.$bus.$on("forward", (id, isPostFrom, user, text, el) => {
      this.to = {
        id,
        isPostFrom,
        user,
        text
      };
      this.$route.meta.footerShow = false;
      this.isComment = true;
      window.scrollTo({ top: el.offsetTop + parseInt(getComputedStyle(document.documentElement).getPropertyValue("--safe-area-inset-top")), behavior: "smooth" });
    });
    this.el.addEventListener("scroll", this.handleScroll);
  },
  deactivated() {
    this.el.removeEventListener("scroll", this.handleScroll);
    this.$bus.$off("forward");
  },
  mounted() {
    this.activeName = this.$route.name;
    this.el = window;
    this.handleScroll();
  },
  data() {
    return {
      homeRoutes,
      activeName: "",
      isComment: false,
      to: null,
      text: "",
      timer: null,
      isScrolling: false,
    };
  },
  watch: {
    activeName(val) {
      if (!val) return;
      this.$router.replace({ name: val });
    }
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
      postList: (state) => state.post.postList,
      pageSize: (state) => state.post.pageSize,
    }),
    userList() {
      const arr = [];
      for (let i = 0; i < this.postList.length; i++) {
        if (arr.find(item => item.id === this.postList[i].user.id)) {
          continue;
        } else {
          arr.push(this.postList[i].user);
        }
      }
      return arr;
    }
  },
  methods: {
    closeComment() {
      this.isComment = false;
      this.$route.meta.footerShow = true;
    },
    getData() {
      switch (this.activeName.toLowerCase()) {
        case 'following':
          return this.$store.dispatch('getFollowingPostList');
        default:
          return this.$store.dispatch('getPostList');
      }
    },
    handleFetchData() {
      if (this.timer) return;
      if (this.el.scrollY + this.el.innerHeight >= this.$refs?.root?.offsetHeight) {
        this.timer = setTimeout(() => {
          this.timer = null;
          this.getData();
        }, 100);
      } else if (this.el.scrollY <= 0 && !this.isScrolling) {
        this.isScrolling = true;
        this.timer = setTimeout(() => {
          this.$store.commit("RESET");
          this.getData();
          this.timer = null;
        }, 1000);
      } else if (this.el.scrollY >= 0) {
        this.isScrolling = false;
      }
    },
    handleScroll() {
      this.handleFetchData();
      if (this.$refs.mask)
        this.$refs.mask.style.opacity = (this.el.scrollY - 160) / 100;
    },
    async publish() {
      if (!this.to?.id) return;
      const text = this.to.isPostFrom ? `${this.text} // @[${this.to.user.username}](${this.to.user.id}): ${this.to.text}` : `${this.text}`;
      this.$store.dispatch("postBlog", { text, postFrom: this.to.id }).then(() => {
        this.text = "";
        this.to = {};
        this.isComment = false;
        this.$route.meta.footerShow = true;
        scrollTo(0, 0);
      });
    }
  },
};
</script>

<style lang="less" scoped>
.loading {
  text-align: center;
  color: @purple;
  padding: 1.6rem 0 2rem;
}

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
    z-index: 99;

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
      z-index: 9999999;
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

    .line-enter,
    .line-leave-to {
      top: -100px;
      opacity: 0;
    }

    .line-enter-active,
    .line-leave-active {
      transition: all 0.5s;
    }

    &-line {
      position: absolute;
      right: 1rem;
      top: 0;

      i {
        transform: rotate(180deg);
        color: @darkPurple;

        &::after {
          content: "";
          position: absolute;
          width: 2px;
          height: 999px;
          background-color: @black;
          top: 2px;
          left: 50%;
          transform: translateX(-50%);
          z-index: -1;
        }
      }
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

        .my-image {
          width: 90%;
          height: 90%;
          position: absolute;
          top: 5%;
          left: 5%;
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
    background: linear-gradient(#ffffff, #ffffff11);
    z-index: 999;
    backdrop-filter: blur(20px);
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

    .el-tabs__item {
      height: @nav-height;
      line-height: @nav-height;
      font-size: 1.2rem;
      user-select: none;
    }
  }

  .form {
    width: 100vw;
    height: 3rem;
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
    z-index: 9999;

    &:focus-within {
      padding-bottom: 0 !important;
      margin-top: calc(constant(safe-area-inset-bottom) * -1);
      margin-top: calc(env(safe-area-inset-bottom) * -1);
    }

    &-input {
      width: 100%;
      height: 2rem;
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
  }
}
</style>