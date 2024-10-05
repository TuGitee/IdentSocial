<template>
    <div class="user-chat-item" @click="toChat(item.id, item.username, item.avatarUrl)">
        <div class="user-chat-item-avatar">
            <MyImage :src="item.avatarUrl ?? defaultAvatar" alt="">{{ item.username?.slice(0, 1) }}</MyImage>
        </div>
        <div class="user-chat-item-content">
            <div class="user-chat-item-content-title">
                <span class="user-chat-item-content-title-name">{{ item.username }}</span>
            </div>
            <div class="user-chat-item-content-desc">
                <span class="user-chat-item-content-desc-text">
                    <b v-if="!item.to">{{ lastMessage?.username }}</b>
                    {{ lastMessage?.message || "快来开始聊天吧！" }}
                </span>
                <span class="user-chat-item-content-desc-text divide">·</span>
                <span class="user-chat-item-content-desc-text">{{ formatTime(lastMessage?.time) }}</span>
            </div>
        </div>
        <div class="user-chat-item-count" v-if="item.unread">
            <b>{{ formatNum(item?.unread) }}</b>
        </div>
    </div>
</template>

<script>
import formatTime from "@/utils/time.js";
import MyImage from "@/components/MyImage.vue";
import defaultAvatar from "@/assets/images/0.png";
import { mapGetters, mapState } from "vuex";

export default {
    name: "ChatUserItem",
    components: { MyImage },
    data() {
        return {
            defaultAvatar
        }
    },
    props: {
        item: {
            type: Object,
            default: () => ({})
        },
        avatarUrl: {
            type: String,
            default: ""
        }
    },
    computed: {
        ...mapGetters(["last"]),
        lastMessage() {
            return this.last(this.item.id, this.token)
        },
        ...mapState({
            token: state => state.user.token
        })
    },
    methods: {
        formatTime,
        toChat(id, username, avatarUrl) {
            this.$emit('click', id);
            this.$router.push({
                name: "ChatDetail",
                params: {
                    id,
                    username,
                    avatarUrl
                }
            })
        },
        formatNum(num) {
            return num > 99 ? '99+' : num;
        }
    }
}

</script>

<style scoped lang="less">
.user-chat-item {
    width: 100%;
    height: 3.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding-left: .5rem;

    .user-chat-item-avatar {
        width: 3rem;
        height: 3rem;
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

    .user-chat-item-content {
        width: calc(100% - 7rem);
        height: 100%;
        flex: 1;
        min-width: 0;
        display: flex;
        justify-content: center;
        flex-direction: column;
        gap: 4px;

        .user-chat-item-content-title {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .user-chat-item-content-title-name {
                font-size: 1.08rem;
                font-weight: bold;
                max-width: 12rem;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }

        .user-chat-item-content-desc {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            overflow: hidden;
            text-overflow: ellipsis;

            .user-chat-item-content-desc-text {
                font-size: 1rem;
                color: @gray-4;
                white-space: nowrap;
                width: min-content;

                &:first-child {
                    width: fit-content;
                    min-width: 0;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

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

    .user-chat-item-count {

        b {
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: @red;
            height: 1rem;
            min-width: .6rem;
            padding: 0 .2rem;
            box-sizing: content-box;
            font-size: .8rem;
            color: @white;
            border-radius: 9999px;
        }
    }
}
</style>