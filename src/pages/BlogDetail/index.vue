<template>
    <div class="blog-detail" id="root">
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
            <BlogItem v-if="currentPost" :item="currentPost" @click="comment"></BlogItem>
            <CommentItem v-for="comment in commentList" :key="comment.commentId" :comment="comment"
                @click="changeTarget" ref="comments" />
        </div>
        <div class="blog-footer" @click.stop v-if="isComment">
            <input type="text" class="blog-footer-input" :placeholder="placeholder" autofocus ref="input" v-model="text"
                @blur="closeComment" />
            <button class="blog-footer-btn" @touchstart="publish">发布</button>
        </div>
    </div>
</template>

<script>
import BlogItem from "@/components/BlogItem.vue";
import CommentItem from "./CommentItem";
import MonitorKeyboard from '@/utils/MonitorKeyboard.js'
import { reqMockAddPostComment, reqMockPostComment } from "@/api";
import { mapState } from "vuex";
export default {
    name: "BlogDetail",
    components: {
        BlogItem,
        CommentItem
    },
    data() {
        return {
            monitorKeyboard: null,
            isComment: false,
            text: '',
            target: null,
            commentList: []
        }
    },
    methods: {
        changeTarget(comment) {
            this.comment();
            this.target = comment;
        },
        async init() {
            this.isComment = false;
            this.text = '';
            this.target = null;
            await this.$store.dispatch("getPost", this.bid);
            this.getCommentList();
        },
        closeComment() {
            this.isComment = false;
        },
        toggleComment() {
            this.isComment = !this.isComment
        },
        toTop() {
            document.querySelector('.blog-content').scrollTop = 0;
        },
        publish() {
            if (!this.text.trim()) return;
            reqMockAddPostComment(this.bid, this.target?.id, this.text).then(() => {
                this.init();
                this.getCommentList();
            })
        },
        comment() {
            this.toggleComment();
            this.target = null;
            setTimeout(() => {
                this.$refs.input?.focus();
            }, 1000)
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
                // this.isComment = false;
            })
        },
        async getCommentList() {
            const res = await reqMockPostComment(this.bid);
            const tree = []
            res.data.forEach(item => {
                if (!item.cid) {
                    tree.push(item);
                }
            });
            for (let i = res.data.length - 1; i >= 0; i--) {
                const item = res.data[i];
                tree.forEach(treeItem => {
                    if (item.cid === treeItem.id) {
                        if (!treeItem.children) {
                            treeItem.children = [];
                        }
                        treeItem.children.push(item);
                    } else if (treeItem.children && treeItem.children.find(child => child.id === item.cid)) {
                        const parent = treeItem.children.find(child => child.id === item.cid);
                        item.pid = parent.id;
                        item.puser = parent.user;
                        treeItem.children.push(item);
                    }
                })
            }
            this.commentList = tree;
        },
    },
    computed: {
        ...mapState({
            currentPost: state => state.post.currentPost
        }),
        placeholder() {
            return this.target ? `回复 ${this.target.user.nickname} : ${this.target.text}` : "说点什么";
        },
        bid() {
            return this.$route.params.bid
        }
    },
    async mounted() {
        this.init();
        this.getKeyboardState();
    },
    beforeDestroy() {
        this.$store.commit("RESETCURRENTPOST");
        this.monitorKeyboard.onEnd();
    }
}
</script>

<style scoped lang="less">
@import "@/css/user.less";

.blog-detail {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .blog-header {
        width: calc(100% - 2.4rem);
        height: 3rem;
        height: calc(constant(safe-area-inset-top) + 3rem);
        height: calc(env(safe-area-inset-top) + 3rem);
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        font-size: 1rem;
        z-index: 999;
        position: fixed;
        top: 0;
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
        width: calc(100% - 2.4rem);
        position: fixed;
        overflow: scroll;
        top: calc(constant(safe-area-inset-top) + 3rem);
        top: calc(env(safe-area-inset-top) + 3rem);
        height: calc(100vh - constant(safe-area-inset-top) - 3rem);
        height: calc(100vh - env(safe-area-inset-top) - 3rem);
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
        width: 100vw;
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