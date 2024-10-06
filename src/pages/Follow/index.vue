<template>
    <div class="container" id="root">
        <header>
            <button class="back" @click="goBack">
                <i class="el-icon-arrow-left"></i>
                <b>返回</b>
            </button>
            <h1 class="title"># {{ userInfo.username }}关注列表</h1>
        </header>
        <el-empty v-if="!followList.length"></el-empty>
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
</style>