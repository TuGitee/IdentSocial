<template>
    <div class="comment-item">
        <div class="comment-item-left">
            <router-link :to="`/user-detail/${comment.uid}`">
                <img :src="comment.user.avatar" alt="">
            </router-link>
        </div>
        <div class="comment-item-right">
            <div class="comment-item-right-top">
                <router-link :to="`/user-detail/${comment.uid}`">
                    <span class="comment-item-right-top-name">{{ comment.user.nickname }}</span>
                </router-link>
                <span class="comment-item-right-top-time">{{ formatTime(comment.time) }}</span>
            </div>
            <div class="comment-item-right-bottom">
                <span class="comment-item-right-bottom-text" @click="emitTarget(comment)">{{
                    comment.text
                }}</span>
                <ul class="comment-item-right-bottom-list">
                    <li class="comment-item-right-bottom-list-item" v-for="c in comment.children?.slice(0, sliceNum)"
                        :key="c.id">
                        <div class="comment-item-right-bottom-list-item-left">
                            <router-link :to="`/user-detail/${c.uid}`">
                                <img :src="c.user.avatar" alt="">
                            </router-link>
                        </div>
                        <div class="comment-item-right-bottom-list-item-right">
                            <div class="comment-item-right-bottom-list-item-right-top">
                                <p class="comment-item-right-bottom-list-item-right-top-name">
                                    <router-link :to="`/user-detail/${c.uid}`">
                                        <span class="comment-item-right-bottom-list-item-right-top-name">
                                            {{
                                                c.user.nickname
                                            }}
                                        </span>
                                    </router-link>
                                    <span style="margin:0 .3rem;color: #ccc;"
                                        v-if="c.cid !== comment.id">回复给</span><router-link :to="`/user-detail/${c.pid}`"
                                        v-if="c.cid !== comment.id">
                                        <span class="comment-item-right-bottom-list-item-right-top-name">
                                            {{
                                                c.puser.nickname
                                            }}
                                        </span>
                                    </router-link>
                                </p>

                                <span class="comment-item-right-bottom-list-item-right-top-time">{{ c.time
                                    }}</span>
                            </div>
                            <div class="comment-item-right-bottom-list-item-right-bottom" @click.stop="emitTarget(c)">
                                <span class="comment-item-right-bottom-list-item-right-bottom-text">{{ c.text
                                    }}</span>
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
    mounted() {
        // this.getUserList();
    },
    methods: {
        emitTarget(comment) {
            this.$emit('click', comment)
        },
        // getUserList() {
        //     this.userList.forEach(item => {
        //         this.$userAxios.get(`/user?userId=${item}`).then(res => {
        //             this.userInfo.push(res.data.data)
        //         })
        //     })
        // },
        moreComment() {
            this.sliceNum = this.sliceNum + 3
        },
        lessComment() {
            this.sliceNum = 1
        },
        formatTime(time) {
            let date = new Date(time);
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            let hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
            let minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
            let second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
            return `${year}-${month}-${day} ${hour}:${minute}:${second}`
        }
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
        padding-left: 10px;

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

            .comment-item-right-bottom-list {
                margin-top: 5px;

                .comment-item-right-bottom-list-item {
                    display: flex;
                    padding: 10px 0;

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
                        padding-left: 10px;

                        .comment-item-right-bottom-list-item-right-top {
                            display: flex;
                            justify-content: space-between;

                            .comment-item-right-bottom-list-item-right-top-name {
                                font-size: 1rem;
                                font-weight: 700;
                                color: #333;
                                word-break: break-all;
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
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>