<template>
    <div class="blog-item">
        <div class="blog-item-header">
            <div class="blog-item-header-avatar" @click="toUserDetail">
                <img :src="item.user.avatar" alt="">
            </div>
            <div class="blog-item-header-info">
                <div class="blog-item-header-info-name">
                    {{ item.user?.nickname }}
                </div>
                <div class="blog-item-header-info-time">
                    {{ formatTime(item.time) }}
                </div>
            </div>
            <div class="blog-item-header-focus" v-if="userInfo.id && item.uid !== userInfo.id">
                <button class="blog-item-header-focus-button" :disabled="isFollowLoading" @click="follow(item.uid)">
                    <i class="el-icon-loading" v-if="isFollowLoading"></i>
                    <i class="el-icon-plus" v-else-if="!isFollow"></i>
                    <i class="el-icon-check" v-else></i>
                    <span>{{ isFollowLoading ? '处理中' : isFollow ? '已关注' : '关注' }}</span>
                </button>
            </div>
        </div>
        <div class="blog-item-content">
            <div class="blog-item-content-text" v-if="item.text">
                {{ item.text }}
            </div>
            <ul class="blog-item-content-img" v-if="item.img">
                <li class="blog-item-content-img-item" v-for="(_, ii) in item.img" :key="ii">
                    <MyImage :src="imgList[ii]" :preview="item.id"></MyImage>
                </li>
            </ul>
            <div class="blog-item-content-share" v-if="item.postFrom" @click="toRawBlog(item.postFrom)">
                <div class="blog-item-content-share-title">
                    <span class="blog-item-content-share-title-name" @click.stop="toUserPage(postFrom.userId)">{{
                        postFrom.name }}:
                    </span>
                    <span class="blog-item-content-share-title-text">{{ postFrom.content }}</span>
                </div>
                <!-- <ul class="blog-item-content-share-img blog-item-content-img">
                    <li class="blog-item-content-img-item" v-for="img in imgList" :key="img.pictureId">
                        {{ img.path }}
                        <img :src="img.path" :alt="img.path" :preview="img.belongPost" />
                    </li>
                </ul> -->
            </div>
        </div>
        <div class="blog-item-footer">
            <div class="blog-item-footer-item" @touchstart="onLike">
                <i :class="isLike ? 'el-icon-star-on active' : 'el-icon-star-off'"></i>
                <span>{{ starNum }}</span>
            </div>
            <div class="blog-item-footer-item" @click="toBlogDetail">
                <i class="el-icon-chat-round" @touchstart.stop="onComment"></i>
                <span @touchstart.stop="onComment">{{ item.comment ?? 0 }}</span>
            </div>
            <div class="blog-item-footer-item" @touchstart.stop="onForward">
                <i class="el-icon-share"></i>
                <span>{{ item.share ?? 0 }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { getAll } from '@/utils/storage';
import { mapState } from 'vuex';
import MyImage from './MyImage.vue';

export default {
    name: "BlogItem",
    components: {
        MyImage
    },
    props: {
        item: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            isLike: false,
            isFollowLoading: false,
            postFrom: {},
            imgList: [],
            starNum: this.item.like ?? 0,
        }
    },
    computed: {
        ...mapState({
            userInfo: state => state.user.userInfo,
        }),
        isFollow: {
            get() {
                return this.userInfo.followingList?.find((item) => item.fid === this.item.uid)?.isFollow ?? false;
            },
            set(isFollow) {
                const item = this.userInfo.followingList?.find((item) => item.fid === this.item.uid);
                if (!item) return;
                item.isFollow = isFollow;
            }
        }
    },
    methods: {
        async init() {
            const imgs = await getAll(this.item.img);
            this.imgList = imgs;
        },
        random(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        },
        toUserPage(id) {
            this.$router.push({
                name: 'UserDetail',
                params: {
                    uid: id
                }
            })
        },
        async onForward() {
            let to = this.item.id;
            if (this.item.postFrom) {
                to = this.item.postFrom;
            }
            this.$bus.$emit('forward', to);
        },
        async searchBlog(id) {
            let res = await this.$blogAxios.get(`/post?postId=${id}`)
            this.postFrom = res.data.data;
            let user = await this.$userAxios.get(`/user?userId=${this.postFrom.userId}`);
            this.$set(this.postFrom, 'name', user.data.data.nickname);
        },
        formatTime(time) {
            let t = new Date(time);
            return `${t.getFullYear()}-${t.getMonth() + 1}-${t.getDate()} ${t.getHours() < 10 ? '0' + t.getHours() : t.getHours()}:${t.getMinutes() < 10 ? '0' + t.getMinutes() : t.getMinutes()}:${t.getSeconds() < 10 ? '0' + t.getSeconds() : t.getSeconds()}`;
        },
        follow(id) {
            this.isFollowLoading = true;
            this.$store.dispatch("followUser", { id, isFollow: !this.isFollow }).finally(() => {
                this.isFollowLoading = false;
            });
            // const fd = new FormData();
            // fd.append('fanId', id);
            // fd.append('userId', this.$store.state.user.token);
            // this.$userAxios.post('/relationship', fd, {
            //     headers: {
            //         'Content-Type': 'multipart/form-data'
            //     }
            // }).then(() => {
            //     this.isFollow = true;
            //     this.isFollowLoading = false;
            //     this.$bus.$emit('follow', id);
            // }).catch(err => {
            //     this.isFollowLoading = false;
            //     this.$notify({
            //         title: '关注失败',
            //         message: err.response.data.message,
            //         type: 'error'
            //     })
            // })
        },
        unfollow(id) {
            this.isFollowLoading = true;
            this.$userAxios.delete(`/relationship?userId=${this.$store.state.user.token}&fanId=${id}`)
                .then(res => {
                    console.log(res);
                    this.isFollow = false;
                    this.isFollowLoading = false;
                    this.$bus.$emit('unfollow', id);
                }).catch(err => {
                    this.isFollowLoading = false;
                    this.$notify({
                        title: '取消关注失败',
                        message: err.response.data.message,
                        type: 'error'
                    })
                })
        },
        onComment() {
            this.$emit('click')
        },
        toUserDetail() {
            this.$router.push({
                name: 'UserDetail',
                params: {
                    uid: this.item.userId
                }
            })
        },
        toBlogDetail() {
            if (document.viewTransition) {
                document.startViewTransition(() => {
                    this.toRawBlog(this.item.id);
                })
            } else {
                this.toRawBlog(this.item.id);
            }
        },
        toRawBlog(id) {
            this.$router.push({
                name: 'BlogDetail',
                params: {
                    bid: id
                }
            })
        },
        onLike() {
            if (this.isLike) {
                this.starNum--;
            } else {
                this.starNum++;
            }
            this.isLike = !this.isLike;
        }
    },
    mounted() {
        this.init();
        this.isLike = this.item.isLike;
        // this.$blogAxios.get(`/picture/1?postId=${this.item.postId}`).then(res => {
        //     this.imgList = res.data.data
        //     console.log(this.imgList.length, this.imgList[0]);
        // })

        // if (this.item.userId)
        //     this.getUserInfo(this.item.userId);
        // if (this.item.postFrom && !this.postFrom.name) {
        //     this.searchBlog(this.item.postFrom);
        // }
        this.$bus.$on('follow', id => {
            if (id === this.item.userId) {
                this.isFollow = true;
            }
        })
        this.$bus.$on('unfollow', id => {
            if (id === this.item.userId) {
                this.isFollow = false;
            }
        })

        this.$nextTick(() => {
            this.$previewRefresh();
        })
    },
}
</script>

