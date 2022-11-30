<template>
    <div class="blog-item">
        <div class="blog-item-header">
            <div class="blog-item-header-avatar">
                <img :src="require('@/pages/Home/images/Avatars/' + item.avatar)" alt="">
            </div>
            <div class="blog-item-header-info">
                <div class="blog-item-header-info-name">
                    {{ item.name }}
                </div>
                <div class="blog-item-header-info-time">
                    {{ item.time }}
                </div>
            </div>
        </div>
        <div class="blog-item-content">
            <div class="blog-item-content-text">
                {{ item.text }}
            </div>
            <ul class="blog-item-content-img">
                <li class="blog-item-content-img-item" v-for="(image, index) in item.img" :key="index">
                    <img :src="require('@/pages/Home/images/Blogs/' + image)" alt="" />
                </li>

            </ul>
        </div>
        <div class="blog-item-footer">
            <div class="blog-item-footer-item" @touchstart="onLike">
                <i :class="isLike ? 'el-icon-star-on active' : 'el-icon-star-off'"></i>
                <span>{{ item.like }}</span>
            </div>
            <div class="blog-item-footer-item">
                <i class="el-icon-chat-round"></i>
                <span>{{ item.comment }}</span>
            </div>
            <div class="blog-item-footer-item">
                <i class="el-icon-share"></i>
                <span>{{ item.share }}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "BlogItem",
    props: ['item'],
    data() {
        return {
            isLike: false,
        }
    },
    methods: {
        onLike() {
            if (this.isLike) {
                this.item.like--;
            } else {
                this.item.like++;
            }
            this.isLike = !this.isLike;
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
                font-weight: bold;
            }

            &-time {
                font-size: 0.8rem;
                color: #999;
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

            &-item:nth-last-child(1):first-child{
                width: 12rem;
                height: 12rem;
            }
        }
    }

    &-footer {
        display: flex;
        padding: 10px;

        .active {
            color: #A493FF;
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