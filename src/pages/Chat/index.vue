<template>
  <div id="root" class="chat">
    <div class="chat-header">
      <div class="chat-header-icon">
        <i class="el-icon-user-solid"></i>
        <i class="el-icon-user-solid after"></i>
        <span class="chat-header-icon-title">联系人</span>
      </div>
      <div class="chat-header-icon">
        <i class="el-icon-s-grid"></i>
        <i class="el-icon-s-grid after"></i>
        <span class="chat-header-icon-title">应用</span>
      </div>
    </div>
    <div class="chat-body">
      <ul class="chat-body-list">
        <li class="chat-body-list-item" @click="toChat(item.id, item.username, item.avatar)" v-for="(item) in userLists" :key="item.id">
          <div class="chat-body-list-item-avatar">
            <img :src="require(`@/assets/images/${item.avatar ?? 0}.png`)" alt="" />
          </div>
          <div class="chat-body-list-item-content">
            <div class="chat-body-list-item-content-title">
              <span class="chat-body-list-item-content-title-name">{{ item.username }}</span>
            </div>
            <div class="chat-body-list-item-content-desc">
              <span class="chat-body-list-item-content-desc-text">{{ item.last }}</span><span
                class="chat-body-list-item-content-desc-text divide">·</span><span
                class="chat-body-list-item-content-desc-text">{{ formatTime(item.time)}}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import "@/css/user.less"
import { WebSocketType, WebSocketPort } from "@/ws";
import io from "./js/socketio.js"
export default {
  name: "Chat",
  data() {
    return {
      userLists: [],
      io: null
    };
  },
  methods: {
    createMessage(user, data, avatar, id, time) {
      return {
        user,
        data,
        avatar,
        id,
        time
      }
    },
    toChat(id,username,avatar) {
      if (id == -1) {
        this.$router.push({
          name: "WorldDetail",
          params: {
            username,
            avatar
          }
        })
      }
      else {
        this.$router.push({
          name: "ChatDetail",
          params: {
            cid: id,
            username,
            avatar
          }
        })
      }
    },
    formatTime(time) {
      const t = new Date(time)
      return `${t.getFullYear()}-${t.getMonth() + 1}-${t.getDate()} ${t.getHours() < 10 ? '0' + t.getHours() : t.getHours()}:${t.getMinutes() < 10 ? '0' + t.getMinutes() : t.getMinutes()}:${t.getSeconds() < 10 ? '0' + t.getSeconds() : t.getSeconds()}`;
    }
  },
  mounted() {
    if(!this.io)
    this.io = io(`${WebSocketPort}?token=${this.$store.state.user.token}`);

    this.io.emit(WebSocketType.GroupList, this.createMessage(this.$store.state.user.token, "你好", '', this.$store.state.user.token, new Date().getTime()))

    this.io.on(WebSocketType.GroupList, (data) => {
      console.log(data)
      this.userLists = data.data
    })
    
    this.io.on(WebSocketType.System, (data) => {
      console.log(data)
    })
  },
  beforeDestroy() {
    this.io.off(WebSocketType.GroupList)
    this.io.off(WebSocketType.System)
  }
};
</script>

<style lang="less" scoped>
.chat {
  .chat-header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5rem;
    padding: 2rem;

    .chat-header-icon {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      flex-direction: column;
      cursor: pointer;
      gap: .5rem;

      i {
        font-size: 3rem;

        color: aliceblue;
      }

      .after {
        position: absolute;
        font-size: 3rem;
        top: -2px;
        left: -2px;
        color: @lightPurple;
      }
    }

  }

  .chat-body {
    padding-bottom: 2rem;

    .chat-body-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .chat-body-list-item {
        width: 100%;
        height: 3.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;

        .chat-body-list-item-avatar {
          width: 3.5rem;
          height: 3.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .chat-body-list-item-content {
          width: calc(100% - 7rem);
          height: 100%;
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: .5rem;

          .chat-body-list-item-content-title {
            width: 100%;
            height: 1.1rem;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .chat-body-list-item-content-title-name {
              font-size: 1.1rem;
              font-weight: bold;
              max-width: 12rem;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .chat-body-list-item-content-title-time {
              font-size: 1rem;
            }
          }

          .chat-body-list-item-content-desc {
            width: 100%;
            height: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: flex-start;

            .chat-body-list-item-content-desc-text {
              font-size: 1rem;
              color: grey;
              white-space: nowrap;
              width: min-content;

              &.divide {
                margin: 0 .3rem;
              }

              &:last-child {
                width: fit-content;
                max-width: max-content;
              }
            }
          }
        }
      }
    }
  }
}
</style>