<template>
  <div class="sign-up">
    <nav class="sign-up-nav">
      <router-link replace to="/">
        <i class="el-icon-arrow-left"></i><span>首页</span>
      </router-link>
    </nav>

    <transition appear name="move-in">
      <div class="sign-up-box">
        <h2 class="sign-up-box-title">注册</h2>
        <p class="sign-up-box-message">请输入您的相关信息以完成注册。</p>

        <el-steps :active="Number(current)" class="sign-up-box-steps">
          <el-step title="步骤 1" @click.native="jumpToStep(0)" icon="el-icon-edit"></el-step>
          <el-step title="步骤 2" @click.native="jumpToStep(1)" icon="el-icon-setting"></el-step>
          <el-step title="步骤 3" @click.native="jumpToStep(2)" icon="el-icon-check"></el-step>
        </el-steps>

        <el-tabs v-model="current" class="sign-up-box-tabs">
          <el-tab-pane disabled name="0">
            <form>
              <div>
                <i class="el-icon-mobile sign-up-box-icon"></i>
                <input type="email" class="sign-up-box-mail" v-model="mail" placeholder="输入您的邮箱" @input="regCheck" />

                <el-tooltip class="sign-up-box-item" effect="dark" content="邮箱需要合法" placement="top"><i
                    class="el-icon-warning-outline" style="color: grey"></i>
                </el-tooltip>
              </div>

              <div>
                <i class="el-icon-lock sign-up-box-icon"></i>
                <input type="password" class="sign-up-box-password" v-model="password" autocomplete="true"
                  placeholder="输入您的密码" @input="regCheck" />

                <el-tooltip class="sign-up-box-item" effect="dark" content="密码需要6-20个字符" placement="bottom">
                  <i class="el-icon-warning-outline"></i>
                </el-tooltip>
              </div>

              <div>
                <i class="el-icon-check sign-up-box-icon"></i>
                <input type="password" class="sign-up-box-password" v-model="makesure" autocomplete="true"
                  placeholder="确认您的密码" @input="regCheck" />

                <el-tooltip class="sign-up-box-item" effect="dark" content="确认密码需要和您的密码一致" placement="bottom">
                  <i class="el-icon-warning-outline"></i>
                </el-tooltip>
              </div>
              <button :class="{ active: isActive }" :disabled="!isActive" class="sign-up-box-submit" @click="nextStep"
                @keydown.enter="nextStep">
                <i class="el-icon-right"></i>
              </button>
            </form>
          </el-tab-pane>
          <el-tab-pane disabled name="1">
            <form>
              <p class="sign-up-box-title">
                已经将验证码发送到您的邮箱
              </p>
              <div class="sign-up-box-check">
                <input type="number" class="sign-up-box-check-input" v-model="Captcha" autocomplete="true"
                  placeholder="输入您的验证码" inputmode="numeric" />
                <div class="captcha">
                  <div class="captcha-item" v-for="i, index in computedCaptcha"
                    :class="{ 'active-index': index === Captcha.length }" :key="index">{{ i }}</div>
                </div>
              </div>
              <p class="sign-up-box-subtitle">
                <el-button class="sign-up-box-resend" :disabled="time > 0" @click="sendCaptcha" type="text">重新发送{{
                  time > 0 ?
                    `(${time})`
                    : '' }}</el-button>
              </p>
              <button type="submit" :class="{ active: isActive }" :disabled="!isActive" class="sign-up-box-submit"
                @click="nextStep" @keydown.enter="nextStep">
                <i class="el-icon-right"></i>
              </button>
            </form>
          </el-tab-pane>
          <el-tab-pane disabled name="2">
            <p class="sign-up-box-success">注册成功</p>
            <button :class="{ active: isActive }" :disabled="!isActive" class="sign-up-box-submit" @click="nextStep"
              @keydown.enter="nextStep">
              <i class="el-icon-check"></i>
            </button>
          </el-tab-pane>
        </el-tabs>
      </div>
    </transition>
  </div>
</template>

<script>
import { reqMockUserLogin, reqMockUserRegister, reqMockVerify, reqMockVerifyCode } from '@/api';

