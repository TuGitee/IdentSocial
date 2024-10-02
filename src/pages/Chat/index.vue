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
        <ChatUserItem @click="user.unread = 0" class="chat-body-list-item" v-for="user in userLists" :item="user"
          :key="user.id">
        </ChatUserItem>
      </ul>
    </div>
  </div>
</template>

<script>
import "@/css/user.less"
import { WebSocketType, channel, emit, privateChannel } from "@/ws";
import { mapState } from "vuex";
import ChatUserItem from "./ChatUserItem/index.vue";

export default {
  name: "ChatPage",
  components: { ChatUserItem },
  data() {
    return {
      userLists: [],
      io: null,
    };
  },
  computed: {
    ...mapState({
      token: state => state.user.token,
      userInfo: state => state.user.userInfo
    })
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
    bindEvent() {
      this.bindGroupEvent();
      this.bindPrivateEvent();
    },
    bindGroupEvent() {
      channel.bind(WebSocketType.GroupChat, (data) => {
        const item = {
          message: data.data,
          from_id: data.user.id,
          avatar: data.user.avatar,
          nickname: data.user.nickname,
          to_id: data.to,
          time: data.time,
          isSend: true
        }
        this.userLists.find((item) => item.id == data.to).unread++;
        this.addGroupChat(item)
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
          avatar: data.user.avatar,
          nickname: data.user.nickname,
          to_id: data.to.id,
          time: data.time,
          isSend: true
        }
        this.userLists.find((item) => item.id == data.user.id).unread++;
        this.addUserChat(item)
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
    }
  },
  mounted() {
    channel.bind(WebSocketType.Disconnet, this.setUserList);
    channel.bind(WebSocketType.GroupList, this.setUserList)
    this.bindEvent();
    emit(WebSocketType.GroupList, this.createMessage(this.token, "你好", '', this.$store.state.user.token, new Date().getTime()));
  },
  beforeDestroy() {
    channel.unbind(WebSocketType.GroupList);
    channel.unbind(WebSocketType.Disconnet);
    this.unbindEvent();
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
    }
  }
}
</style>