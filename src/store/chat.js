const state = {
    chatList: localStorage.getItem('chatList') ? JSON.parse(localStorage.getItem('chatList')) : []
}
const actions = {
}
const mutations = {
    ADDCHAT(state, ...chat) {
        state.chatList.push(...chat)
        localStorage.setItem('chatList', JSON.stringify(state.chatList))
    },
}
const getters = {
    last(state) {
        return state.chatList.length ? state.chatList[state.chatList.length - 1] : null;
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}