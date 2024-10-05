<template>
    <div class="container" id="root">
        <header>
            <button class="back" @click="goBack">
                <i class="el-icon-arrow-left"></i>
                <b>返回</b>
            </button>
            <h1 class="title"># {{ userInfo.username }}粉丝列表</h1>
        </header>
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
</style>