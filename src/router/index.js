import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from "@/views/Home";
import Index from "@/views/Index";
// import Role from "@/views/sys/Role";
// import Menu from "@/views/sys/Menu";
// import User from "@/views/sys/User";
// import Dicts from "@/views/sys/Dicts";

import store from "../store"

import axios from 'axios';

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
            }
            // , {
            //     path: '/sys/users',
            //     name: 'SysUser',
            //     component: User
            // }, {
            //     path: '/sys/menus',
            //     name: 'SysMenu',
            //     component: Menu
            // }, {
            //     path: '/sys/roles',
            //     name: 'SysRole',
            //     component: Role
            // }, {
            //     path: '/sys/dicts',
            //     name: 'SysDicts',
            //     component: Dicts
            // }
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

router.beforeEach((to, from, next) => {

    let hasRoute = store.state.menus.hasRoute;
    // let newRoutes = router.options.routes
    console.log(hasRoute)


    if (!hasRoute) {
        axios.get('/sys/menu/nav', {
            headers: {
                Authorization: localStorage.getItem('token')
            }
        }).then(res => {
            store.commit('setMenuList', res.data.data.nav)
            store.commit('setPermList', res.data.data.authoritys)


            res.data.data.nav.forEach(menu => {
                if (menu.children) {
                    menu.children.forEach(e => {
                        let route = menuToRoute(e)

                        if (route) {
                            //newRoutes[0].children.push(route)
                            router.addRoute('Home', route)
                        }
                    })
                }
            })
            hasRoute = true
            store.commit("changeRouteStatus", hasRoute)
            // console.log(router.getRoutes())
        })
    }
    next()
})

const menuToRoute = (menu) => {
    if (!menu.component) {
        return null
    }
    let route = {
        name: menu.name,
        path: menu.path,
        meta: {
            icon: menu.icon,
            title: menu.title
        }
    }
    route.component = () => import('@/views/' + menu.component)
    return route
}

export default router
