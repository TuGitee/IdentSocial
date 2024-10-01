<template>
  <div class="face-analysis">
    <div class="face-analysis-background"
      :style="imgSrc === '' ? 'background: linear-gradient(#A493FF 0%,#FFF 40%);' : `background: url(${imgSrc}) no-repeat center center; filter: blur(10px);`">
    </div>
    <div class="face-analysis-picture" v-if="imgSrc"
      :style="`background: url(${imgSrc}) no-repeat center center ; height: ${imgHeight}px; width:${imgWidth}px; transform: translateY(-${delta}px); `"
      v-loading="isLoading" element-loading-text="Loading..." element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0,0,0,.5)">
    </div>

    <h2 class="face-analysis-title" @touchstart="listenMoveDown">
      <span>人脸打分</span>
      <i class="el-icon-more"></i>
    </h2>

    <div class="face-analysis-box" :class="!isUnfold ? 'move-down' : 'move-up'" ref="box">
      <v-touch style="width: 100%;" class="face-analysis-box-touch" @swipeup="listenMoveUp" @swipedown="listenMoveDown">
        <p class="face-analysis-box-thumb" @touchstart="listenMoveUp"></p>
        <h2 class="face-analysis-box-title">
          <span class="face-analysis-box-title-text"><i>&nbsp;上传&nbsp;</i>人像图片</span>
          <el-tooltip class="item" effect="dark" content="上传一张图片，进行人脸打分" placement="top-start">
            <i class="el-icon-info face-analysis-box-title-icon"></i>
          </el-tooltip>
        </h2>

        <div class="face-analysis-box-choice">
          <div class="face-analysis-box-choice-camera">
            <input type="file" @change="changePicture" class="face-analysis-box-choice-camera-file" accept="image/*"
              ref="file" :disabled="isLoading" />
            <button class="face-analysis-box-choice-camera-button" :disabled="isLoading">上传</button>
          </div>
          <button class="face-analysis-box-choice-submit" :disabled="!imgSrc" @click="submit"
            v-show="!isLoading">提交</button>
          <button class="face-analysis-box-choice-cancel" @click="cancel" v-show="isLoading">取消</button>
        </div>
      </v-touch>
      <div class="face-analysis-box-analysis">
        <transition name="el-fade-in-linear" :duration="1000">
          <AnalysisResult v-show="isUnfold" :analysisList="userInfo.analysisList" :title="text" :result="result ?? defaultResult" />
        </transition>
      </div>

    </div>
  </div>
</template>

