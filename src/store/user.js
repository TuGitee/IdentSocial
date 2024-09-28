import { getToken, setToken } from "@/utils/token";
import { reqMockFollow, reqMockFollowList, reqMockUser } from "@/api";
const getters = {
    followCount(state) {
        return state.userInfo.followingList?.filter(item => item.isFollow).length || 0;
    },
}
const actions = {
    async getUserInfo(state) {
        let result = await reqMockUser(state.state.token);
        // let result = await reqUserInfo(state.state.token);
        if (result.code == 200) {
            const followingList = await reqMockFollowList();
            result.data.followingList = followingList.data || [];
            state.commit("GETUSERINFO", result.data);
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
    }
}
const mutations = {
    FOLLOWUSER(state, { isFollow, data }) {
        if (isFollow) {
            state.userInfo.followingList.push(data);
        } else {
            const index = state.userInfo.followingList.findIndex(item => item.id === data.id);
            if (index === -1) return;
            state.userInfo.followingList.splice(index, 1, index);
        }
    },
    GETUSERINFO(state, userInfo) {
        state.userInfo = userInfo;
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