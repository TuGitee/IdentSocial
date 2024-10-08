<template>
    <div id="root" class="container">
        <header ref="header">
            <button class="back" @click="goBack">
                <i class="el-icon-arrow-left"></i>
                <b>返回</b>
            </button>
            <img :src="userInfo.backgroundUrl ?? defaultBg" :style="{
                transform: `scale(${scale})`
            }" class="bg" v-if="userInfo?.id" preview="bg">
            <div class="userInfo" v-if="uid">
                <MyImage preview="avatar" :src="userInfo?.avatarUrl">{{ userInfo?.username || '加载中' }}</MyImage>
                <h1 class="username">{{ userInfo?.username || '加载中' }}</h1>
                <p class="other" v-if="userInfo?.id">
                    <span class="gender tag">
                        <GenderIcon :gender="userInfo?.gender"></GenderIcon>
                        <span>{{ userInfo?.age || 0 }}岁</span>
                    </span>
                    <span class="score tag" v-if="userInfo?.score">
                        <i class="el-icon-star-on"></i>
                        <span>{{ userInfo?.score }}分</span>
                    </span>
                    <span class="account tag" v-if="userInfo?.email">
                        <i class="el-icon-user-solid"></i>
                        <span>{{ userInfo?.email }}</span>
                    </span>
                    <span class="location tag" v-if="userInfo?.address">
                        <i class="el-icon-location"></i>
                        <span>{{ userInfo?.address }}</span>
                    </span>
                    <span class="phone tag" v-if="userInfo?.phone">
                        <i class="el-icon-phone"></i>
                        <span>{{ userInfo?.phone }}</span>
                    </span>
                </p>
                <p class="signature" v-if="userInfo?.id" :title="userInfo?.signature">{{ userInfo?.intro }}</p>
                <p class="follow" v-if="userInfo?.id">
                    <router-link :to="`/follow/${userInfo.id}`" class="following follow-item">
                        <span class="num">{{ userInfo?.following ?? 0 }}</span>
                        <b>关注</b>
                    </router-link>
                    <router-link :to="`/follower/${userInfo.id}`" class="follower follow-item">
                        <span class="num">{{ userInfo?.followers ?? 0 }}</span>
                        <b>粉丝</b>
                    </router-link>
                </p>
            </div>
        </header>
        <main>
            <LoadingIcon v-if="isRequest" class="loading"></LoadingIcon>
            <el-empty v-else-if="userPostList.length === 0" :image-size="180" description="暂无内容"></el-empty>
            <template v-else>
                <BlogItem v-for="item in userPostList" :key="item.id" :item="item"></BlogItem>
            </template>
        </main>
    </div>
</template>

<script>
import LoadingIcon from '@/icons/LoadingIcon.vue';
import { reqMockUser } from '@/api';
import GenderIcon from '@/icons/GenderIcon.vue';
import { mapGetters } from 'vuex';
import BlogItem from '@/components/BlogItem.vue';
import defaultBg from '@/assets/bg/index.jpg';
import MyImage from '@/components/MyImage.vue';

export default {
    name: 'UserDetail',
    components: { LoadingIcon, GenderIcon, BlogItem, MyImage },
    computed: {
        uid() {
            return this.$route.params.uid
        },
        ...mapGetters({
            getUserPostList: 'userPostList'
        }),
        userPostList() {
            return this.getUserPostList(this.uid);
        }
    },
    data() {
        return {
            userInfo: null,
            isRequest: true,
            defaultBg,
            scale: 1
        }
    },
    mounted() {
        this.init();
        this.height = this.$refs.header.getBoundingClientRect().height;
        window.addEventListener('scroll', this.handleScroll, { passive: false })
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.handleScroll)
    },
    methods: {
        init() {
            this.getUserInfo();
            this.getData();
        },
        getData() {
            this.$store.dispatch("getUserPostList", this.uid);
        },
        async getUserInfo() {
            this.isRequest = true;
            try {
                const res = await reqMockUser(this.uid);
                this.userInfo = res.data;
                this.isRequest = false;
            } catch (error) {
                this.$message.error('获取用户信息失败');
                this.isRequest = false;
            }
        },
        handleScroll() {
            const scrollY = window.scrollY;
            if (scrollY > 0) {
                this.scale = 1;
            } else {
                this.scale = 1 + Math.abs(scrollY) / this.height;
            }
            if (scrollY + window.innerHeight >= document.body.scrollHeight) {
                this.getData();
            }
        },
        goBack() {
            this.$router.back();
        }
    }
}
</script>

