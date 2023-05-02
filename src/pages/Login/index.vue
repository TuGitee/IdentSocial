<template>
  <div class="login">
    <header class="login-header">
      <i class="el-icon-camera-solid"></i>
      <b>一款人脸打分的社交APP</b>
    </header>
    <footer class="login-footer">
      <router-link to="/signin">
        <el-button type="primary" class="login-sign-in">登录</el-button>
      </router-link>

      <nav class="login-footer-nav">
        <b>其他方式</b>
        <i class="el-icon-s-promotion" @click="otherMode"></i>
        <i class="el-icon-s-platform" @click="otherMode"></i>
        <i class="el-icon-upload" @click="otherMode"></i>
      </nav>

      <router-link to="/signup">
        <p class="login-sign-up">注册</p>
      </router-link>
    </footer>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      userName: "",
      password: "",
    };
  },
  mounted() {},
  methods: {
    otherMode() {
      alert(
        "对不起！\n我们暂时没有开放这种方式，请注册或登录！\n给您带来不便，敬请谅解！"
      );
    },
  },
};
</script>

<style lang="less" scoped>
* {
  font-family: Helvetica, Tahoma, Arial, "Heiti SC", "Microsoft YaHei",
    "WenQuanYi Micro Hei";
  font-family: Helvetica, Tahoma, Arial, "PingFang SC", "Hiragino Sans GB",
    "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei";
  user-select: none;
  .login {
    transition: all 0.5 linear;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    position: fixed;
    min-height: 100vh;
    min-width: 100vw;
    background: url(./images/index.png) no-repeat;
    background-size: cover;
    background-position: center center;
    padding-bottom: 40px;
    color: white;

    &-header {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;

      i {
        font-size: 4rem;
      }

      b {
        font-size: 1rem;
      }
    }

    &-footer {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: white;

      &-nav {
        display: flex;
        margin-top: 2rem;
        width: 100%;
        justify-content: space-around;
        align-items: center;

        i {
          box-sizing: border-box;
          display: block;
          overflow: hidden;
          font-size: 2rem;
          height: 3rem;
          width: 3rem;
          padding: 0.5rem;
          border-radius: 50%;
          border: 1px solid white;
          background-color: rgba(255, 255, 255, 0.2);
        }
      }
    }

    &-sign-in {
      font-size: 1rem;
      margin-top: 2rem;
      width: 80vw;
      height: 3rem;
      border-color: white;
      border-width: 1px;
      border-style: solid;
      border-radius: 35px;
      box-shadow: 0px 0px 10px 0px #b8caf1;
      background-color: rgba(255, 255, 255, 0.2);
    }

    &-sign-up {
      margin-top: 2rem;
      font-size: 1rem;
      border-bottom: 1px solid white;
      color: white;
    }
  }
}
</style>