<template>
  <div class="me">
    <header class="me-header">
      <div class="me-header-avatar">
        <img class="me-header-avatar-img" :src="require('@/pages/Me/images/' + userInfo.avatar)" alt="" />
        <i class="el-icon-arrow-right me-header-avatar-arrow"></i>
      </div>
      <div class="me-header-info">
        <div class="me-header-info-name">
          <span class="me-header-info-name-input" maxlength="8">{{ userInfo.name }}</span>
        </div>
        <div class="me-header-info-intro">
          {{ userInfo.intro }}
        </div>
      </div>
    </header>
    <div class="me-drawers">
      <div class="me-drawers-header">
        <div class="me-drawers-header-item">
          <span class="me-drawers-header-item-text">FaceAnalysis</span>
          <span class="me-drawers-header-item-number">{{ userInfo.faceScore }}</span>
        </div>
        <div class="me-drawers-header-item">
          <span class="me-drawers-header-item-text">Following</span>
          <span class="me-drawers-header-item-number">{{ following }}</span>
        </div>
        <div class="me-drawers-header-item">
          <span class="me-drawers-header-item-text">Followers</span>
          <span class="me-drawers-header-item-number">{{ followers }}</span>
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
import { mapState } from 'vuex';
export default {
  name: "Me",
  data() {
    return {
      list: [
        {
          icon: "el-icon-s-data",
          text: "My Face Data"
        },
        {
          icon: "el-icon-star-on",
          text: "Liked"
        },
        {
          icon: "el-icon-share",
          text: "Shared"
        },
        {
          icon:"el-icon-message-solid",
          text:"Messages"

        },
        {
          icon: "el-icon-s-tools",
          text: "Settings"
        },
        {
          icon: "el-icon-s-help",
          text: "Help"
        },
        {
          icon: "el-icon-s-release",
          text: "Feedback"
        },
        {
          icon: "el-icon-s-opportunity",
          text: "About"
        },
        {
          icon: "el-icon-s-ticket",
          text: "Tickets"
        }
      ]
    };
  },
  methods: {
  },
  mounted() {
    this.$store.dispatch('getUserInfo');
  },
  computed: {
    ...mapState({ userInfo: state => state.user.userInfo }),
    followers() {
      if (this.userInfo.followers > 1000) {
        return (this.userInfo.followers / 1000).toFixed(1) + 'K';
      } else {
        return this.userInfo.followers;
      }
    },
    following() {
      if (this.userInfo.following > 1000) {
        return (this.userInfo.following / 1000).toFixed(1) + 'K';
      } else {
        return this.userInfo.following;
      }
    },
  }
}
</script>

<style lang="less" scoped>
.me {
  overflow-x: hidden;
  box-sizing: border-box;

  &-header {
    position: fixed;
    height: 30vh;
    width: 100vw;
    background: linear-gradient(#F0E9FF, white);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: constant(safe-area-inset-top) 0rem;
    padding-bottom: 10rem;

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
        color: #A493FF;
        text-shadow: 1px 1px 0px #A493FF, 1px 0px 0px #A493FF, 0px 1px 0px #A493FF;
      }
    }

    &-info {

      user-select: none;
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      &-name {
        user-select: none;

        &-input {

          max-width: 12rem;
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
        margin-top: .5rem;
        margin: 1rem 4rem 0;
        font-size: 1rem;
        color: #5C5C5C;
        text-align: center;
      }
    }
  }

  &-drawers {
    position: relative;
    z-index: 0;
    margin-bottom: calc(env(safe-area-inset-bottom) + 4rem);
    background-color: #fff;
    border-radius: 20px 20px 0 0;
    margin-top: calc(30vh - constant(safe-area-inset-top) + constant(safe-area-inset-bottom));
    margin-top: calc(30vh - env(safe-area-inset-top) + env(safe-area-inset-bottom));
    padding: 0 2rem;
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
            color: #A493FF;
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