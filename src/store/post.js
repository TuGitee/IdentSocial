import { reqMockPostList, reqMockAddPost, reqMockPost, reqMockFollowPostList, reqMockLike, reqMockDeletePost } from "@/api"
import user from "./user"
const state = {
    postList: [],
    currentPost: null,
    postListNo: 1,
    followListNo: 1,
    pageSize: 10,
    isMorePost: true,
    isMoreFollow: true,
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
        if (!state.isMorePost) return
        const res = await reqMockPostList(state.postListNo, state.pageSize);
        commit("GETPOSTLIST", res.data);
        if (res.data.length < state.pageSize) {
            state.isMorePost = false
        }
        state.postListNo++;
    },
    async getPost({ commit }, id) {
        const res = await reqMockPost(id);
        if (res.code === 200) {
            commit("GETPOST", res.data);
        } else {
            return Promise.reject(new Error("Request Fail!"));
        }
    },
    async getFollowingPostList({ state, commit }) {
        if (!state.isMoreFollow) return
        const res = await reqMockFollowPostList(state.followListNo, state.pageSize);
        commit("GETPOSTLIST", res.data)
        if (res.data.length < state.pageSize) {
            state.isMoreFollow = false
        }
        state.followListNo++;
    },
    async likePost({ commit }, { bid, isLike }) {
        const res = await reqMockLike(bid, isLike);
        if (res.code === 200) {
            commit("LIKEPOST", res.data);
            return res;
        } else {
            return Promise.reject(new Error("Request Fail!"));
        }
    },
    async deletePost({ commit }, id) {
        const res  = await reqMockDeletePost(id);
        if (res.code === 200) {
            commit("DELETEPOST", id);
            return res;
        } else {
            return Promise.reject(new Error("Request Fail!"));
        }
    }
}
const mutations = {
    RESET(state) {
        state.postList = []
        state.postListNo = 1
        state.followListNo = 1
        state.pageSize = 10
        state.isMorePost = true
        state.isMoreFollow = true
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
    },
    LIKEPOST(state, like) {
        if (like.isLike) {
            user.state.userInfo.likeList.push(like);
            state.postList.find(item => item.id === like.bid).like++;
        } else {
            const index = user.state.userInfo.likeList.findIndex(item => item.id === like.id);
            if (index !== -1) {
                user.state.userInfo.likeList.splice(index, 1);
                state.postList.find(item => item.id === like.bid).like--;
            }
        }
    },
    DELETEPOST(state, id) {
        const index = state.postList.findIndex(item => item.id === id);
        if (index !== -1) {
            state.postList.splice(index, 1);
        }
    }
}
const getters = {
    sortedPostList(state) {
        return state.postList.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    },
    followingPostList(state) {
        const followingList = user.state.userInfo?.followingList?.filter(follow => follow.isFollow).map(item => item.fid) || [];
        return state.postList.filter(post => followingList.includes(post.uid)).sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    }
}
export default {
    state,
    getters,
    actions,
    mutations
}