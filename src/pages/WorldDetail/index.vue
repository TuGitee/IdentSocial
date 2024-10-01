<template>
    <div class="chat-detail" :style="{
        height: visualHeight + 'px'
    }">
        <div class="chat-detail-header">
            <div class="chat-detail-header-icon" @click="goBack">
                <i class="el-icon-arrow-left"></i>
            </div>
            <div class="chat-detail-header-icon">
                <div class="chat-detail-header-icon-img">
                    <img :src="require(`@/assets/images/${avatar ?? 0}.png`)" alt="">
                </div>
                <div class="chat-detail-header-icon-name">
                    <span>{{ username }}</span>
                </div>
            </div>
            <div class="chat-detail-header-more">
                <i class="el-icon-more"></i>
            </div>
        </div>
        <div class="chat-detail-body" :class="{ focus: isFocus, disabled: !chatList.length }"
            :style="{ '--height': visualHeight + 'px' }" ref="chatDetail" @touchmove.passive="handleBody"
            @touchend="toTop">
            <div class="chat-detail-body-content" ref="chatDetailBody">
                <ChatItem v-for="chat in chatList" :key="chat.id" :item="chat"></ChatItem>
            </div>
        </div>
        <form class="chat-footer" @submit.prevent="send" :style="{
            '--top': visualHeight + 'px'
        }">
            <input type="text" @focus="handleFocus" @blur="handleBlur" class="chat-footer-input" place-holder="说点什么..."
                v-model="input" />
        </form>
    </div>
</template>

<script>
import ChatItem from "@/components/ChatItem.vue";
import { channel, emit, WebSocketType } from "@/ws";
import { mapState } from "vuex";
export default {
    name: "WorldDetail",
    components: {
        ChatItem
    },
    data() {
        return {
            input: '',
            isFocus: false,
            visualHeight: window.innerHeight
        }
    },
    methods: {
        toTop() {
            scrollTo(0, 0);
        },
        handleBody(e) {
            const outerHeight = this.$refs.chatDetailBody.offsetHeight;
            const innerHeight = Array.from(this.$refs.chatDetailBody.children).reduce((p, c) => p + c.offsetHeight + 8, 0);
            if (innerHeight >= outerHeight) {
                e.stopPropagation();
            }
            this.toTop();
        },
        getVisualHeight() {
            setTimeout(() => {
                this.visualHeight = window.visualViewport.height;
                this.toTop();
                this.goPageEnd();
            }, 100)
        },
        handleFocus() {
            this.isFocus = true;
            this.getVisualHeight();
        },
        handleBlur() {
            this.isFocus = false;
            this.getVisualHeight();
        },
        goBack() {
            this.$router.go(-1)
        },
        goPageEnd() {
            this.$nextTick(() => {
                setTimeout(() => {
                    if (this.$refs.chatDetailBody)
                        this.$refs.chatDetailBody.scrollTop = this.$refs.chatDetailBody.scrollHeight;
                }, 0);
            })
        },
        send() {
            if (!this.input.trim()) return
            emit(WebSocketType.GroupChat, this.createMessage(this.token, this.$route.params.id, this.input, new Date().getTime()))
            this.$store.commit("ADDCHAT", {
                message: this.input,
                to_id: -1,
                from_id: this.token,
                avatar: this.userInfo.avatar,
                time: new Date().getTime(),
                nickname: this.userInfo.nickname,
                isSend: false
            })
            this.input = ''
            this.goPageEnd()
        },
        createMessage(user, to, data, time) {
            return {
                user,
                to,
                data,
                time
            }
        },
        prevent(e) {
            e.preventDefault();
            this.toTop();
        }
    },
    mounted() {
        window.addEventListener("touchmove", this.prevent, { passive: false });
        this.goPageEnd();
        channel.bind(WebSocketType.GroupChat, (data) => {
            const index = this.chatList.findIndex(item => item.message === data.data && Math.abs(item.time - data.time) < 10);
            let item = null;
            if (data.user.id === this.token && index !== -1) {
                item = this.chatList.splice(index, 1).pop();
                item.isSend = true;
            } else {
                item = {
                    message: data.data,
                    from_id: data.user.id,
                    avatar: data.user.avatar,
                    nickname: data.user.nickname,
                    to_id: data.to,
                    time: data.time,
                    isSend: true
                }
            }
            this.$store.commit("ADDCHAT", item);
            this.$nextTick(() => {
                this.goPageEnd()
            })
        })
    },
    beforeDestroy() {
        channel.unbind(WebSocketType.GroupChat);
        window.removeEventListener('touchmove', this.prevent);
    },
    computed: {
        username() {
            return this.$route.params.username
        },
        avatar() {
            return this.$route.params.avatar
        },
        ...mapState({
            userInfo: state => state.user.userInfo,
            token: state => state.user.token,
            chatList: state => state.chat.chatList
        }),
        keyboardHeight() {
            return window.innerHeight - this.visualHeight;
        }
    }
}
</script>

