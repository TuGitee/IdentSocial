<template>
    <div class="blog-item">
        <div class="blog-item-header">
            <div class="blog-item-header-avatar" @click="toUserDetail">
                <img v-if="userInfo?.avatarPath" :src="require(`@/assets/images/${userInfo?.avatarPath}.png`)" alt="">
            </div>
            <div class="blog-item-header-info">
                <div class="blog-item-header-info-name">
                    {{ userInfo.nickname }}
                </div>
                <div class="blog-item-header-info-time">
                    {{ formatTime(item.createTime) }}
                </div>
            </div>
            <div class="blog-item-header-focus">
                <button class="blog-item-header-focus-button" v-if="!isFollow" @click="follow(item.userId)"><i
                        class="el-icon-plus" v-if="!isFollowLoading"></i><i class="el-icon-loading" v-else></i> 关注</button>
                <button class="blog-item-header-focus-button" @click="unfollow(item.userId)" v-else><i
                        class="el-icon-check"></i>
                    已关注</button>
            </div>
        </div>
        <div class="blog-item-content">
            <div class="blog-item-content-text">
                {{ item.content }}
            </div>
            <ul class="blog-item-content-img">
                <li class="blog-item-content-img-item" v-for="img in imgList" :key="img.pictureId">
                    <img :src="img.path" :preview="item.postId" />
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
                <span @touchstart.stop="onComment">{{ item.commentNum ?? 0 }}</span>
            </div>
            <div class="blog-item-footer-item" @touchstart.stop="onForward">
                <i class="el-icon-share"></i>
                <span>{{ item.forwardNum ?? 0 }}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "BlogItem",
    props: {
        item: {
            type: Object,
            default: () => { }
        }
    },
    data() {
        return {
            isLike: false,
            isFollowLoading: false,
            userInfo: {},
            postFrom: {},
            isFollow: false,
            imgList: [],
            starNum: 0,
        }
    },
    methods: {
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
            let to = this.item.postId;
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
        async getUserInfo(id) {
            let res = await this.$userAxios.get(`/user?userId=${id}`);
            this.userInfo = res.data.data;
        },
        follow(id) {
            this.isFollowLoading = true;
            const fd = new FormData();
            fd.append('fanId', id);
            fd.append('userId', this.$store.state.user.token);
            this.$userAxios.post('/relationship', fd, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(res => {
                this.isFollow = true;
                this.isFollowLoading = false;
                this.$bus.$emit('follow', id);
            }).catch(err => {
                this.isFollowLoading = false;
                this.$notify({
                    title: '关注失败',
                    message: err.response.data.message,
                    type: 'error'
                })
            })

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
            this.$router.push({
                name: 'BlogDetail',
                params: {
                    bid: this.item.postId
                }
            })
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
        this.isFollow = this.item.isFollow;
        this.starNum = this.item.starNum ?? 0;

        this.$blogAxios.get(`/picture/1?postId=${this.item.postId}`).then(res => {
            this.imgList = res.data.data
            console.log(this.imgList.length, this.imgList[0]);
        })

        if (this.item.userId)
            this.getUserInfo(this.item.userId);
        if (this.item.postFrom && !this.postFrom.name) {
            this.searchBlog(this.item.postFrom);
        }
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

        this.$nextTick(()=>{
            this.$previewRefresh();
        })
    },
    watch: {
        item: {
            handler() {
                this.$nextTick(() => {
                    try {
                        this.getUserInfo(this.item.userId);
                        if (this.item.postFrom && !this.postFrom.name) {
                            this.searchBlog(this.item.postFrom);
                        }
                    } catch (e) { }
                })
            },
            deep: true,
        }
    }
}
</script>

<style lang="less" scoped>
.blog-item {
    transition: all .5s;
    width: 100%;
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
            }
        }
    }

    &-content {
        padding: 10px;

        &-text {
            font-size: 1rem;
            color: #333;
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

                &:not(:nth-child(3n)) {
                    margin-right: 2%;
                }

                &:nth-last-child(1):first-child img {
                    width: 100%;
                    height: 100%;
                }

                &:nth-last-child(4):first-child~&:nth-child(even) {
                    margin-right: 32%;
                }

                &:nth-last-child(4):first-child~&:nth-child(odd) {
                    margin-right: 2%;
                }


                img {
                    border-radius: 10px;
                    object-fit: cover;
                    width: 100%;
                    height: 100%;
                }
            }

            &-item:nth-last-child(1):first-child {
                width: 12rem;
                height: 12rem;
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