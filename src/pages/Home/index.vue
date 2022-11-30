<template>
  <div id="root" class="home">
    <header class="home-header">
      <h2 class="home-header-hello">Hello, </h2>
      <h1 class="home-header-name">{{ userInfo.name }}</h1>
      <i class="el-icon-plus home-header-plus"></i>
    </header>
    <div class="home-middle">
      <ul class="home-middle-list">
        <li class="home-middle-list-item" v-for="item in recommendInfo.slice(0, 4)" :key="item.id">
          <img :src="require('./images/Avatars/' + item.avatar)" />
        </li>
      </ul>
    </div>
    <footer class="home-footer">
      <nav class="home-footer-nav">
        <router-link class="home-footer-nav-item" v-for="(item,index) in homeRoutes" :key="index" :to="{name: item.name}">
          {{item.name}}
        </router-link>
      </nav>
      <router-view></router-view>
    </footer>

  </div>
</template>

<script>
import '@/css/user.less';
import { mapState } from 'vuex';
import homeRoutes from '@/router/homeRoutes';
export default {
  name: "Home",
  mounted() {
    this.$store.dispatch('getUserInfo');
    this.$store.dispatch('getRecommendInfo');
  },
  data() {
    return {
      homeRoutes,
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo,
      recommendInfo: state => state.home.recommendInfo,
    })
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
.home {
  position: relative;

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
      margin: .5rem 0;
      width: 18rem;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      font-size: 2.5rem;
      font-weight: 500;
    }

    &-plus {
      padding: .5rem;
      position: absolute;
      right: 0;
      bottom: 0;
      border-radius: 50%;
      box-shadow: 0px 5px 10px 1px rgba(0, 0, 0, 0.1);
      text-shadow: 1px 0px 0px #A493FF, 1px 1px 0px #A493FF, 0px 1px 0px #A493FF, -1px 1px 0px #A493FF, -1px 0px 0px #A493FF, -1px -1px 0px #A493FF, 0px -1px 0px #A493FF, 1px -1px 0px #A493FF;
      font-size: 1.5rem;
      color: #A493FF;
    }
  }

  &-middle {
    margin: 2rem 0;
    width: 100%;
    height: fit-content;
    left: 0;

    &::-webkit-scrollbar {
      display: none;
    }

    &-list {
      display: flex;
      flex-wrap: nowrap;
      width: 100%;
      justify-content: space-evenly;
      align-items: center;

      &-item {
        position: relative;
        width: 3.5rem;
        height: 3.5rem;
        border-radius: 50%;
        background-color: #fff;
        border: 1px dashed #A493FF;

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

  &-footer {
    &-nav {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;

      &-item {
        margin-right: 1rem;
        font-size: 1.2rem;
        font-weight: 500;
      }
      .active {
        font-weight: 700;
        position: relative;
        &::after{
          content: '';
          display: block;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          bottom: -.5rem;
          width: 3rem;
          border-radius: 10px;
          height: .3rem;
          background-color: #A493FF;
        }
      }
    }
  }
}
</style>