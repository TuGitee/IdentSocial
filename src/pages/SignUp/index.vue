<template>
  <div class="sign-up">
    <nav class="sign-up-nav">
      <router-link replace to="Login">
        <i class="el-icon-arrow-left"></i><span>首页</span>
      </router-link>
    </nav>

    <transition appear name="move-up">
      <div class="sign-up-box">
        <h2 class="sign-up-box-title">注册</h2>
        <p class="sign-up-box-message">请输入您的相关信息以完成注册。</p>
        <form>
          <div>
            <i class="el-icon-mobile sign-up-box-icon"></i>
            <input
              type="text"
              class="sign-up-box-phone"
              v-model="phone"
              placeholder="输入您的手机号码"
              @keyup="regCheck"
            />

            <el-tooltip
              class="sign-up-box-item"
              effect="dark"
              content="手机号码需要13位数字"
              placement="top"
              ><i class="el-icon-warning-outline" style="color: grey"></i>
            </el-tooltip>
          </div>

          <div>
            <i class="el-icon-lock sign-up-box-icon"></i>
            <input
              type="password"
              class="sign-up-box-password"
              v-model="password"
              autocomplete="true"
              @keyup="regCheck"
              placeholder="输入您的密码"
            />

            <el-tooltip
              class="sign-up-box-item"
              effect="dark"
              content="密码需要6-20个字符"
              placement="bottom"
            >
              <i class="el-icon-warning-outline"></i>
            </el-tooltip>
          </div>

          <div>
            <i class="el-icon-lock sign-up-box-icon"></i>
            <input
              type="password"
              class="sign-up-box-password"
              v-model="makesure"
              autocomplete="true"
              @keyup="regCheck"
              placeholder="确认您的密码"
            />

            <el-tooltip
              class="sign-up-box-item"
              effect="dark"
              content="确认密码需要和您的密码一致"
              placement="bottom"
            >
              <i class="el-icon-warning-outline"></i>
            </el-tooltip>
          </div>
        </form>
        <button
          :class="{ active: isActive }"
          class="sign-up-box-submit"
          @click="goHome"
          @keydown.enter="goHome"
        >
          <i class="el-icon-right"></i>
        </button>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "SignUp",
  data() {
    return {
      phone: "",
      password: "",
      makesure: "",
      isActive: false
    };
  },
  methods: {
    regCheck() {
      if (
        this.phone.length === 11 &&
        this.password.length >= 6 &&
        this.password.length <= 20 &&
        this.password === this.makesure
      ) {
        this.isActive = true;
      } else {
        this.isActive = false;
      }
    },
    goHome() {
      if (this.isActive) {
        this.$router.push({ path: "/user" });
      }
    }
  }
};
</script>


<style lang="less" scoped>
@import "@/css/color.less";
.sign-up {
  color: white;
  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);
  height: 100vh;
  width: 100vw;
  position: fixed;
  transition: all 1s;

  .move-in-enter-active {
    animation: move-in 0.5s ease;
  }

  @keyframes move-in {
    0% {
      top: 100vh;
      opacity: 0;
    }

    100% {
      top: calc(constant(safe-area-inset-top) + 3rem);
      top: calc(env(safe-area-inset-top) + 3rem);
      opacity: 1;
    }
  }

  &::after {
    content: "";
    display: block;
    position: absolute;
    z-index: -1;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background-color: @purple;
  }

  &-nav {
    height: 3rem;
    margin-left: 1.5rem;
    line-height: 3rem;

    i {
      font-size: 1.2rem;
      color: white;
      font-weight: 1000;
    }

    span {
      font-size: 1.5rem;
      color: white;
      margin-left: 0.5rem;
    }
  }

  &-box {
    height: calc(100vh - 3rem);
    height: calc(100vh - 3rem);
    width: 100%;
    background-color: white;
    position: absolute;
    border-radius: 2rem 2rem 0 0;
    left: 0;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 2rem;

    form {
      display: block;
      width: 100%;
    }

    &-title {
      color: black;
      margin-bottom: 1rem;
    }

    &-message {
      color: black;
      margin-bottom: 1rem;
    }

    &-phone,
    &-password {
      position: relative;
      margin: 0;
      font-size: 1rem;
      box-sizing: border-box;
      padding: 0 3.5rem 0 3rem;
      display: block;
      width: 100%;
      border-color: rgb(164, 147, 255);
      border-width: 1px;
      border-style: solid;
      height: 3rem;
      border-radius: 2rem;
      margin-top: 2rem;
      box-shadow: 0px 0px 10px -1px rgb(164, 147, 255);
      outline: none;
    }

    div {
      position: relative;

      .sign-up-box-icon {
        position: absolute;
        left: 1.2rem;
        top: 1rem;
        color: grey;
        font-size: 1rem;
        z-index: 1;
      }

      .sign-up-box-item {
        z-index: 1;
        color: grey;
        outline: none;
        font-size: 1.6rem;
        position: absolute;
        right: 1rem;
        top: 0.7rem;
      }
    }

    &-password {
      &::-ms-reveal {
        display: none;
      }
    }

    &-submit {
      display: block;
      border: none;
      color: white;
      margin-top: 4rem;
      text-align: center;
      line-height: 4rem;
      font-size: 2rem;
      font-weight: 900;
      height: 4rem;
      border-radius: 50%;
      width: 4rem;
      position: relative;
      left: 50%;
      transform: translateX(-50%);
      background-color: rgba(164, 147, 255, 0.25);
      outline: none;
    }
  }
}

@keyframes active {
  to {
    background-color: rgb(164, 147, 255);
    box-shadow: 0 10px 20px -1px rgb(164, 147, 255);
  }
}

.active {
  animation: active 0.5s forwards alternate;
}
</style>