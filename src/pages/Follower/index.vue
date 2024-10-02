<template>
    <div class="container" id="root">
        <button class="back" @click="goBack">
            <i class="el-icon-arrow-left"></i>
            <b>返回</b>
        </button>
        <h1 class="title"># {{ userInfo.nickname }}粉丝列表</h1>
        <UserItem v-for="item in followerList" :key="item.id" :id="item.uid" />
    </div>
</template>

<script>
import { reqMockFollowerList, reqMockUser } from '@/api';
import UserItem from '@/components/UserItem.vue';

export default {
    name: 'Follower',
    components: {
        UserItem
    },
    data() {
        return {
            userInfo: {},
            followerList: []
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
            const followerList = await reqMockFollowerList(this.uid);
            this.followerList = followerList.data.filter(follow => follow.isFollow);
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
        color: @black;
        font-weight: bold;
        font-size: 1rem;
        margin-top: 1.2rem;
        width: fit-content;
        display: flex;
        align-items: center;
        text-shadow: 0 0 4px @white;
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