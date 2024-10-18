<template>
    <div class="container" id="root">
        <PageHeader :title="title"></PageHeader>
        <el-empty v-if="!followList.length"></el-empty>
        <UserItem v-for="item in followList" :key="item.id" :id="isFollower ? item.uid : item.fid" />
    </div>
</template>

<script>
import { reqMockFollowerList, reqMockFollowList, reqMockUser } from '@/api';
import PageHeader from '@/components/PageHeader.vue';
import UserItem from '@/components/UserItem.vue';

export default {
    name: 'Follow',
    components: {
        UserItem,
        PageHeader
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
        },
        isFollower() {
            return this.$route.path.includes('follower')
        },
        title() {
            return `# ${this.userInfo.username}的${this.isFollower ? '粉丝' : '关注'}列表`
        }
    },
    methods: {
        async init() {
            const res = await reqMockUser(this.uid);
            this.userInfo = res.data
            const followingList = this.isFollower ? await reqMockFollowerList(this.uid) : await reqMockFollowList(this.uid);
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