<style lang="less" scoped>
.chat-detail {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: constant(safe-area-inset-top) 0 constant(safe-area-inset-bottom);
    padding: env(safe-area-inset-top) 0 env(safe-area-inset-bottom);

    .chat-detail-header {
        padding: 1rem 1.5rem;
        display: flex;
        flex-direction: row;
        width: 100vw;
        justify-content: space-between;
        align-items: center;
        position: fixed;
        top: constant(safe-area-inset-top);
        top: env(safe-area-inset-top);

        &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100vw;
            height: 1px;
            background-color: #ebebeb;

        }

        .chat-detail-header-icon {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;

            .chat-detail-header-icon-img {
                width: 2rem;
                height: 2rem;
                border-radius: 50%;
                overflow: hidden;

                img {
                    width: 100%;
                    height: 100%;
                }
            }

            .chat-detail-header-icon-name {
                margin-left: 0.5rem;
                font-size: 1.1rem;
                font-weight: 600;
                max-width: 15rem;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }

        .chat-detail-header-more {
            transform: rotate(90deg);
            color: @purple;
        }
    }

    .chat-detail-body {
        width: 100%;
        display: flex;
        min-height: 0;
        overflow: scroll;
        flex-direction: column;
        align-items: center;
        position: fixed;
        top: calc(constant(safe-area-inset-top) + 4rem);
        top: calc(env(safe-area-inset-top) + 4rem);
        height: calc(var(--height, 100%) - constant(safe-area-inset-top) - constant(safe-area-inset-bottom) - 3.5rem - 4rem);
        height: calc(var(--height, 100%) - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 3.5rem - 4rem);

        &.focus {
            height: calc(var(--height, 100%) - 7.5rem - constant(safe-area-inset-top));
            height: calc(var(--height, 100%) - 7.5rem - env(safe-area-inset-top));
        }

        &.disabled {
            -webkit-overflow-scrolling: touch;
        }

        .chat-detail-body-content {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            overflow: scroll;
            padding-bottom: 1rem;
        }
    }

    .chat-footer {
        width: 100%;
        position: fixed;
        left: 0;
        background-color: #fff;
        border-top: 1px solid #eee;
        padding: 0.5rem;
        top: calc(var(--top, 100%) - constant(safe-area-inset-bottom) - 3.5rem);
        top: calc(var(--top, 100%) - env(safe-area-inset-bottom) - 3.5rem);
        padding-bottom: calc(constant(safe-area-inset-bottom) + 0.5rem);
        padding-bottom: calc(env(safe-area-inset-bottom) + 0.5rem);
        display: flex;
        gap: .5rem;
        z-index: 9999999999999;
        -webkit-overflow-scrolling: touch;

        &:focus-within {
            top: calc(var(--top, 100%) - 3.5rem);
            padding: 0.5rem !important;
        }

        &-input {
            width: 100%;
            height: 2.5rem;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            outline: none;
            padding: .5rem;
            font-size: 1rem;
            border: none;
            color: #666;
            background-color: #eee;
            border-radius: .5rem;
        }
    }
}
</style>