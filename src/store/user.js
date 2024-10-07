import { getToken, removeToken, setToken } from "@/utils/token";
import { reqMockFollow, reqMockFollowerList, reqMockFollowList, reqMockLikeList, reqMockUpdateUser, reqMockUser } from "@/api";
import pubsub from "@/utils/pubsub";
const getters = {
    followCount(state) {
        return state.userInfo.followingList?.filter(item => item.isFollow).length || 0;
    },
    followerCount(state) {
        return state.userInfo.followerList?.filter(item => item.isFollow).length || 0;
    }
}
const actions = {
    async getUserInfo(state) {
        let result = await reqMockUser(state.state.token);
        if (result.code == 200) {
            pubsub.emit('userInfo', result.data);
            const followingList = await reqMockFollowList();
            result.data.followingList = followingList.data || [];
            const followerList = await reqMockFollowerList();
            result.data.followerList = followerList.data || [];
            const likeList = await reqMockLikeList();
            result.data.likeList = likeList.data || [];
            state.commit("USERINFO", result.data);
        } else {
            return Promise.reject(new Error("Request Fail!"));
        }
    },
    async updateUserInfo(state, userInfo) {
        userInfo.id = state.state.token;
        const res = await reqMockUpdateUser(userInfo);
        if (res.code === 200) {
            pubsub.emit('userInfo', res.data);
            state.commit("UPDATEUSERINFO", res.data);
            return res;
        } else {
            return Promise.reject(new Error("Request Fail!"));
        }
    },
    async followUser(state, { id, isFollow }) {
        const res = await reqMockFollow(id, isFollow);
        if (res.code === 200) {
            state.commit("FOLLOWUSER", { isFollow, data: res.data });
            return res;
        } else {
            return Promise.reject(new Error("Request Fail!"));
        }
    },
    async logout(state) {
        removeToken();
        state.commit("SETTOKEN", "");
        state.commit("USERINFO", {});
        return Promise.resolve();
    }
}
const mutations = {
    FOLLOWUSER(state, { isFollow, data }) {
        const index = state.userInfo.followingList.findIndex(item => item.id === data.id);
        if (isFollow && index === -1) {
            state.userInfo.followingList.push(data);
        } else {
            state.userInfo.followingList.splice(index, 1, data);
        }
    },
    USERINFO(state, userInfo) {
        state.userInfo = userInfo;
    },
    UPDATEUSERINFO(state, userInfo) {
        Object.assign(state.userInfo, userInfo);
    },
    SETTOKEN(state, token) {
        state.token = token;
        setToken(token);
    }
}
const state = {
    token: getToken(),
    userInfo: {},
}

export default {
    state,
    getters,
    actions,
    mutations
}