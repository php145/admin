import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from "@/views/HomeView";
import IndexView from "@/views/IndexView";

Vue.use(VueRouter)

const routes = [
    {
        path: '/home',
        name: 'home',
        component: HomeView
    },
    {
        path: '/index',
        name: 'index',
        component: IndexView
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/LoginView')
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