<style lang="less" scoped>
@import '@/css/user.less';

#root.container {
    flex-direction: column;
    margin: 0 auto;
    position: relative;
    min-width: 0;
    width: 100%;
    padding: 0;

    header {
        align-items: center;
        position: relative;
        min-width: max-content;
        padding: var(--safe-area-inset-top) 1.2rem 1.2rem;
        min-width: 0;
        min-height: 256px;

        .back {
            color: @white;
            text-shadow: 0 0 4px @black;
        }

        .bg {
            position: absolute;
            height: 125%;
            width: 100%;
            bottom: 0;
            left: 0;
            will-change: transform;
            object-fit: cover;
            z-index: -2;
            transform-origin: 50% 100%;
        }

        &:after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(transparent 0%, #000000 100%);
            z-index: -1;
            pointer-events: none;
        }

        .userInfo {
            min-height: 120px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin-right: auto;
            flex: 1;
            min-width: 0;
            padding-top: 1.8rem;

            .my-image {
                height: 4rem;
                width: 4rem;
                border: 2px solid @white;
            }

            .username {
                color: @white;
                font-size: 24px;
                font-weight: 900;
                line-height: 28px;
                max-width: 300px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                margin: 0;
                margin-bottom: 6px;
                margin-top: 1rem;
            }

            .list {
                display: flex;
                align-items: center;
                width: 100%;
                white-space: nowrap;
                cursor: pointer;

                span {
                    font-size: 14px;
                    line-height: 22px;
                    margin-right: 6px;
                }

                i {
                    font-size: 16px;
                    line-height: 24px;
                    color: @white;
                    font-style: normal;
                }

                .el-divider {
                    background-color: @gray-0;
                    transform: scaleX(.5);
                    margin: 0 16px;
                }
            }

            .other {
                align-items: center;
                display: flex;
                width: 100%;
                margin-top: 0;
                height: fit-content;
                flex-wrap: wrap;

                .account {
                    font-size: 12px;
                    line-height: 20px;
                    margin-right: 20px;
                }

                .tag {
                    border-radius: 4px;
                    color: @white;
                    background-color: @lightPurpleAlpha;
                    display: flex;
                    align-items: center;
                    font-size: 0.8rem;
                    color: @white;
                    height: 1.2rem;
                    line-height: 1.2rem;
                    margin-right: 8px;
                    margin-top: 8px;
                    padding: 0 8px;

                    span {
                        margin-left: 2px;
                    }
                }
            }

            .signature {
                font-size: .8rem;
                color: @white;
                line-height: 1.5;
                margin-top: 1rem;
                margin-right: 10px;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }

            .follow {
                display: flex;
                margin-top: 1rem;

                .follow-item {
                    width: fit-content;
                    display: flex;
                    flex-direction: column;
                    margin-right: 1rem;
                    color: @white;

                    .num {
                        font-size: 1.2rem;
                        font-weight: bold;
                    }

                    b {
                        font-weight: normal;
                        font-size: .8rem;
                        color: @gray-2;
                    }
                }
            }

            .info {
                font-size: 16px;
                line-height: 1.8;
                color: @gray-0;
                cursor: pointer;
            }

        }

        .tool {
            align-self: flex-end;
            margin-right: 40px;

            .el-button {
                background: @gray-3;
                border: none;
                color: @white;
                font-size: 13px;
                font-weight: 400;
            }

            .el-button--danger {
                background: @white;
                color: @darkPurple;
                padding: 0 20px;
            }
        }

    }

    main {
        padding: 1.2rem;

        .el-empty {

            :deep(.el-empty__description) {
                p {
                    color: @gray-3;
                    font-size: 14px;
                    line-height: 20px;
                    margin: 10px;
                }
            }
        }

        .loading {
            margin: 7.5rem auto;
        }
    }
}
</style>