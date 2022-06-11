import Vue from 'vue'
import Vuex from 'vuex'
import Router from 'vue-router'
import menus from "./modules/menus";

Vue.use(Vuex)
const includPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return includPush.call(this, location).catch(err => err)
}

export default new Vuex.Store({
    state: {
        token: ''
    },
    getters: {},
    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
            localStorage.setItem("token", token)
        }
    },
    actions: {},
    modules: {
        menus
    }
})
