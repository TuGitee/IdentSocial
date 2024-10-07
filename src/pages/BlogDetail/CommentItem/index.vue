<template>
    <div class="comment-item">
        <div class="comment-item-left">
            <router-link :to="`/user-detail/${comment.uid}`">
                <img :src="comment.user.avatarUrl" alt="">
            </router-link>
        </div>
        <div class="comment-item-right">
            <div class="comment-item-right-top">
                <router-link :to="`/user-detail/${comment.uid}`">
                    <span class="comment-item-right-top-name">{{ comment.user.username }}</span>
                </router-link>
            </div>
            <div class="comment-item-right-bottom">
                <p class="comment-item-right-bottom-text" @click="emitTarget(comment, $event.target)" ref="text">
                    {{ comment.text }}
                </p>
                <p class="comment-item-right-bottom-time">
                    <b @click="emitTarget(comment, $refs.text)">回复</b>
                    <time>{{ formatTime(comment.time) }}</time>
                    <i class="el-icon-delete" @click="deleteComment(comment.id)"></i>
                </p>
                <ul class="comment-item-right-bottom-list">
                    <li class="comment-item-right-bottom-list-item" v-for="c in comment.children?.slice(0, sliceNum)"
                        :key="c.id">
                        <div class="comment-item-right-bottom-list-item-left">
                            <router-link :to="`/user-detail/${c.uid}`">
                                <img :src="c.user.avatarUrl" alt="">
                            </router-link>
                        </div>
                        <div class="comment-item-right-bottom-list-item-right">
                            <div class="comment-item-right-bottom-list-item-right-top">
                                <p class="comment-item-right-bottom-list-item-right-top-name">
                                    <router-link :to="`/user-detail/${c.uid}`">
                                        <span class="comment-item-right-bottom-list-item-right-top-name">
                                            {{
                                                c.user.username
                                            }}
                                        </span>
                                    </router-link>
                                    <span style="margin:0 .3rem;color: #ccc;"
                                        v-if="c.cid !== comment.id">回复给</span><router-link :to="`/user-detail/${c.pid}`"
                                        v-if="c.cid !== comment.id">
                                        <span class="comment-item-right-bottom-list-item-right-top-name">
                                            {{
                                                c.puser.username
                                            }}
                                        </span>
                                    </router-link>
                                </p>
                            </div>
                            <div class="comment-item-right-bottom-list-item-right-bottom"
                                @click.stop="emitTarget(c, $event.target)">
                                <p class="comment-item-right-bottom-list-item-right-bottom-text">{{ c.text
                                    }}</p>
                                <p class="comment-item-right-bottom-list-item-right-bottom-time">
                                    <b>回复</b>
                                    <time @click.stop>{{ c.time }}</time>
                                    <i class="el-icon-delete" @click.stop="deleteComment(c.id)"></i>
                                </p>
                            </div>
                        </div>
                    </li>
                </ul>
                <div class="comment-item-right-more" @click="moreComment"
                    v-if="comment.children && comment.children?.length > sliceNum"><i
                        class="el-icon-caret-right"></i>点击查看更多评论</div>
                <div class="comment-item-right-more" @click="lessComment"
                    v-else-if="comment.children && comment.children.length !== 1"><i
                        class="el-icon-caret-top"></i>点击折叠评论
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import pubsub from '@/utils/pubsub';
import formatTime from '@/utils/time';

export default {
    name: "CommentItem",
    props: {
        comment: {
            type: Object,
            default() {
                return {}
            }
        },
        userList: {
            type: Array,
            default() {
                return []
            }
        }
    },
    data() {
        return {
            sliceNum: 1
        }
    },
    methods: {
        emitTarget(comment, el) {
            this.$emit('click', comment, this.comment.id, el);
        },
        moreComment() {
            this.sliceNum = this.sliceNum + 3
        },
        lessComment() {
            this.sliceNum = 1
        },
        formatTime,
        deleteComment(id) {
            this.$confirm('确定删除该评论?', '提示').then(() => {
                // this.$store.dispatch("deleteComment", id);
            }).catch(() => { })
        }
    },
    mounted() {
        pubsub.on(`comment:${this.comment.id}`, () => {
            this.sliceNum += 1;
        })
    },
    beforeDestroy() {
        pubsub.off(`comment:${this.comment.id}`)
    }
}
</script>

<style lang="less" scoped>
.comment-item {
    display: flex;
    padding: 12px 10px 16px;

    &:not(:last-child) {
        border-bottom: 1px solid #eee;
    }

    .comment-item-left {
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        overflow: hidden;

        img {
            width: 100%;
            height: 100%;
        }
    }

    .comment-item-right {
        flex: 1;
        padding-left: .8rem;
        min-width: 0;

        &-more {
            margin-top: 5px;
            font-size: 0.8rem;
            color: #999;

            i {
                font-size: 0.8rem;
                color: #999;
                margin-right: .3rem;
            }
        }

        .comment-item-right-top {
            display: flex;
            justify-content: space-between;
            align-items: center;

            &>a {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                flex: 1;
                max-width: 10rem;

                .comment-item-right-top-name {
                    font-size: 1rem;
                    color: #333;
                    font-weight: 700;
                }
            }


            .comment-item-right-top-time {
                font-size: 0.8rem;
                color: #999;
            }
        }

        .comment-item-right-bottom {
            margin-top: 5px;

            .comment-item-right-bottom-text {
                font-size: 1rem;
                color: #333;
            }

            .comment-item-right-bottom-time {
                margin-top: 5px;
                font-size: 0.8rem;
                color: #999;

                * {
                    margin-right: .5rem;
                }
            }

            .comment-item-right-bottom-list {
                margin-top: 5px;

                .comment-item-right-bottom-list-item {
                    display: flex;
                    padding: 12px 0 6px;

                    .comment-item-right-bottom-list-item-left {
                        width: 2rem;
                        height: 2rem;
                        border-radius: 50%;
                        overflow: hidden;

                        img {
                            width: 100%;
                            height: 100%;
                        }
                    }

                    .comment-item-right-bottom-list-item-right {
                        flex: 1;
                        min-width: 0;
                        padding-left: .8rem;

                        .comment-item-right-bottom-list-item-right-top {
                            display: flex;
                            justify-content: space-between;

                            .comment-item-right-bottom-list-item-right-top-name {
                                font-size: 1rem;
                                font-weight: 700;
                                color: #333;
                                max-width: 100%;
                                word-break: break-all;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                            }

                            .comment-item-right-bottom-list-item-right-top-time {
                                font-size: 0.8rem;
                                color: #999;
                                white-space: nowrap;
                            }
                        }

                        .comment-item-right-bottom-list-item-right-bottom {

                            .comment-item-right-bottom-list-item-right-bottom-text {
                                font-size: 1rem;
                                color: #333;
                                margin-top: 4px;
                            }

                            .comment-item-right-bottom-list-item-right-bottom-time {
                                font-size: .8rem;
                                color: #999;
                                margin-top: 2px;

                                * {
                                    margin-right: .5rem;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>