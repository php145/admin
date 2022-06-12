import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import request from './axios'
/*import VueAxios from 'vue-axios'*/
import Element from 'element-ui'
import "element-ui/lib/theme-chalk/index.css"


Vue.prototype.$axios = request
Vue.config.productionTip = false
Vue.use(Element)
/*Vue.use(VueAxios, axios)*/

require("./mock.js")
require("./globalFun.js")

new Vue({
    router, store, render: h => h(App)
}).$mount('#app')
