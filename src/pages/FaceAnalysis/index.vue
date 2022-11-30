<template>
  <div class="face-analysis">
    <div class="face-analysis-background"
      :style="imgSrc === '' ? 'background: linear-gradient(#A493FF 0%,#FFF 40%);' : `background: url(${imgSrc}) no-repeat center center; filter: blur(10px);`">
    </div>

    <div class="face-analysis-picture" v-if="imgSrc"
      :style="`background: url(${imgSrc}) no-repeat center center ; height: ${imgHeight / (bounds + 1)}px; width:${imgWidth / (bounds + 1)}px; transform: translateY(-${delta}px); `"
      v-loading="isLoading" element-loading-text="Loading..." element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0,0,0,.5)">
    </div>

    <h2 class="face-analysis-title">
      <span>FaceAnalysis</span>
      <i class="el-icon-more"></i>
    </h2>

    <v-touch @swipeup="listenMoveUp" @swipedown="listenMoveDown" class="face-analysis-box"
      :class="!isUnfold ? 'move-down' : 'move-up'" ref="box">
      <h2 class="face-analysis-box-title">
        <span class="face-analysis-box-title-text">Please Click Upload to Upload a Photo!</span>
        <el-tooltip class="item" effect="dark" content="Please Upload Before Submit! " placement="top-start"
          :hide-after="1000">
          <i class="el-icon-info face-analysis-box-title-icon"></i>
        </el-tooltip>
      </h2>
      <div class="face-analysis-box-choice">
        <div class="face-analysis-box-choice-camera">
          <input type="file" @change="changePicture" class="face-analysis-box-choice-camera-file" accept="/images/*"
            ref="file" />
          <button class="face-analysis-box-choice-camera-button">Upload</button>
        </div>
        <button class="face-analysis-box-choice-submit" :disabled="!imgSrc" @click="submit"
          v-show="!isLoading">Submit</button>
        <button class="face-analysis-box-choice-cancel" @click="cancel" v-show="isLoading">Cancel</button>
      </div>
      <transition name="el-fade-in-linear" :duration="1000">
        <AnalysisResult v-show="isUnfold" :analysisList="userInfo.analysisList" />
      </transition>
    </v-touch>
  </div>
</template>

<script>
import AnalysisResult from '@/components/AnalysisResult.vue';
import { mapState } from 'vuex';
export default {
  name: "FaceAnalysis",
  components: {
    AnalysisResult
  },
  data() {
    return {
      imgSrc: '',
      imgHeight: 0,
      imgWidth: 0,
      bounds: 1,
      isLoading: false,
      isUnfold: true,
    }
  },
  methods: {
    changePicture() {
      let file = this.$refs.file.files[0];
      if (window.createObjectURL != undefined) {
        this.imgSrc = window.createObjectURL(file);

      } else if (window.URL != undefined) {
        this.imgSrc = window.URL.createObjectURL(file);

      } else if (window.webkitURL != undefined) {
        this.imgSrc = window.webkitURL.createObjectURL(file);
      }
      let img = new Image();
      img.src = this.imgSrc;
      img.onload = () => {
        this.imgHeight = img.height;
        this.imgWidth = img.width;
        this.bounds = img.width / window.screen.width;
        this.isUnfold = false;
      }

    },
    submit() {
      this.isLoading = true;
      setTimeout(() => {
        try {
          if (this.isLoading) {
            this.isLoading = false;
            throw new Error('fail');
          }
        } catch (e) {
          alert("Unexpeted Error! Submit Failed!");
        }
      }, 5000);
    },
    cancel() {
      this.isLoading = false;
    },
    listenMoveUp() {
      console.log(1)
      if (this.imgSrc) {
        this.isUnfold = true;
      }
    },
    listenMoveDown() {
      if (this.imgSrc) {
        this.isUnfold = false;
      }
    }
  },
  mounted() {
    this.$store.dispatch('getUserInfo');
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
    delta() {
      return (window.screen.height-this.imgHeight / (this.bounds + 1))/4;
    }
  },
}
</script>

