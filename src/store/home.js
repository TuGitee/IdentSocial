import { reqMockRecommendInfo,reqMockFollowingInfo,reqMockNearbyInfo } from "@/api"
const state={
    recommendInfo:[],
    followingInfo:[],
    nearbyInfo:[]
}
const actions={
    async getRecommendInfo({commit}){
        let result=await reqMockRecommendInfo()
        if(result.code===200){
            commit("GETRECOMMENDINFO",result.data)
        }else{
            return Promise.reject(new Error("Request Fail!"))
        }
    },
    async getNearbyInfo({commit}){
        let result=await reqMockNearbyInfo()
        if(result.code===200){
            commit("GETNEARBYINFO",result.data)
        }else{
            return Promise.reject(new Error("Request Fail!"))
        }
    },
    async getFollowingInfo({commit}){
        let result=await reqMockFollowingInfo()
        if(result.code===200){
            commit("GETFOLLOWINGINFO",result.data)
        }else{
            return Promise.reject(new Error("Request Fail!"))
        }
    }


}
const mutations={
    GETRECOMMENDINFO(state,recommendInfo){
        state.recommendInfo=recommendInfo
    },
    GETNEARBYINFO(state,nearbyInfo){
        state.nearbyInfo=nearbyInfo
    },
    GETFOLLOWINGINFO(state,followingInfo){
        state.followingInfo=followingInfo
    }
}
const getters={}
export default {
    state,
    getters,
    actions,
    mutations
}