export default {
  name: "SignUp",
  data() {
    return {
      mail: "",
      password: "",
      makesure: "",
      isActive: false,
      current: "0",
      Captcha: "",
      finished: "0",
      time: 60,
      timer: null,
    };
  },
  computed: {
    computedCaptcha() {
      return this.Captcha.padEnd(6, " ").split("");
    },
  },
  watch: {
    Captcha(newVal) {
      if (newVal.length === 6) {
        this.isActive = true;
      }
      else {
        this.Captcha = newVal.slice(0, 6);
        this.isActive = false;
      }
    },
  },
  methods: {
    sendCaptcha() {
      if (this.timer) return;
      this.time = 60;
      this.timer = setInterval(() => {
        this.time--;
        if (this.time <= 0) {
          clearInterval(this.timer);
          this.timer = null;
        }
      }, 1000)
      return reqMockVerifyCode(this.mail).then(res => {
        this.$message.info({
          message: `验证码为${res.data}`,
          duration: 10000,
        })
        this.Captcha = res.data;
        return res;
      })
    },
    jumpToStep(index) {
      if (this.finished >= index) {
        this.current = String(index);
      }
    },
    goHome() {
      if (this.isActive) {
        this.$router.push({ path: "/user" });
      }
    },
    regCheck() {
      const mailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+$/;
      if (mailReg.test(this.mail) && this.password.length >= 6 && this.password.length <= 20 && this.password === this.makesure) {
        this.isActive = true;
      }
      else {
        this.isActive = false;
      }
    },
    checkCaptcha() {
      return reqMockVerify(this.mail, this.Captcha).then((res) => {
        if (res.code == 200) {
          return true;
        } else {
          this.$message.error("验证码错误");
          return false;
        }
      })
    },
    toNext() {
      this.current = String(Number(this.current) + 1);
      this.finished = String(Number(this.finished) + 1);
    },
    async nextStep() {
      this.isActive = false;
      switch (this.current) {
        case "0":
          reqMockUserLogin(this.mail, this.password).then((res) => {
            if (res.code !== 200) {
              this.toNext();
              this.sendCaptcha();
            } else {
              this.$message.error("邮箱已被注册！");
            }
          }).catch(() => { });
          break;
        case "1":
          const flag = await this.checkCaptcha();
          if (!flag) break;
          await reqMockUserRegister(this.mail, this.password);
          this.toNext();
          this.isActive = true;
          this.finished = -1;
          break;
        case "2":
          this.$router.replace({ path: "/" });
          break;
      }
    }
  },
};
</script>


<style lang="less" scoped>
.sign-up {
  color: white;
  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);
  height: 100vh;
  width: 100vw;
  position: fixed;
  transition: all 1s;

  /deep/ .el-tabs__content {
    overflow: inherit;
  }

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
    font-weight: 700;

    i {
      font-size: 1.2rem;
      color: white;
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

    &-title {
      color: black;
      margin-bottom: 1rem;
      font-size: 2rem;
      line-height: 1.5;
      position: relative;
    }

    &-subtitle {
      color: black;
      margin: .5rem 0;
      font-size: 1.5rem;
      font-weight: 700;

      i {
        font-weight: 700;
      }
    }

    &-check {
      position: relative;

      &-input {
        position: absolute;
        height: 100%;
        width: 100%;
        opacity: 0;
        z-index: 999;
      }

      .captcha {
        display: flex;
        justify-content: space-between;
        gap: .5rem;
      }

      .captcha-item {
        flex: 1;
        height: 3rem;
        border-radius: .5rem;
        box-shadow: 0 2px 15px -5px @purple;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.5rem;
        color: grey;
        cursor: pointer;

        &.active-index {
          &::after {
            content: "|";
            animation: opacity 1s ease infinite;
          }

          @keyframes opacity {
            0% {
              opacity: 0.2;
              transform: scaleY(0);
            }

            50% {
              opacity: 1;
              transform: scaleY(1);
            }

            100% {
              opacity: 0.2;
              transform: scaleY(0);
            }
          }

        }
      }
    }

    .fade-enter-active {
      animation: fade 0.5s ease;
    }

    .fade-leave-active {
      animation: fade 0.5s ease reverse;
    }

    @keyframes fade {
      0% {
        opacity: 0;
      }

      100% {
        opacity: 1;
      }
    }

    &-warn {
      color: red;
      position: absolute;
      text-align: center;
      margin-top: 1rem;
      width: 100%;
      font-size: 1rem;
      font-weight: 700;

      i {
        margin-right: .5rem;
      }
    }



    &-message {
      color: black;
      margin-bottom: 1rem;
    }

    &-steps {
      margin: 1rem 1rem 0;
      color: @purple;
    }

    &-tabs {
      margin: 1rem 1rem 0;
      color: @purple;

      /deep/ .el-tabs__nav-scroll {
        display: none;
      }
    }

    &-success {
      font-size: 3rem;
      color: @purple;
      margin: 2rem;
      text-align: center;
    }

    form {
      display: block;
      width: 100%;
    }

    &-message {
      color: black;
      margin-bottom: 1rem;
    }

    &-mail,
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
      margin-top: 3rem;
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