<style lang="less" scoped>
.face-analysis {
  touch-action: pan-y !important;
  display: flex;
  justify-content: center;
  overflow-x: hidden;
  box-sizing: border-box;
  width: 100%;
  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);
  // padding-bottom: calc(constant(safe-area-inset-bottom) + 4rem);
  // padding-bottom: calc(env(safe-area-inset-bottom) + 4rem);
  height: 100vh;
  user-select: none;
  position: relative;

  @keyframes MoveDown {
    0% {
      transform: translateY(0);
    }

    100% {
      transform: translateY(calc(100vh - 20rem - constant(safe-area-inset-top) - constant(safe-area-inset-bottom)));
      transform: translateY(calc(100vh - 20rem - env(safe-area-inset-top) - env(safe-area-inset-bottom)));
    }
  }


  .move-down {
    animation: MoveDown .6s forwards;
    position: fixed;
    box-shadow: 0px -1px 20px -10px #000;
  }

  .move-up {
    animation: MoveUp .6s forwards;
  }

  @keyframes MoveUp {
    0% {
      transform: translateY(calc(100vh - 20rem - constant(safe-area-inset-top) - constant(safe-area-inset-bottom)));
      transform: translateY(calc(100vh - 20rem - env(safe-area-inset-top) - env(safe-area-inset-bottom)));
    }

    100% {
      transform: translateY(0);
    }
  }

  &::-webkit-scrollbar {
    display: none;
  }

  &-title {
    display: flex;
    position: fixed;
    top: constant(safe-area-inset-top);
    top: env(safe-area-inset-top);
    justify-content: space-between;
    align-items: center;
    font-size: 2rem;
    color: #fff;
    font-weight: 600;
    text-shadow: 1px 1px 1px #000;
    height: 4rem;
    line-height: 4rem;
    left: 1.5rem;
    right: 1.5rem;
    z-index: 0;

    i {
      font-size: 1.5rem;
      transform: rotate(90deg);
    }
  }

  &-background {
    box-sizing: border-box;
    position: fixed;
    top: 0;
    left: 0;
    min-width: 100vw;
    min-height: 100vh;
    z-index: -9;
    overflow: hidden;
    padding-bottom: calc(constant(safe-area-inset-bottom) + 4rem);
    background-size: cover !important;
  }

  &-picture {
    @borderRadius : 10px;
    box-sizing: border-box;
    background-size: contain !important;
    z-index: 0;
    // position: fixed;
    position: absolute;
    align-self: center;
    border-radius: @borderRadius;

    /deep/ .el-loading-mask {
      border-radius: @borderRadius;
    }

    /deep/ .el-icon-loading,
    /deep/ .el-loading-text {
      color: white !important;
      font-weight: 700;
      font-size: 1.5rem;
    }

  }


  &-box {
    position: relative;
    z-index: 9;
    padding: 0 2rem;
    // height: fit-content;
    height: calc(100vh - constant(safe-area-inset-bottom) - constant(safe-area-inset-top) - 4rem);
    height: calc(100vh - env(safe-area-inset-bottom) - env(safe-area-inset-top) - 4rem);
    padding-bottom: calc(constant(safe-area-inset-bottom) + 4rem);
    padding-bottom: calc(env(safe-area-inset-bottom) + 4rem);
    background-color: #fff;
    width: 100%;
    border-radius: 20px 20px 0 0;
    margin-top: 4rem;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;

    &-title {
      font-size: 1.5rem;
      color: #000;
      font-weight: 600;
      text-align: center;
      height: 6rem;
      box-sizing: border-box;
      line-height: 2rem;
      padding: 1rem;

      .face-analysis-box-title-icon {
        font-size: 1.5rem;
        margin-left: 1rem;
        margin-top: 1px;
        color: #A493FF;
        outline: none;
      }

    }

    &-choice {
      display: flex;
      justify-content: space-between;
      width: 100%;
      height: 3rem;
      padding: 1rem 0;

      @borderRadius : 15px;

      &-camera {
        position: relative;
        flex: 1;

        &-file,
        &-button {
          width: 95%;
          flex: 1;
          position: absolute;
          top: 0;
          left: 0;
          height: 3rem;
          border-radius: @borderRadius;
        }

        &-file {
          opacity: 0;
          z-index: 99;
        }

        &-button {
          flex: 1;
          border: 1px solid #A493FF;
          background-color: white;
          box-shadow: 0px 0px 10px 0px #A493FF;
          font-size: 1rem;
          color: black;
        }
      }

      &-submit {
        flex: 1;
        margin-left: .5rem;
        height: 3rem;
        border: none;
        background-color: #A493FF;
        box-shadow: 0px 10px 10px 0px #a393ff76;
        font-size: 1rem;
        color: white;
        border-radius: @borderRadius;

        &:disabled {
          filter: brightness(.9);
          cursor: not-allowed;
        }
      }

      &-cancel {
        flex: 1;
        margin-left: .5rem;
        height: 3rem;
        border: none;
        border-radius: @borderRadius;
        font-size: 1rem;
        color: white;
        background-color: #F56C6C;
        box-shadow: 0px 10px 10px 0px #F56C6C76;
      }
    }
  }

}
</style>