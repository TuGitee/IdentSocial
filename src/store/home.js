import { reqMockRecommendInfo, reqMockFollowingInfo, reqMockNearbyInfo } from "@/api"
import { reqRecommendInfo, reqFollowingInfo, findUserBlog } from "@/api"
const state = {
    recommendInfo: [],
    followingInfo: [],
    nearbyInfo: [],
    followingList: [],
    pageNo: 1,
    pageSize: 10,
    isMore: true
}
const actions = {
    async getRecommendInfo({ state, commit }, data) {
        if(!state.isMore) return
        let result = await reqRecommendInfo(data.page, data.limit)
        let followingList = await reqFollowingInfo(data.userId)
        result.data.forEach(item => {
            item.isFollow = followingList.data.includes(item.userId)
        });
        let recommendList = result.data;
        if(!recommendList.length) state.isMore = false
        if (result.code) {
            recommendList = [...recommendList, ...state.recommendInfo].filter((item, index, arr) => {
                return arr.findIndex((item1) => {
                    return item1.postId === item.postId
                }) === index
            }).sort((a, b) => {
                return new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
            })
            commit("GETRECOMMENDINFO", recommendList)
        } else {
            return Promise.reject(new Error("Request Fail!"))
        }
    },
    async getNearbyInfo({ commit }) {
        let result = await reqMockNearbyInfo()
        if (result.code === 200) {
            commit("GETNEARBYINFO", result.data)
        } else {
            return Promise.reject(new Error("Request Fail!"))
        }
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
    GETRECOMMENDINFO(state, recommendInfo) {
        state.recommendInfo = recommendInfo
    },
    GETNEARBYINFO(state, nearbyInfo) {
        state.nearbyInfo = nearbyInfo
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