<template>
    <div class="chat-item" :class="{ reverse: item.from_id === token }">
        <div class="chat-item-avatar">
            <router-link :to="{
                name: 'ChatDetail',
                params: {
                    id: item.from_id,
                    username: item.username,
                    avatarUrl: item.avatarUrl
                }
            }" v-if="!nextItem || nextItem.from_id !== item.from_id || nextItem.time - item.time > 5 * 60 * 1000">
                <MyImage :src="item.avatarUrl" alt="">
                    {{ item.username?.slice(0, 1) || '未' }}
                </MyImage>
            </router-link>
        </div>
        <div class="chat-item-info">
            <p class="chat-item-username"
                v-if="!prevItem || prevItem.from_id !== item.from_id || item.time - prevItem.time > 5 * 60 * 1000">
                <span>
                    {{ item.username || '未知用户' }}
                </span>
                <time>{{ formatTime(item.time) }}</time>
            </p>
            <div class="chat-item-box"
                :class="{ prev: nextItem && nextItem.from_id === item.from_id && nextItem.time - item.time < 5 * 60 * 1000 }">
                <i class="el-icon-loading" v-if="!item.isSend"></i>
                <img class="chat-item-content image" v-if="item.type === 'image'" :src="item.message"
                    :preview="item.to_id ?? 'world'">
                <audio class="chat-item-content voice" type="audio/mpeg" :src="item.message"
                    v-else-if="item.type === 'voice'" controls="controls"></audio>
                <p class="chat-item-content" v-else>
                    {{ item.message }}
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import formatTime from '@/utils/time';
import { mapState } from 'vuex';
import MyImage from './MyImage.vue';

export default {
    name: 'ChatItem',
    components: {
        MyImage
    },
    props: {
        item: {
            type: Object,
            default: () => ({})
        },
        prevItem: {
            type: Object,
            default: () => ({})
        },
        nextItem: {
            type: Object,
            default: () => ({})
        }
    },
    computed: {
        ...mapState({
            token: state => state.user.token
        })
    },
    methods: {
        formatTime
    },
    mounted() {
        this.$nextTick(() => {
            this.$previewRefresh();
        })
    }
}
</script>

<style scoped lang="less">
.chat-item {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 0 1rem;
    margin-top: .5rem;

    &.reverse {
        flex-direction: row-reverse;
        text-align: right;

        .chat-item-username {
            margin-left: auto;
        }

        .chat-item-box {
            justify-content: flex-end;
            flex-direction: row;

            i {
                order: 0;
            }

            .chat-item-content {
                background-color: @purple;
                color: @white;
                margin-right: 0.5rem;
                border-bottom-right-radius: 0;
                border-bottom-left-radius: 1rem;
            }
        }
    }

    .chat-item-avatar {
        height: 2.4rem;
        width: 2.4rem;
        border-radius: 50%;
        clip-path: circle(50% at 50% 50%);
        align-self: flex-end;

        img {
            height: 100%;
            width: 100%;
        }
    }

    .chat-item-info {
        flex: 1;
        min-width: 0;
    }

    .chat-item-box {
        display: flex;
        align-items: flex-end;
        margin-right: auto;
        user-select: none;

        i {
            order: 1;
        }

        &.prev {
            .chat-item-content {
                border-radius: 1rem;
            }
        }

        .chat-item-content {
            margin-left: 0.5rem;
            margin-right: .5rem;
            user-select: text;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            min-width: 0;
            padding: 0.5rem .8rem;
            line-height: 1.5;
            background-color: @lightPurple;
            border-radius: 1rem;
            position: relative;
            width: fit-content;
            word-wrap: normal;
            word-break: break-all;
            max-width: 70%;
            border-bottom-left-radius: 0;
            transition: all .2s;

            &.image {
                background-color: transparent;
                padding: 0;
                border-radius: 8px;
                margin-top: 4px;
            }

            &.voice {
                background-color: transparent;
                padding: 0;
                margin-top: 4px;
                width: 100%;
            }
        }
    }

    .chat-item-username {
        max-width: 70%;
        user-select: none;
        white-space: nowrap;
        margin: 4px 0.5rem;
        overflow: hidden;
        text-overflow: ellipsis;
        color: @gray-5;
        font-size: .8rem;
        font-weight: bold;

        time {
            font-size: .6rem;
            color: @gray-3;
            font-weight: normal;
        }
    }
}
</style>