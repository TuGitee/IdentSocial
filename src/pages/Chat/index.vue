<template>
  <div id="root" class="chat">
    <header class="chat-header">
      <h1 class="title">
        <i class="el-icon-chat-round"></i>在线聊天
      </h1>
      <button class="refresh" @click="getUserList">
        <i class="el-icon-refresh" :class="{ active: isSend }"></i>
      </button>
    </header>
    <div class="chat-body">
      <ul class="chat-body-list">
        <template v-if="userLists.length">
          <ChatUserItem @click="user.unread = 0" class="chat-body-list-item" v-for="user in userLists" :item="user"
            :key="user.id">
          </ChatUserItem>
        </template>
        <LoadingIcon v-else-if="isSend" class="loading"></LoadingIcon>
        <el-empty v-else description="暂无联系人"></el-empty>
      </ul>
    </div>
  </div>
</template>

<script>
import "@/css/user.less"
import { WebSocketType, channel, emit, privateChannel } from "@/ws";
import { mapState } from "vuex";
import ChatUserItem from "./ChatUserItem/index.vue";
import LoadingIcon from "@/icons/LoadingIcon.vue";

export default {
  name: "ChatPage",
  components: { ChatUserItem, LoadingIcon },
  data() {
    return {
      userLists: [],
      io: null,
      isSend: false
    };
  },
  computed: {
    ...mapState({
      token: state => state.user.token,
      userInfo: state => state.user.userInfo
    })
  },
  methods: {
    createMessage(user, data, avatarUrl, id, time) {
      return {
        user,
        data,
        avatarUrl,
        id,
        time
      }
    },
    bindEvent() {
      this.bindGroupEvent();
      this.bindPrivateEvent();
    },
    bindGroupEvent() {
      channel.bind(WebSocketType.GroupChat, (data) => {
        const item = {
          message: data.data,
          from_id: data.user.id,
          avatarUrl: data.user.avatarUrl,
          username: data.user.username,
          to_id: data.to,
          time: data.time,
          isSend: true
        }
        this.addGroupChat(item);
        if (this.token === data.user.id) return;
        if (this.$route.name === 'ChatDetail' && !this.$route.params.id) return;
        const user = this.userLists.find((item) => item.id == data.to);
        user && user.unread++;
      })
    },
    bindPrivateEvent() {
      if (!privateChannel) {
        setTimeout(() => {
          this.bindPrivateEvent()
        }, 100);
        return
      }
      privateChannel.bind(WebSocketType.PrivateChat, (data) => {
        const item = {
          message: data.data,
          from_id: data.user.id,
          avatarUrl: data.user.avatarUrl,
          username: data.user.username,
          to_id: data.to.id,
          time: data.time,
          isSend: true
        }
        this.addUserChat(item);
        if (this.token === data.user.id) return;
        if (this.$route.params.id !== data.user.id) {
          const user = this.userLists.find((item) => item.id == data.user.id);
          user && user.unread++;
        }
      })
    },
    addGroupChat(data) {
      this.$store.commit("ADDCHAT", data)
    },
    addUserChat(data) {
      this.$store.commit("ADDUSERCHAT", data)
    },
    unbindEvent() {
      channel.unbind(WebSocketType.GroupChat)
      privateChannel.unbind(WebSocketType.PrivateChat)
    },
    setUserList(data) {
      const userList = data.data;
      this.isSend = false;
      for (let i = 0; i < this.userLists.length; i++) {
        const user = this.userLists[i];
        if (!userList.find(item => item.id == user.id)) {
          this.userLists.splice(i, 1)
          i--;
        }
      }
      for (let i = 0; i < userList.length; i++) {
        const user = userList[i];
        if (!this.userLists.find(item => item.id == user.id)) {
          this.userLists.push(user)
        }
      }
    },
    getUserList(e) {
      if (this.isSend) return;
      if (!e || window.scrollY <= 0) {
        clearTimeout(this.timer);
        this.timer = null;
        this.isSend = true;
        emit(WebSocketType.GroupList, this.createMessage(this.token, "你好", '', this.token, new Date().getTime()));
        this.timer = setTimeout(() => {
          this.isSend = false;
        }, 5000);
      }
    }
  },
  mounted() {
    this.bindEvent();
  },
  activated() {
    channel.bind(WebSocketType.Disconnet, this.setUserList);
    channel.bind(WebSocketType.GroupList, this.setUserList);
    this.getUserList();
  },
  deactivated() {
    channel.unbind(WebSocketType.GroupList);
    channel.unbind(WebSocketType.Disconnet);
  }
};
</script>

<style lang="less" scoped>
.chat {
  .chat-header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;

    .title {
      color: transparent;
      width: fit-content;
      background: linear-gradient(45deg, @purple, @pink);
      -webkit-background-clip: text;

      i {
        margin-right: 0.5rem;
        background: linear-gradient(45deg, @purple, @pink);
        -webkit-background-clip: text;
      }
    }

    .refresh {
      font-size: 1.5rem;
      border: none;
      background-color: transparent;
      color: @purple;

      i {
        transition: .1s;

        &.active {
          animation: rotate 3s linear infinite;

          @keyframes rotate {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(-360deg);
            }
          }
        }
      }
    }
  }

  .chat-body {
    padding-bottom: 2rem;

    .chat-body-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .loading {
        margin: 7.5rem auto;
      }
    }
  }
}
</style>