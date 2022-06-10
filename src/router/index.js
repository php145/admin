import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from "@/views/Home";
import Index from "@/views/Index";
import Role from "@/views/sys/Role";
import Menu from "@/views/sys/Menu";
import User from "@/views/sys/User";

Vue.use(VueRouter)

const routes = [
    {
        path: '/home',
        name: 'Home',
        component: HomeView,
        children: [
            {
                path: '/index',
                name: 'Index',
                component: Index
            }, {
                path: '/userCenter',
                name: 'UserCenter',
                component: () => import('../views/UserCenter')
            }, {
                path: '/sys/users',
                name: 'SysUser',
                component: User
            }, {
                path: '/sys/menus',
                name: 'SysMenu',
                component: Menu
            }, {
                path: '/sys/roles',
                name: 'SysRole',
                component: Role
            }
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/Login')
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
