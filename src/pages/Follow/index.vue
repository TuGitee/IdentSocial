<template>
    <div class="container" id="root">
        <button class="back" @click="goBack">
            <i class="el-icon-arrow-left"></i>
            <b>返回</b>
        </button>
        <h1 class="title"># {{ userInfo.nickname }}关注列表</h1>
        <UserItem v-for="item in followList" :key="item.id" :id="item.fid" />
    </div>
</template>

<script>
import { reqMockFollowList, reqMockUser } from '@/api';
import UserItem from '@/components/UserItem.vue';

export default {
    name: 'Follow',
    components: {
        UserItem
    },
    data() {
        return {
            userInfo: {},
            followList: []
        }
    },
    computed: {
        uid() {
            return this.$route.params.uid
        }
    },
    methods: {
        async init() {
            const res = await reqMockUser(this.uid);
            this.userInfo = res.data
            const followingList = await reqMockFollowList(this.uid);
            this.followList = followingList.data.filter(follow => follow.isFollow);
        },
        goBack() {
            this.$router.back();
        }
    },
    mounted() {
        this.init();
    },
}
</script>

<style scoped lang="less">
@import "@/css/user.less";

.container {
    .back {
        color: @white;
        font-weight: bold;
        font-size: 1rem;
        margin-top: 1.2rem;
        width: fit-content;
        display: flex;
        align-items: center;
        text-shadow: 0 0 4px @black;
        background-color: transparent;
        border: none;
        cursor: pointer;

        i {
            margin-right: 4px;
            font-size: 1.2rem;
        }
    }

    .title {
        margin-top: 12px;
        margin-bottom: 12px;
        color: transparent;
        width: fit-content;
        background: linear-gradient(45deg, @purple, @pink);
        -webkit-background-clip: text;
    }
}
</style>