<style lang="less" scoped>
.blog-item {
    transition: all .5s;
    width: 100%;
    padding: .5rem 0;
    background-color: white;
    border-radius: 10px;
    margin-bottom: 10px;
    box-shadow: 0px 5px 15px -5px rgba(166, 150, 255, .3);

    &-header {
        display: flex;
        padding: 10px;

        &-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            overflow: hidden;

            img {
                width: 100%;
                height: 100%;
                border: none;
            }
        }

        &-info {
            margin-left: 10px;

            &-name {
                font-size: 1.2rem;
                line-height: 1.2rem;
                height: 1.2rem;
                margin-bottom: .3rem;
                font-weight: bold;
                max-width: 12rem;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }

            &-time {
                font-size: 0.8rem;
                color: #999;
            }
        }

        &-focus {
            flex: 1;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            white-space: nowrap;

            &-button {
                border: none;
                outline: none;
                background-color: #fff;
                color: @purple;
                font-size: 0.8rem;
                padding: 5px 10px;
                border-radius: 5px;
                box-shadow: 0px 3px 10px -5px @purple;

                i {
                    margin-right: 4px;
                }
            }
        }
    }

    &-content {
        padding: 10px;

        &-text {
            font-size: 1rem;
            color: #333;
            margin-bottom: 10px;
        }

        &-img {
            width: 100%;
            height: fit-content;
            display: flex;
            justify-content: flex-start;
            flex-wrap: wrap;

            &-item {
                width: 40%;
                padding-top: 40%;
                margin-top: 2%;
                position: relative;

                &:not(:nth-child(3n)) {
                    margin-right: 2%;
                }

                &:nth-last-child(4):first-child~&:nth-child(odd) {
                    margin-right: 2%;
                }

                &:nth-last-child(1):first-child {
                    width: 50%;
                    padding-top: 50%;
                }

                &:nth-last-child(3):first-child,
                &:nth-last-child(3):first-child~&,
                &:nth-last-child(n+5):first-child,
                &:nth-last-child(n+5):first-child~& {
                    width: 32%;
                    padding-top: 32%;
                }

                .my-image {
                    position: absolute;
                    top: 0;
                    left: 0;
                }
            }
        }

        &-share {
            padding: 10px;
            background-color: #f8f8f8;
            border-radius: 10px;

            &-title {
                font-size: 0.95rem;
                color: #999;
                white-space: pre-wrap;
                word-break: break-all;


                &-name {
                    font-weight: bold;
                }
            }

            &-img {
                width: 100%;
                height: fit-content;
                margin-top: 10px;
                display: flex;
                justify-content: flex-start;
                flex-wrap: wrap;

                &-item {
                    width: 32%;
                    height: 100px;
                    margin-top: 5px;
                }
            }
        }
    }

    &-footer {
        display: flex;
        padding: 10px;

        .active {
            color: @purple;
        }

        &-item {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;

            i {
                font-size: 1.2rem;
                color: #999;
            }

            span {
                margin-left: 5px;
                font-size: 0.8rem;
                color: #999;
            }
        }
    }
}
</style>