import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)


import user from './user'
import home from './home'

export default new Vuex.Store({
    modules: {
        user,
        home
    }
})