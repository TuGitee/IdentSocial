<template>
    <div class="login">
      <header class="login-header">
        <i class="el-icon-camera-solid"></i>
        <b>Ident Social</b>
      </header>
      <footer class="login-footer">
        <router-link to="/signin">
          <el-button type="primary" class="login-sign-in">Sign In</el-button>
        </router-link>

        <nav class="login-footer-nav">
          <b>other modes</b>
          <i class="el-icon-s-promotion" @touchstart="otherMode"></i>
          <i class="el-icon-s-platform" @touchstart="otherMode"></i>
          <i class="el-icon-upload" @touchstart="otherMode"></i>
        </nav>

        <router-link to="/signup">
          <p class="login-sign-up">Sign Up</p>
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
      password: ""
    }
  },
  mounted() { },
  methods: {
    otherMode() {
      alert("Sorry, we don't have this approach yet. \nPlease use your account to sign in. \nIf you don't have an account, please sign up.");
    }
  }

}
</script>

<style lang="less" scoped>
* {
  font-family: Helvetica, Tahoma, Arial, "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei";
  font-family: Helvetica, Tahoma, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei";
  user-select: none;
  .login {
    transition: all .5 linear;
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
          padding: .5rem;
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
      box-shadow: 0px 0px 10px 0px #B8CAF1;
      background-color: rgba(255, 255, 255, .2);
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