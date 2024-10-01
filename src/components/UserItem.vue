<template>
    <div class="user-item">
        <router-link :to="{ name: 'UserDetail', params: { uid: id } }">
            <MyImage :src="currentInfo?.avatar"></MyImage>
        </router-link>
        <div class="info">
            <router-link :to="{ name: 'UserDetail', params: { uid: id } }">
                <div class="name">{{ currentInfo?.nickname }}</div>
            </router-link>
            <div class="desc">{{ currentInfo?.intro }}</div>
        </div>
        <button class="button" :disabled="isFollowLoading" @click="follow(id)">
            <i class="el-icon-loading" v-if="isFollowLoading"></i>
            <i class="el-icon-plus" v-else-if="!isFollow"></i>
            <i class="el-icon-check" v-else></i>
            <span>{{ isFollowLoading ? '处理中' : isFollow ? '已关注' : '关注' }}</span>
        </button>
    </div>
</template>

<script>
import { reqMockUser } from '@/api';
import MyImage from './MyImage.vue';
import { mapState } from 'vuex';

export default {
    name: "UserItem",
    components: {
        MyImage
    },
    props: {
        id: String
    },
    data() {
        return {
            currentInfo: {},
            isFollowLoading: false
        }
    },
    mounted() {
        reqMockUser(this.id).then(res => {
            this.currentInfo = res.data;
        })
    },
    computed: {
        ...mapState({
            userInfo: state => state.user.userInfo
        }),
        isFollow() {
            return this.userInfo.followingList?.filter(follow => follow.isFollow)?.find(item => item.fid === this.id) || false;
        }
    },
    methods: {
        follow(id) {
            this.isFollowLoading = true;
            this.$store.dispatch("followUser", { id, isFollow: !this.isFollow }).finally(() => {
                this.isFollowLoading = false;
            });
        },
    }
}
</script>

<style lang="less" scoped>
.user-item {
    height: 4rem;
    display: flex;
    align-items: center;
    width: 100%;

    .my-image {
        height: 3rem;
        width: 3rem;
        border-radius: 50%;
    }

    .info {
        margin-left: 1rem;
        margin-right: 1rem;
        flex: 1;
        min-width: 0;

        .name {
            font-size: 1rem;
            font-weight: bold;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: fit-content;
        }

        .desc {
            font-size: .8rem;
            color: #999;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }

    .button {
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
</style>