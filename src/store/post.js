import { reqFollowingInfo, findUserBlog, reqMockPostList, reqMockAddPost, reqMockPost } from "@/api"
const state = {
    postList: [],
    followingPostList: [],
    currentPost: null,
    pageNo: 1,
    pageSize: 10,
    isMore: true
}
const actions = {
    async postBlog({ commit }, { text, imgs }) {
        const res = await reqMockAddPost(text, imgs)
        if (res.code == 200) {
            commit("POSTBLOG", res.data);
            return res;
        } else {
            throw new Error("发布失败");
        }
    },
    async getPostList({ state, commit }) {
        if (!state.isMore) return
        const res = await reqMockPostList(state.pageNo, state.pageSize);
        commit("GETPOSTLIST", res.data);
        if (res.data.length < state.pageSize) {
            state.isMore = false
        }
        state.pageNo++;
    },
    async getPost({ commit }, id) {
        const res = await reqMockPost(id);
        if (res.code === 200) {
            commit("GETPOST", res.data);
        } else {
            return Promise.reject(new Error("Request Fail!"));
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
    RESET(state) {
        state.postList = []
        state.pageNo = 1
        state.pageSize = 10
        state.isMore = true
    },
    POSTBLOG(state, postBlog) {
        state.postList.unshift(postBlog)
    },
    GETPOST(state, post) {
        const index = state.postList.findIndex(item => item.id === post.id);
        state.currentPost = post;
        if (index !== -1) {
            state.postList.splice(index, 1, post);
        } else {
            state.postList.push(post);
        }
    },
    GETPOSTLIST(state, postList) {
        for (let i = 0; i < postList.length; i++) {
            if (state.postList.find(item => item.id === postList[i].id)) {
                postList.splice(i, 1)
                i--;
            }
        }
        state.postList.push(...postList);
    },
    RESETCURRENTPOST(state) {
        state.currentPost = null;
    }
}
const getters = {
    sortedPostList(state) {
        return state.postList.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    }
}
export default {
    state,
    getters,
    actions,
    mutations
}