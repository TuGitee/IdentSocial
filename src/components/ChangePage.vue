<template>
  <div class="change-page">
    <router-link replace v-for="(item, index) in routeList" :key="index" class="change-page-item"
      :to="{ name: item.name }">
      <el-badge :is-dot="item.meta.isDot">
        <i :class="item.meta.icon"></i>
      </el-badge>
    </router-link>
  </div>
</template>

<script>
import userRoutes from '@/router/userRoutes';
export default {
  data() {
    return {
      routeList: userRoutes,
      activeIndex: 0,
    }
  },
  mounted() {
  },
  methods: {
  },
}
</script>

<style lang="less" scoped>
.change-page {
  background-color: white;
  position: fixed;
  z-index: 99;
  bottom: 0;
  left: 0;
  box-shadow: 0px 20px 30px 0px #000;
  border-radius: 10px 10px 0px 0px;
  display: flex;
  height: 3rem;
  height: calc(3rem + constant(safe-area-inset-bottom));
  height: calc(3rem + env(safe-area-inset-bottom));
  width: 100%;
  user-select: none;
  box-sizing: border-box;
  padding-top: 1rem;
  padding-bottom: 1rem;
  padding-bottom: calc(constant(safe-area-inset-bottom) + 1rem);
  padding-bottom: calc(env(safe-area-inset-bottom) + 1rem);

  .active {
    color: #A493FF;
  }

  &-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #D6CEFF;

    i {
      font-size: 1.5rem;
    }

    span {
      font-size: 1rem;
    }
  }
}
</style>