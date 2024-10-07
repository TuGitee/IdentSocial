import Vue from "vue";

const state = {
    chatList: localStorage.getItem('chatList') ? JSON.parse(localStorage.getItem('chatList')) : [],
    userChatList: localStorage.getItem('userChatList') ? JSON.parse(localStorage.getItem('userChatList')) : {},
}
const actions = {
}
const mutations = {
    ADDCHAT(state, ...chat) {
        chat.forEach(item => {
            const index = state.chatList.findIndex(chat => chat.message === item.message && Math.abs(chat.time - item.time) < 1000 && chat.from_id === item.from_id && chat.to_id === item.to_id);
            if (index === -1) return;
            state.chatList.splice(index, 1);
        })
        state.chatList.push(...chat)
        localStorage.setItem('chatList', JSON.stringify(state.chatList))
    },
    ADDUSERCHAT(state, ...chat) {
        chat.forEach(item => {
            const { to_id, from_id } = item;
            const lst = hashGet(state.userChatList, to_id, from_id);
            const index = lst.findIndex(chat => chat.message === item.message && Math.abs(chat.time - item.time) < 10 && chat.from_id === item.from_id && chat.to_id === item.to_id);
            if (index !== -1) lst.splice(index, 1);
            lst.push(item);
        })
        localStorage.setItem('userChatList', JSON.stringify(state.userChatList))
    },
}
const getters = {
    last(state) {
        return (id1, id2) => {
            const lst = hashGet(state.userChatList, id1, id2);
            if (id1 && id2) return lst.length ? lst[lst.length - 1] : null;
            return state.chatList.length ? state.chatList[state.chatList.length - 1] : null;
        }
    },
    getChatList(state) {
        return (id1, id2) => {
            if (id1 && id2) return hashGet(state.userChatList, id1, id2);
            return state.chatList;
        }
    },
}

function hashSet(obj, id1, id2, value) {
    Vue.set(obj, `${id1}-${id2}`, value);
}

function hashGet(obj, id1, id2) {
    const value = obj[`${id1}-${id2}`] || obj[`${id2}-${id1}`] || null;
    if (value) return value;
    hashSet(obj, id1, id2, []);
    return hashGet(obj, id1, id2);
}

export default {
    state,
    getters,
    actions,
    mutations
}