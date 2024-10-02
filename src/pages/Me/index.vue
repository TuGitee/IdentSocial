<template>
  <div class="me">
    <header class="me-header">
      <div class="me-header-avatar">
        <el-image class="me-header-avatar-img" :src="userInfo.avatar" alt="" @click="goUserDetail">{{
          userInfo.nickname }}</el-image>
        <i class="el-icon-arrow-right me-header-avatar-arrow" @click="goUserDetail"></i>
      </div>
      <div class="me-header-info">
        <div class="me-header-info-name">
          <span class="me-header-info-name-input">{{ userInfo.nickname }}</span>
        </div>
        <div class="me-header-info-intro">
          简介：{{ userInfo.intro ?? '这个人很懒，什么也没有留下...' }}
        </div>
      </div>
    </header>
    <div class="me-drawers">
      <div class="me-drawers-header">
        <div class="me-drawers-header-item">
          <span class="me-drawers-header-item-text">人脸分数</span>
          <span class="me-drawers-header-item-number">{{ userInfo.faceScore ?? 0 }}</span>
        </div>
        <div class="me-drawers-header-item" @click="toFollow">
          <span class="me-drawers-header-item-text">关注</span>
          <span class="me-drawers-header-item-number">{{ following ?? 0 }}</span>
        </div>
        <div class="me-drawers-header-item" @click="toFollower">
          <span class="me-drawers-header-item-text">粉丝</span>
          <span class="me-drawers-header-item-number">{{ followers ?? 0 }}</span>
        </div>
      </div>
      <ul class="me-drawers-list">
        <li class="me-drawers-list-item" v-for="(item, index) in list" :key="index">
          <div class="me-drawers-list-item-left">
            <div class="me-drawers-list-item-left-icon">
              <i :class="item.icon"></i>
            </div>
            <div class="me-drawers-list-item-left-text">
              {{ item.text }}
            </div>
          </div>

          <div class="me-drawers-list-item-arrow">
            <i class="el-icon-arrow-right"></i>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
export default {
  name: "MePage",
  data() {
    return {
      list: [
        {
          icon: "el-icon-s-data",
          text: "我的人脸数据"
        },
        {
          icon: "el-icon-star-on",
          text: "喜欢过的"
        },
        {
          icon: "el-icon-share",
          text: "分享过的"
        },
        {
          icon: "el-icon-message-solid",
          text: "消息"
        },
        {
          icon: "el-icon-s-tools",
          text: "设置"
        },
        {
          icon: "el-icon-s-help",
          text: "帮助中心"
        },
        {
          icon: "el-icon-s-release",
          text: "反馈"
        },
        {
          icon: "el-icon-s-opportunity",
          text: "关于我们"
        },
        {
          icon: "el-icon-s-ticket",
          text: "优惠券"
        }
      ]
    };
  },
  computed: {
    ...mapState({ userInfo: state => state.user.userInfo ?? {} }),
    ...mapGetters(['followCount']),
    followers() {
      if (this.userInfo.followers > 1000) {
        return (this.userInfo.followers / 1000).toFixed(1) + 'K';
      } else {
        return this.userInfo.followers;
      }
    },
    following() {
      if (this.followCount > 1000) {
        return (this.followCount / 1000).toFixed(1) + 'K';
      } else {
        return this.followCount;
      }
    }
  },
  methods: {
    goUserDetail() {
      this.$router.push({ name: 'UserDetail', params: { uid: this.userInfo.id } });
    },
    toFollow() {
      this.$router.push({ name: 'Follow', params: { uid: this.userInfo.id } });
    },
    toFollower() {
      this.$router.push({ name: 'Follower', params: { uid: this.userInfo.id } });
    }
  }
}
</script>

<style lang="less" scoped>
.me {
  box-sizing: border-box;
  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);

  &::after {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 50%;
    z-index: -100;
    background: linear-gradient(@lightPurple, white);
  }

  &-header {
    box-sizing: border-box;
    position: sticky;
    top: constant(safe-area-inset-top);
    top: env(safe-area-inset-top);
    left: 0;
    width: 100%;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    &-avatar {
      user-select: none;
      margin-top: 2rem;
      position: relative;
      width: 100%;
      display: flex;
      justify-content: center;

      &-img {
        user-select: none;
        border-radius: 50%;
        height: 4rem;
        width: 4rem;
      }

      &-arrow {
        position: absolute;
        right: 2rem;
        top: 50%;
        transform: translateY(-50%);
        font-size: 1.5rem;
        color: @purple;
        text-shadow: 1px 1px 0px @purple, 1px 0px 0px @purple, 0px 1px 0px @purple;
      }
    }

    &-info {
      user-select: none;
      margin-top: 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      &-name {
        user-select: none;

        &-input {
          display: block;
          max-width: 12rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 1.5rem;
          font-weight: bold;
          color: #000;
          border: none;
          outline: none;
          text-align: center;
          background-color: transparent;

          &[disabled="disabled"] {
            user-select: none;
            color: #000;
          }
        }

        &-icon {
          font-size: 1.2rem;
          color: #5C5C5C;
          margin-left: 10px;
        }
      }

      &-intro {
        font-size: 1rem;
        margin: 10px;
        color: #5C5C5C;
        word-break: break-all;
        text-align: center;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
      }
    }

    &-follow {
      user-select: none;
      margin-top: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;

      &-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin: 0 1rem;

        &-number {
          font-size: 1.2rem;
          font-weight: bold;
        }

        &-text {}
      }
    }
  }

  &-drawers {
    z-index: 0;
    position: relative;
    margin-bottom: calc(env(safe-area-inset-bottom) + 4rem);
    background-color: @white;
    border-radius: 20px 20px 0 0;
    padding: 0 2rem;
    padding-bottom: 5.5rem;
    box-sizing: border-box;

    &-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.3rem 0;
      border-bottom: 1px solid #E5E5E5;

      &-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        flex: 1;
        height: 3rem;
        font-size: 1rem;
        color: #5C5C5C;
        cursor: pointer;

        &-text {
          font-size: .8rem;
        }

        &-number {
          font-size: 1.2rem;
          font-weight: bold;
        }
      }
    }

    &-list {
      padding: 1rem 0;

      &-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem 0;

        &-left {
          margin-left: .5rem;
          display: flex;
          align-items: center;
          justify-content: flex-start;

          &-icon {
            font-size: 1.5rem;
            color: @purple;
          }

          &-text {
            margin-left: 1rem;
            font-size: 1rem;
            color: #000;
          }

        }


        &-arrow {
          margin-right: .5rem;
          font-size: 1.3rem;
          text-shadow: 1px 1px 0px #8C8C8C, 1px 0px 0px #8C8C8C, 0px 1px 0px #8C8C8C;
          color: #8C8C8C;
        }
      }
    }
  }
}
</style>