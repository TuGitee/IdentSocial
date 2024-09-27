import { reqFollowingInfo, findUserBlog, reqMockPostList, reqMockAddPost } from "@/api"
import { getAll } from "@/utils/storage"
const state = {
    recommendInfo: [],
    followingInfo: [],
    followingList: [],
    pageNo: 1,
    pageSize: 10,
    isMore: true
}
const actions = {
    async postBlog({ commit }, { text, imgs }) {
        const res = await reqMockAddPost(text, imgs)
        if (res.code == 200) {
            const imgs = await getAll(res.data.img);
            res.data.img = imgs;
            commit("POSTBLOG", res.data);
            return res;
        } else {
            throw new Error("发布失败");
        }
    },
    async getRecommendInfo({ state, commit }) {
        if (!state.isMore) return
        const res = await reqMockPostList(state.pageNo, state.pageSize);
        for (let i = 0; i < res.data.length; i++) {
            res.data[i].img = await getAll(res.data[i].img);
        }
        commit("GETRECOMMENDINFO", res.data)
        if (res.data.length < state.pageSize) {
            state.isMore = false
        }
        state.pageNo++;
        // let result = await reqRecommendInfo(data.page, data.limit)
        // let followingList = await reqFollowingInfo(data.userId)
        // result.data.forEach(item => {
        //     item.isFollow = followingList.data.includes(item.userId)
        // });
        // let recommendList = result.data;
        // if(!recommendList.length) state.isMore = false
        // if (result.code) {
        //     recommendList = [...recommendList, ...state.recommendInfo].filter((item, index, arr) => {
        //         return arr.findIndex((item1) => {
        //             return item1.postId === item.postId
        //         }) === index
        //     }).sort((a, b) => {
        //         return new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
        //     })
        //     commit("GETRECOMMENDINFO", recommendList)
        // } else {
        //     return Promise.reject(new Error("Request Fail!"))
        // }
    },
    async getFollowingList({ commit }, data) {
        let result = await reqFollowingInfo(data.userId)
        result = [...new Set(result.data)]
        commit("GETFOLLOWINGLIST", result)
    },
    async getFollowingInfo({ commit }, data) {
        let result = await reqFollowingInfo(data.id)
        result = [...new Set(result.data)]
        let followingInfo = []
        for (let i = 0; i < result.length; i++) {
            let user = await findUserBlog(result[i])
            followingInfo.push(user.data)
        }
        followingInfo = followingInfo.flat(1)
        followingInfo.forEach(item => {
            item.isFollow = true
        });
        commit("GETFOLLOWINGINFO", followingInfo.sort((a, b) => {
            return new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
        }))
    }


}
const mutations = {
    POSTBLOG(state, postBlog) {
        state.recommendInfo.unshift(postBlog)
    },
    GETRECOMMENDINFO(state, recommendInfo) {
        for (let i = 0; i < recommendInfo.length; i++) {
            if (state.recommendInfo.find(item => item.id === recommendInfo[i].id)) {
                recommendInfo.splice(i, 1)
                i--;
            }
        }
        state.recommendInfo.push(...recommendInfo);
    },
    GETFOLLOWINGINFO(state, followingInfo) {
        state.followingInfo = followingInfo
    },
    GETFOLLOWINGLIST(state, followingList) {
        state.followingList = followingList
    }
}
const getters = {}
export default {
    state,
    getters,
    actions,
    mutations
}