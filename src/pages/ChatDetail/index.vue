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
                    <MyImage :src="avatarUrl ?? defaultAvatar" alt="">
                        {{ username?.slice(0, 1) }}
                    </MyImage>
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
            @touchend="toTop" @click="isDrawer && showDrawer()">
            <div class="chat-detail-body-content" ref="chatDetailBody">
                <ChatItem v-for="chat in chatList" :key="chat.from_id + chat.time" :item="chat"></ChatItem>
            </div>
        </div>
        <form class="chat-footer" @submit.prevent="send" :style="{
            '--top': visualHeight + 'px'
        }" :class="{ drawer: isDrawer }">
            <div class="input">
                <input type="text" @focus="handleFocus" @blur="handleBlur" class="chat-footer-input"
                    place-holder="说点什么..." enterkeyhint="send" v-model="input" />
                <button class="chat-footer-button" @click="showDrawer" type="button">
                    <PlusIcon></PlusIcon>
                </button>
            </div>
            <Transition name="el-fade-in-linear" :duration="100">
                <div class="drawer" v-show="isDrawer">
                    <div class="drawer-item" @click="sendImage">
                        <i class="el-icon-picture"></i>
                    </div>
                </div>
            </Transition>
        </form>
    </div>
</template>

<script>
import ChatItem from "@/components/ChatItem.vue";
import { channel, emit, privateChannel, WebSocketType } from "@/ws";
import { mapGetters, mapState } from "vuex";
import defaultAvatar from "@/assets/images/0.png";
import MyImage from "@/components/MyImage.vue";
import pubsub from "@/utils/pubsub";
import PlusIcon from "@/icons/PlusIcon.vue";
export default {
    name: "ChatDetail",
    components: {
        ChatItem,
        MyImage,
        PlusIcon
    },
    data() {
        return {
            input: '',
            isFocus: false,
            visualHeight: window.innerHeight,
            defaultAvatar,
            isDrawer: false
        }
    },
    methods: {
        showDrawer() {
            this.isDrawer = !this.isDrawer;
        },
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
                this.toContentEnd();
            }, 100)
        },
        handleFocus() {
            this.isFocus = true;
            this.isDrawer = false;
        },
        handleBlur() {
            this.isFocus = false;
        },
        goBack() {
            this.$router.go(-1)
        },
        toContentEnd() {
            this.$nextTick(() => {
                setTimeout(() => {
                    if (this.$refs.chatDetailBody)
                        this.$refs.chatDetailBody.scrollTop = this.$refs.chatDetailBody.scrollHeight;
                }, 0);
            })
        },
        send() {
            if (!this.input.trim()) return
            const info = {
                message: this.input,
                to_id: this.id,
                from_id: this.token,
                avatarUrl: this.userInfo.avatarUrl,
                time: new Date().getTime(),
                username: this.userInfo.username,
                isSend: false
            };
            if (!this.id) {
                this.addGroupChat(info);
            } else {
                this.addUserChat(info)
            }
            emit(this.id ? WebSocketType.PrivateChat : WebSocketType.GroupChat, this.createMessage(this.token, this.id, this.input))
            this.input = ''
            this.toContentEnd()
        },
        sendImage() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = () => {
                const file = input.files[0];
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    const image = reader.result;
                    const info = {
                        type: 'image',
                        message: image,
                        to_id: this.id,
                        from_id: this.token,
                        avatarUrl: this.userInfo.avatarUrl,
                        time: new Date().getTime(),
                        username: this.userInfo.username,
                        isSend: false
                    };
                    emit(this.id ? WebSocketType.PrivateChat : WebSocketType.GroupChat, this.createMessage(this.token, this.id, image, 'image'));
                    this.toContentEnd();
                    if (!this.id) {
                        this.addGroupChat(info);
                    } else {
                        this.addUserChat(info)
                    }
                }
            }
            input.click();
        },
        addGroupChat(data) {
            this.$store.commit("ADDCHAT", data)
        },
        addUserChat(data) {
            this.$store.commit("ADDUSERCHAT", data)
        },
        createMessage(user, to, data, type = 'text', time = new Date().getTime()) {
            return {
                user,
                to,
                data,
                type,
                time
            }
        },
        prevent(e) {
            e.preventDefault();
            this.toTop();
        },
        bindEvent() {
            this.id ? this.bindPrivateEvent() : this.bindWorldEvent();
        },
        bindWorldEvent() {
            if (!channel) {
                setTimeout(this.bindWorldEvent, 100);
                return;
            }
            channel.bind(WebSocketType.GroupChat, (data) => {
                const index = this.chatList.findIndex(item => item.message === data.data && Math.abs(item.time - data.time) < 1000);
                let item = null;
                if (data.user.id === this.token && index !== -1) {
                    item = this.chatList[index];
                    item.isSend = true;
                } else {
                    item = {
                        type: data.type,
                        message: data.data,
                        from_id: data.user.id,
                        avatarUrl: data.user.avatarUrl,
                        username: data.user.username,
                        to_id: data.to,
                        time: data.time,
                        isSend: true
                    }
                }
                this.addGroupChat(item);
                this.$nextTick(() => {
                    this.toContentEnd();
                })
            })
        },
        bindPrivateEvent() {
            if (!privateChannel) {
                setTimeout(this.bindPrivateEvent, 100);
                return;
            }
            privateChannel.bind(WebSocketType.PrivateChat, data => {
                const index = this.chatList.findIndex(item => item.message === data.data && Math.abs(item.time - data.time) < 10);
                let item = null;
                if (data.user.id === this.token && index !== -1) {
                    item = this.chatList[index];
                    item.isSend = true;
                } else {
                    item = {
                        type: data.type,
                        message: data.data,
                        from_id: data.user.id,
                        avatarUrl: data.user.avatarUrl,
                        username: data.user.username,
                        to_id: data.to,
                        time: data.time,
                        isSend: true
                    }
                }
                console.log(item);

                this.addUserChat(item);
                this.$nextTick(() => {
                    this.toContentEnd()
                })
            })
        },
        unbindEvent() {
            this.id ? channel.unbind(WebSocketType.GroupChat) : privateChannel?.unbind(WebSocketType.PrivateChat);
        },
    },
    mounted() {
        window.addEventListener("touchmove", this.prevent, { passive: false });
        window.visualViewport.addEventListener("resize", this.getVisualHeight);
        this.toContentEnd();
        setTimeout(() => {
            pubsub.emit('chatDetail');
            this.bindEvent();
        })
    },
    beforeDestroy() {
        this.unbindEvent();
        window.removeEventListener('touchmove', this.prevent);
        window.visualViewport.removeEventListener("resize", this.getVisualHeight);
    },
    computed: {
        username() {
            return this.$route.params.username
        },
        avatarUrl() {
            return this.$route.params.avatarUrl
        },
        ...mapState({
            userInfo: state => state.user.userInfo,
            token: state => state.user.token
        }),
        ...mapGetters(['getChatList']),
        chatList() {
            return this.getChatList(this.id, this.token);
        },
        keyboardHeight() {
            return window.innerHeight - this.visualHeight;
        },
        id() {
            return this.$route.params.id;
        }
    },
    watch: {
        isDrawer(val) {
            const rem = parseInt(getComputedStyle(document.documentElement).fontSize);
            const height = (window.innerWidth - 2.5 * rem) / 2 + rem;
            if (val) {
                this.visualHeight -= height;
            } else {
                this.visualHeight += height;
            }
            setTimeout(this.toContentEnd, 150);
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
        z-index: 99;
        -webkit-overflow-scrolling: touch;
        transition: top .2s linear;

        &:focus-within {
            top: calc(var(--top, 100%) - 3.5rem);
            padding: 0.5rem !important;
        }

        .input {
            display: flex;
            align-items: center;
            gap: .5rem;

            .chat-footer-input {
                min-width: 0;
                flex: 1;
                height: 2.5rem;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
                outline: none;
                padding: .5rem;
                font-size: 1rem;
                border: none;
                color: @gray-6;
                background-color: @gray-1;
                border-radius: .5rem;
            }

            .chat-footer-button {
                height: 2rem;
                width: 2rem;
                background-color: transparent;
                border: none;
            }
        }

        .drawer {
            --width: calc((100vw - 2.5rem) / 4);
            margin-top: .5rem;
            display: grid;
            gap: .5rem;
            grid-template-columns: repeat(4, 1fr);
            grid-template-rows: repeat(2, 1fr);

            .drawer-item {
                display: flex;
                height: var(--width);
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: @gray-6;
                cursor: pointer;
                background-color: @gray-0;
                border-radius: 4px;

                i {
                    font-size: 1.2rem;
                }
            }
        }
    }
}
</style>