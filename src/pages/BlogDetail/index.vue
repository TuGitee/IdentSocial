<template>
    <div class="blog-detail">
        <div class="blog-header" @dblclick="toTop">
            <div class="blog-header-left" @click="goBack">
                <i class="el-icon-arrow-left"></i>
            </div>
            <div class="blog-header-center">
                <span class="blog-header-center-title">动态详情</span>
            </div>
            <div class="blog-header-right">
                <span class="blog-header-right-more">
                    <i class="el-icon-more"></i>
                </span>
            </div>
        </div>
        <div class="blog-content">
            <BlogItem :item="item" @click="comment"></BlogItem>
            <CommentItem v-for="comment in commentList" :key="comment.commentId" :userList="userList" :comment="comment"
                @click="changeTarget" />
        </div>
        <div class="blog-footer" v-if="isComment">
            <input type="text" class="blog-footer-input" place-holder="说点什么..." autofocus ref="input" v-model="text" />
            <button class="blog-footer-btn" @touchstart="publish">发布</button>
        </div>
    </div>
</template>
  
<script>
import BlogItem from "@/components/BlogItem.vue";
import CommentItem from "./CommentItem";
import MonitorKeyboard from '@/utils/MonitorKeyboard.js'
export default {
    name: "BlogDetail",
    components: {
        BlogItem,
        CommentItem
    },
    data() {
        return {
            item: {},
            monitorKeyboard: null,
            isComment: false,
            text: '',
            target: null,
            targetUser: null,
            commentList: []
        }
    },
    methods: {
        changeTarget(id, user) {
            this.target = id;
            this.targetUser = user;
            this.isComment = true;
            this.$nextTick(() => {
                this.$refs.input.focus();
            })
        },
        async init() {
            let res = await this.$blogAxios.get(`/post?postId=${this.$route.params.bid}`)
            this.item = res.data.data;
            this.getKeyboardState();
            this.getCommentList();
        },
        toTop() {
            document.querySelector('.blog-content').scrollTop = 0;
        },
        publish() {
            console.log(this.target);
            this.$blogAxios.post('/comment', {
                content: this.text,
                commentTo: this.targetUser ? this.targetUser : null,
                userId: this.$store.state.user.token,
                belongPost: this.bid,
                belongComment: this.target ? this.target : null
            }).then(res => {
                this.$notify({
                    title: "成功",
                    message: "评论成功",
                    type: "success",
                    duration: 2000,
                    offset: parseInt(getComputedStyle(document.documentElement).getPropertyValue("--safe-area-inset-top")),
                })
                this.isComment = false;
                this.text = '';
                this.$router.go(0);
                location.reload();
            })
        },
        comment() {
            this.isComment = true;
            this.target = null;
            this.targetUser = null;
            this.$nextTick(() => {
                this.$refs.input.focus();
            })
        },
        goBack() {
            this.$router.go(-1)
        },
        getKeyboardState() {
            this.monitorKeyboard = new MonitorKeyboard();
            this.monitorKeyboard.onStart();

            this.monitorKeyboard.onShow(() => {
                let blogContent = document.querySelector('.blog-content');
                if (!blogContent) return;
                blogContent.style.height = `calc(100vh - constant(safe-area-inset-top) - 3rem)`;
                blogContent.style.height = `calc(100vh - env(safe-area-inset-top) - 3rem)`;
            })

            this.monitorKeyboard.onHidden(() => {
                this.isComment = false;
            })
        },
        async getCommentList() {
            let res = await this.$blogAxios.get(`/comment/post?postId=${this.bid}`)
            let tree = []
            console.log(res.data.data);
            res.data.data.forEach(item => {
                if (item.belongComment === null) {
                    tree.push(item);
                }
            });
            res.data.data.forEach(item => {
                tree.forEach(treeItem => {
                    if (item.belongComment === treeItem.commentId) {
                        if (!treeItem.children) {
                            treeItem.children = [];
                        }
                        treeItem.children.push(item);
                    }
                })
            });
            this.commentList = tree;
            console.log(this.commentList);
        },
    },
    computed: {
        bid() {
            return this.$route.params.bid
        },
        treeComment() {
            let res = [];
            this.commentList.forEach(item => {
                if (item.commentTo === -1) {
                    res.push(item);
                }
            })
            return res;
        },
        userList() {
            return [...new Set((this.commentList.map(item => [item.userId, item.commentTo])).flat(Infinity))].filter(item => item);
        }
    },
    mounted() {
        this.init();
    },
    beforeDestroy() {
        this.monitorKeyboard.onEnd();
    }
}
</script>
  
<style scoped lang="less">
.blog-detail {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .blog-header {
        width: 100%;
        height: 3rem;
        height: calc(constant(safe-area-inset-top) + 3rem);
        height: calc(env(safe-area-inset-top) + 3rem);
        padding-left: 1rem;
        padding-right: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        font-size: 1rem;
        z-index: 999;
        position: fixed;
        user-select: none;

        * {
            line-height: 3rem;
        }

        .blog-header-left {
            color: #666;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;

            i {
                font-size: 1.2rem;
                margin-right: 5px;
                font-weight: 700;
            }
        }

        .blog-header-center {
            font-size: 1.1rem;
            color: #333;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            position: absolute;
            left: 50%;
            transform: translate(-50%, 0);
            white-space: nowrap;

            &-title {
                font-weight: 700;
            }
        }

        .blog-header-right {
            font-size: 1rem;
            color: #666;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            transform: rotate(90deg);

            .blog-header-right-more {
                color: @darkPurple;
                font-size: 700;
            }
        }
    }

    .blog-content {
        width: 100%;
        position: fixed;
        overflow: scroll;
        top: calc(constant(safe-area-inset-top) + 3rem);
        top: calc(env(safe-area-inset-top) + 3rem);
        height: calc(100vh - constant(safe-area-inset-top) - 3rem);
        height: calc(100vh - env(safe-area-inset-top) - 3rem);
        padding: 0 1.2rem;
        padding-bottom: constant(safe-area-inset-bottom);
        padding-bottom: env(safe-area-inset-bottom);

        /deep/ .blog-item {
            box-shadow: none;
            margin: 0;
            background-color: transparent;
        }

        .blog-content-comment {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            .blog-content-comment-list {
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;

                .blog-content-comment-item {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 1rem;
                    background-color: #fff;
                    border-radius: 5px;
                }
            }
        }
    }

    .blog-footer {
        width: 100%;
        height: 3rem;
        position: fixed;
        bottom: 0;
        left: 0;
        background-color: #fff;
        border-top: 1px solid #eee;
        padding: 0.5rem;
        padding-bottom: constant(safe-area-inset-bottom);
        padding-bottom: env(safe-area-inset-bottom);
        display: flex;
        gap: .5rem;

        &:focus-within {
            padding-bottom: 0 !important;
            margin-top: calc(constant(safe-area-inset-bottom) * -1);
            margin-top: calc(env(safe-area-inset-bottom) * -1);
        }

        &-input {
            width: 100%;
            height: 2rem;
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
            height: 2rem;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            outline: none;
            padding: .5rem;
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