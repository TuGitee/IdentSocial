<template>
    <div class="comment-item">
        <div class="comment-item-left">
            <img :src="require('@/pages/Home/images/Avatars/' + item.avatar)" alt="">
        </div>
        <div class="comment-item-right">
            <div class="comment-item-right-top">
                <span class="comment-item-right-top-name">{{ item.name }}</span>
                <span class="comment-item-right-top-time">{{ item.time }}</span>
            </div>
            <div class="comment-item-right-bottom">
                <span class="comment-item-right-bottom-text">{{ item.text }}</span>
                <ul class="comment-item-right-bottom-list">
                    <li class="comment-item-right-bottom-list-item" v-for="comment in item.comments" :key="comment.id">
                        <div class="comment-item-right-bottom-list-item-left">
                            <img :src="require('@/pages/Home/images/Avatars/' + comment.avatar)" alt="">
                        </div>
                        <div class="comment-item-right-bottom-list-item-right">
                            <div class="comment-item-right-bottom-list-item-right-top">
                                <p class="comment-item-right-bottom-list-item-right-top-name">
                                    <span class="comment-item-right-bottom-list-item-right-top-name">{{ comment.name
                                    }}</span><span style="margin:0 .3rem;color: #ccc;">回复给</span><span
                                        class="comment-item-right-bottom-list-item-right-top-name">{{ item.name }}</span>
                                </p>

                                <span class="comment-item-right-bottom-list-item-right-top-time">{{ comment.time }}</span>
                            </div>
                            <div class="comment-item-right-bottom-list-item-right-bottom">
                                <span class="comment-item-right-bottom-list-item-right-bottom-text">{{ comment.text
                                }}</span>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "CommentItem",
    props: {
        item: {
            type: Object,
            default() {
                return {
                    id: 1,
                    name: '小明',
                    time: '2019-10-10',
                    text: '这是一条测试数据这是一条测试数据这是一条测试数据这是一条测试数据这是一条测试数据这是一条测试数据这是一条测试数据这是一条测试数据这是一条测试数据这是一条测试数据',
                    avatar: 'avatar1.png',
                    comments: [
                        {
                            id: 1,
                            name: '小明',
                            time: '2019-10-10',
                            text: '这是一条测试数据',
                            avatar: 'avatar1.png',
                        },
                        {
                            id: 2,
                            name: '小明',
                            time: '2019-10-10',
                            text: '这是一条测试数据',
                            avatar: 'avatar1.png',
                        },
                        {
                            id: 3,
                            name: '小明',
                            time: '2019-10-10',
                            text: '这是一条测试数据',
                            avatar: 'avatar1.png',
                        },
                        {
                            id: 4,
                            name: '小明',
                            time: '2019-10-10',
                            text: '这是一条测试数据',
                            avatar: 'avatar1.png',
                        },
                        {
                            id: 5,
                            name: '小明',
                            time: '2019-10-10',
                            text: '这是一条测试数据',
                            avatar: 'avatar1.png',
                        },
                        {
                            id: 6,
                            name: '小明',
                            time: '2019-10-10',
                            text: '这是一条测试数据',
                            avatar: 'avatar1.png',
                        },
                        {
                            id: 7,
                            name: '小明',
                            time: '2019-10-10',
                            text: '这是一条测试数据',
                            avatar: 'avatar1.png',
                        },
                        {
                            id: 8,
                            name: '小明',
                            time: '2019-10-10',
                            text: '这是一条测试数据',
                            avatar: 'avatar1.png',
                        },
                        {
                            id: 9,
                            name: '小明',
                            time: '2019-10-10',
                            text: '这是一条测试数据',
                            avatar: 'avatar1.png',
                        }
                    ]
                }
            }
        }
    },
    data() {
        return {
        }
    },
    methods: {
    },
    mounted() {
    }
}
</script>

<style lang="less" scoped>
.comment-item {
    display: flex;
    padding: 10px 0;

    &:not(:last-child) {
        border-bottom: 1px solid #eee;
    }

    .comment-item-left {
        width: 3rem;
        height: 3rem;
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

        .comment-item-right-top {
            display: flex;
            justify-content: space-between;

            .comment-item-right-top-name {
                font-size: 1rem;
                color: #333;
                font-weight: 700;
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

                    &:not(:last-child) {
                        border-bottom: 1px solid #eee;
                    }

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
                                font-size: 0.8rem;
                                font-weight: 700;
                                color: #333;
                            }

                            .comment-item-right-bottom-list-item-right-top-time {
                                font-size: 0.6rem;
                                color: #999;
                            }
                        }

                        .comment-item-right-bottom-list-item-right-bottom {
                            margin-top: 5px;

                            .comment-item-right-bottom-list-item-right-bottom-text {
                                font-size: 0.8rem;
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