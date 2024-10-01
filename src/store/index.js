import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)


import user from './user'
import post from './post'
import chat from './chat'

export default new Vuex.Store({
    modules: {
        user,
        post,
        chat
    }
})