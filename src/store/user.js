import { getUUID } from "@/utils/uuid_token";
import { getToken, setToken, removeToken } from "@/utils/token";
import { reqMockUserInfo } from "@/api";
const getters = {
}
const actions = {
    async getUserInfo({ commit }) {
        let result = await reqMockUserInfo();
        if (result.code === 200) {
            commit("GETUSERINFO", result.data);
        } else {
            return Promise.reject(new Error("Request Fail!"));
        }
    },
}
const mutations = {
    GETUSERINFO(state, userInfo) {
        state.userInfo = userInfo;
    },
}
const state = {
    uuid_token: getUUID(),
    token: getToken(),
    userInfo: {},
}

export default {
    state,
    getters,
    actions,
    mutations
}