<script>
import AnalysisResult from './AnalysisResult';
import { mapState } from 'vuex';
export default {
  name: "FaceAnalysis",
  components: {
    AnalysisResult
  },
  data() {
    return {
      file: '',
      imgSrc: '',
      imgHeight: 0,
      imgWidth: 0,
      isLoading: false,
      isUnfold: true,
      text: '最近一次打分结果',
      result: null
    }
  },
  methods: {
    changePicture() {
      let file = this.$refs.file.files[0];
      this.file = file;
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
        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');
        let bounds = img.width / window.screen.width;
        let width = img.width / (bounds + 1);
        let height = img.height / (bounds + 1);
        let filter = 3;
        canvas.width = width * filter;
        canvas.height = height * filter;
        context.drawImage(img, 0, 0, width * filter, height * filter);
        this.imgHeight = height;
        this.imgWidth = width;
        this.isUnfold = false;
      }
    },
    publish() {
      this.$router.push('/upload');
    },
    async submit() {
      this.isLoading = true;
      try {
        const fd = new FormData();
        fd.append('picture', this.file);
        let res = await this.$api.post('/recognition/request', fd, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        this.result = res.data.data
        localStorage.setItem('result', JSON.stringify(this.result));
        this.isLoading = false;
        this.isUnfold = true;
        this.text = '本次打分结果';
      } catch (e) {
        this.isLoading = false;
        alert("Unexpeted Error! Submit Failed!");
      }
    },
    cancel() {
      this.isLoading = false;
    },
    listenMoveUp() {
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
    // this.result = JSON.parse(localStorage.getItem('result'));
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
    defaultResult() {
      return {
        score: this.userInfo.faceScore || 0,
        age: this.userInfo.age || 0,
        gender: this.userInfo.gender || 0,
        stars: []
      }
    },
    delta() {
      return (window.screen.height - this.imgHeight) / 4;
    },
    isResult() {
      return this.result && Object.keys(this.result).length > 0;
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
  height: 100vh;
  user-select: none;
  position: relative;

  * {
    transition: all .3s;
  }

  @keyframes MoveDown {
    0% {
      transform: translateY(0);
    }

    100% {
      transform: translateY(calc(100vh - 10rem - 4rem - 3rem - constant(safe-area-inset-top) - constant(safe-area-inset-bottom)));
      transform: translateY(calc(100vh - 10rem - 4rem - 3rem - env(safe-area-inset-top) - env(safe-area-inset-bottom)));

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
      transform: translateY(calc(100vh - 10rem - 4rem - 3rem - constant(safe-area-inset-top) - constant(safe-area-inset-bottom)));
      transform: translateY(calc(100vh - 10rem - 4rem - 3rem - env(safe-area-inset-top) - env(safe-area-inset-bottom)));
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
    height: 4rem;
    line-height: 4rem;
    left: 1.5rem;
    right: 1.5rem;
    z-index: 1;

    span {
      filter: drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.5));
    }

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
    transform: scale(1.03);
    overflow: hidden;
    padding-bottom: calc(constant(safe-area-inset-bottom) + 4rem);
    background-size: cover !important;
  }

  &-picture {
    @borderRadius : 10px;
    box-sizing: border-box;
    background-size: contain !important;
    z-index: 0;
    align-self: center;
    border-radius: @borderRadius;
    touch-action: none;
    position: fixed;

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
    position: fixed;
    top: calc(constant(safe-area-inset-top) + 4rem);
    top: calc(env(safe-area-inset-top) + 4rem);
    bottom: 0;
    gap: 1rem;
    z-index: 99;
    padding: 0 2rem;
    height: calc(100vh - constant(safe-area-inset-top) - 4rem);
    height: calc(100vh - env(safe-area-inset-top) - 4rem);
    padding-bottom: calc(constant(safe-area-inset-bottom) + 3rem);
    padding-bottom: calc(env(safe-area-inset-bottom) + 3rem);
    background-color: #fff;
    width: 100%;
    border-radius: 20px 20px 0 0;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;

    &-touch {
      width: 100%;
      height: fit-content;
      max-height: 10rem;
    }

    &-thumb {
      height: .3rem;
      width: 30%;
      background-color: #ccc;
      border-radius: 10px;
      margin: .5rem auto 0;
    }

    &-title {
      font-size: 1.5rem;
      color: #000;
      font-weight: 600;
      text-align: center;
      box-sizing: border-box;
      line-height: 2rem;
      padding: 1rem 0 0.5rem;

      .face-analysis-box-title-icon {
        font-size: 1.5rem;
        margin-left: 1rem;
        margin-top: 1px;
        color: @purple;
        outline: none;
      }

    }

    &-choice {
      display: flex;
      justify-content: space-between;
      width: 100%;
      height: 5rem;
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
          border: 1px solid @purple;
          background-color: white;
          box-shadow: 0px 0px 10px 0px @purple;
          font-size: 1rem;
          color: black;

          &:disabled {
            filter: brightness(.9);
            cursor: not-allowed;
            box-shadow: 0 0 0 0 grey;
            border: none;
          }
        }
      }

      &-submit {
        flex: 1;
        margin-left: .5rem;
        height: 3rem;
        border: none;
        background-color: @purple;
        box-shadow: 0px 10px 10px -3px @lightPurple;
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

    &-analysis {
      width: 100%;
      height: 100%;
      overflow-y: scroll;
      overflow-x: unset;

      &-btns {
        width: 100%;
        height: 5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: .8rem;
        padding: 1rem 0;

        &-button {
          width: 80%;
          height: 3rem;
          border: none;
          border-radius: 1rem;
          background-color: @purple;
          color: white;
          font-size: 1rem;
          font-weight: 400;
          box-shadow: 0px 10px 10px -5px @lightPurple;
        }
      }
    }
  }

}
</style>