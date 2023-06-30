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
        <li class="chat-body-list-item" @click="toChat(item.id)" v-for="(item) in userLists" :key="item.id">
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
                class="chat-body-list-item-content-desc-text">2021-08-08</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import "@/css/user.less"
import { WebSocketType } from "@/ws";
export default {
  name: "Chat",
  data() {
    return {
      userLists: []
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
    toChat(id) {
      console.log(id);
      if (id == -1) {
        this.$router.push({
          name: "WorldDetail"
        })
      }
      else {
        this.$router.push({
          name: "ChatDetail",
          params: {
            cid: id
          }
        })
      }
    }
  },
  mounted() {
    this.$ws.emit(WebSocketType.GroupList, this.createMessage(this.$store.state.user.token, "你好", '', this.$store.state.user.token, new Date().getTime()))
    this.$ws.on(WebSocketType.GroupList, (data) => {
      console.log(data)
      this.userLists = data.data
    })
    this.$ws.on(WebSocketType.System, (data) => {
      console.log(data)
    })
  },
  beforeDestroy() {
    this.$ws.off(WebSocketType.GroupList)
    this.$ws.off(WebSocketType.System)
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
          width: 100%;
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

              &.divide {
                margin: 0 .3rem;
              }
            }
          }
        }
      }
    }
  }
}
</style>