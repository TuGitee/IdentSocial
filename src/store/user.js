import { getToken, setToken, removeToken } from "@/utils/token";
import { reqUserInfo } from "@/api";
const getters = {
}
const actions = {
    async getUserInfo(state) {
        let result = await reqUserInfo(state.state.token);
        if (result.code) {
            state.commit("GETUSERINFO", result.data);
        } else {
            return Promise.reject(new Error("Request Fail!"));
        }
    }
}
const mutations = {
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