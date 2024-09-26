<template>
    <div class="chat-detail">
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
        <div class="chat-detail-body">
            <div class="chat-detail-body-content" ref="chatDetailBody">
                <div class="chat-detail-body-content-item" :class="{ reverse: chat.from_id == $store.state.user.token }"
                    v-for="chat in chatList" :key="chat.private_msg_id">
                    <div class="chat-detail-body-content-item-avatar">
                        <img :src="require(`@/assets/images/${chat.avatar_path ?? 0}.png`)" alt="">
                    </div>
                    <div>
                        <p class="chat-detail-body-content-item-nickname" v-if="chat.from_id != $store.state.user.token">
                        <span>
                            {{ chat.nickname }}
                        </span>
                    </p>
                        <p class="chat-detail-body-content-item-content">
                        <span>
                            {{ chat.message }}
                        </span>
                    </p>
                    </div>
                    
                </div>
            </div>
        </div>
        <div class="chat-footer">
            <input type="text" class="chat-footer-input" place-holder="说点什么..." v-model="input" />
            <button class="chat-footer-btn" @touchstart="send">发送</button>
        </div>
    </div>
</template>

<script>
import { WebSocketType, WebSocketPort } from "@/ws";
import io from "../Chat/js/socketio.js"
export default {
    name: "WorldDetail",
    data() {
        return {
            input: '',
            userInfo: {},
            chatList: [],
            io: null
        }
    },
    methods: {
        goBack() {
            this.$router.go(-1)
        },
        goPageEnd() {
            this.$nextTick(() => {
                setTimeout(() => {
                    if (this.$refs.chatDetailBody)
                        this.$refs.chatDetailBody.scrollTop = this.$refs.chatDetailBody.scrollHeight
                }, 0);
            })
        },
        send() {
            if (!this.input.trim()) return
            this.io.emit(WebSocketType.GroupChat, this.createMessage(this.$store.state.user.token, -1, this.input, new Date().getTime()))
            this.chatList.push({
                message: this.input,
                to_id: -1,
                from_id: this.$store.state.user.token,
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
        }
    },
    mounted() {
        this.$store.state.user.token ?? this.$store.dispatch('getUserInfo')
        this.io = io(`${WebSocketPort}?token=${this.$store.state.user.token}`);
        this.io.emit(WebSocketType.WorldList, this.createMessage(this.$store.state.user.token))
        this.io.on(WebSocketType.WorldList, (data) => {
            console.log(data.data)
            this.chatList = data.data
            this.$nextTick(() => {
                this.goPageEnd()
            })
        })
        this.io.on(WebSocketType.GroupChat, (data) => {
            console.log(data)
            this.chatList.push({
                message: data.data,
                from_id: data.user,
                avatar_path: data.avatar_path
            })
            this.$nextTick(() => {
                this.goPageEnd()
            })
        })

    },
    computed:{
        username(){
            return this.$route.params.username
        },
        avatar(){
            return this.$route.params.avatar
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


    .reverse {
        flex-direction: row-reverse !important;

        .chat-detail-body-content-item-content {
            background-color: @purple !important;
            color: #fff !important;
            margin-right: 0.5rem !important;
            margin-left: 0 !important;

            &::before {
                display: none;
            }

            &::after {
                position: absolute;
                right: 0;
                bottom: 0;
                content: '';
                width: 1rem;
                height: 1rem;
                background-color: @purple;
            }
        }
    }

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
        flex-direction: column;
        align-items: center;
        position: fixed;
        top: calc(constant(safe-area-inset-top) + 4rem);
        top: calc(env(safe-area-inset-top) + 4rem);
        height: calc(100vh - constant(safe-area-inset-top) - constant(safe-area-inset-bottom) - 3.5rem - 4rem);
        height: calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 3.5rem - 4rem);

        .chat-detail-body-content {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            overflow: scroll;
            padding-bottom: 1rem;

            .chat-detail-body-content-item {
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: flex-start;
                padding: 0 1rem;
                margin-top: .5rem;

                .chat-detail-body-content-item-avatar {
                    height: 2rem;
                    border-radius: 50%;
                    clip-path: circle(50% at 50% 50%);
                    align-self: flex-end;

                    img {
                        height: 100%;
                    }
                }

                .chat-detail-body-content-item-nickname {
                    max-width: 60vw;
    white-space: nowrap;
    margin: 1rem .5rem;
    overflow: hidden;
    text-overflow: ellipsis;
    color: grey;
    font-size: .8rem;
                }

                .chat-detail-body-content-item-content {
                    margin-left: 0.5rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: flex-start;
                    flex: 0.01 fit-content;
                    padding: 0.5rem 1rem;
                    line-height: 1.5;
                    background-color: @lightPurple;
                    border-radius: 1rem;
                    position: relative;
                    width: fit-content;
                    word-wrap: normal;
                    word-break: break-all;

                    &::before {
                        position: absolute;
                        left: 0;
                        bottom: 0;
                        content: '';
                        width: 1rem;
                        height: 1rem;
                        background-color: @lightPurple;
                    }
                }
            }
        }
    }

    .chat-footer {
        width: 100%;
        position: fixed;
        bottom: 0;
        left: 0;
        background-color: #fff;
        border-top: 1px solid #eee;
        padding: 0.5rem;
        padding-bottom: calc(constant(safe-area-inset-bottom) + 0.5rem);
        padding-bottom: calc(env(safe-area-inset-bottom) + 0.5rem);
        display: flex;
        gap: .5rem;
        z-index: 9999999999999;

        &:focus-within {
            padding: 0.5rem !important;
            bottom: 0;
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

        &-btn {
            height: 2.5rem;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            outline: none;
            padding: .5rem .75rem;
            font-size: 1rem;
            white-space: nowrap;
            width: max-content;
            border: none;
            color: #fff;
            background-color: @purple;
            border-radius: .5rem;
        }
    }
}
</style>