// import Element from "element-ui"

const Mock = require('mockjs')

let Result = {
    code: 200,
    msg: '操作成功',
    data: null
}

Mock.mock('/login', 'post', () => {
    return Result
})

Mock.mock('/sys/userInfo', 'get', () => {
    Result.data = {
        id: "1",
        username: "test",
        avatar: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
    }
    return Result
})
Mock.mock('/sys/user/updatePass', 'post', () => {
    Result.code = 200
    Result.msg = '修改成功'
    return Result
})

Mock.mock('/logout', 'post', () => {
    return Result
})

Mock.mock('/sys/menu/nav', 'get', () => {

    let nav = [
        {
            name: 'SysMange',
            title: '系统管理',
            icon: 'el-icon-s-operation',
            component: '',
            path: '',
            children: [
                {
                    name: 'SysUser',
                    title: '用户管理',
                    icon: 'el-icon-s-custom',
                    path: '/sys/users',
                    component: 'sys/User',
                    children: []
                }, {
                    name: 'SysRole',
                    title: '角色管理',
                    icon: 'el-icon-rank',
                    path: '/sys/roles',
                    component: 'sys/Role',
                    children: []
                }, {
                    name: 'SysMenu',
                    title: '菜单管理',
                    icon: 'el-icon-menu',
                    path: '/sys/menus',
                    component: 'sys/Menu',
                    children: []
                }
            ]
        },
        {
            title: '系统工具',
            name: 'SysTools',
            icon: 'el-icon-s-tools',
            path: '',
            component: '',
            children: [
                {
                    name: 'SysDict',
                    title: '数字字典',
                    icon: 'el-icon-s-order',
                    path: '/sys/dicts',
                    component: 'sys/Dicts',
                    children: []
                }
            ]
        }
    ]
    let authoritys = []

    Result.data = {
        nav: nav,
        authoritys: authoritys
    }

    return Result
})

Mock.mock('/sys/menu/list', 'get', () => {
    let menus = [
        {
            "id": 1,
            "created": "2021-01-15T18:58:18",
            "updated": "2021-01-15T18:58:20",
            "statu": 1,
            "parentId": 0,
            "name": "系统管理",
            "path": "",
            "perms": "sys:manage",
            "component": "",
            "type": 0,
            "icon": "el-icon-s-operation",
            "ordernum": 1,
            "children": [
                {
                    "id": 2,
                    "created": "2021-01-15T19:03:45",
                    "updated": "2021-01-15T19:03:48",
                    "statu": 1,
                    "parentId": 1,
                    "name": "用户管理",
                    "path": "/sys/users",
                    "perms": "sys:user:list",
                    "component": "sys/User",
                    "type": 1,
                    "icon": "el-icon-s-custom",
                    "ordernum": 1,
                    "children": [
                        {
                            "id": 9,
                            "created": "2021-01-17T21:48:32",
                            "updated": null,
                            "statu": 1,
                            "parentId": 2,
                            "name": "添加用户",
                            "path": null,
                            "perms": "sys:user:save",
                            "component": null,
                            "type": 2,
                            "icon": null,
                            "ordernum": 1,
                            "children": []
                        },
                        {
                            "id": 10,
                            "created": "2021-01-17T21:49:03",
                            "updated": "2021-01-17T21:53:04",
                            "statu": 1,
                            "parentId": 2,
                            "name": "修改用户",
                            "path": null,
                            "perms": "sys:user:update",
                            "component": null,
                            "type": 2,
                            "icon": null,
                            "ordernum": 2,
                            "children": []
                        },
                        {
                            "id": 11,
                            "created": "2021-01-17T21:49:21",
                            "updated": null,
                            "statu": 1,
                            "parentId": 2,
                            "name": "删除用户",
                            "path": null,
                            "perms": "sys:user:delete",
                            "component": null,
                            "type": 2,
                            "icon": null,
                            "ordernum": 3,
                            "children": []
                        },
                        {
                            "id": 12,
                            "created": "2021-01-17T21:49:58",
                            "updated": null,
                            "statu": 1,
                            "parentId": 2,
                            "name": "分配角色",
                            "path": null,
                            "perms": "sys:user:role",
                            "component": null,
                            "type": 2,
                            "icon": null,
                            "ordernum": 4,
                            "children": []
                        },
                        {
                            "id": 13,
                            "created": "2021-01-17T21:50:36",
                            "updated": null,
                            "statu": 1,
                            "parentId": 2,
                            "name": "重置密码",
                            "path": null,
                            "perms": "sys:user:repass",
                            "component": null,
                            "type": 2,
                            "icon": null,
                            "ordernum": 5,
                            "children": []
                        }
                    ]
                },
                {
                    "id": 3,
                    "created": "2021-01-15T19:03:45",
                    "updated": "2021-01-15T19:03:48",
                    "statu": 1,
                    "parentId": 1,
                    "name": "角色管理",
                    "path": "/sys/roles",
                    "perms": "sys:role:list",
                    "component": "sys/Role",
                    "type": 1,
                    "icon": "el-icon-rank",
                    "ordernum": 2,
                    "children": []
                },

            ]
        },
        {
            "id": 5,
            "created": "2021-01-15T19:06:11",
            "updated": null,
            "statu": 1,
            "parentId": 0,
            "name": "系统工具",
            "path": "",
            "perms": "sys:tools",
            "component": null,
            "type": 0,
            "icon": "el-icon-s-tools",
            "ordernum": 2,
            "children": [
                {
                    "id": 6,
                    "created": "2021-01-15T19:07:18",
                    "updated": "2021-01-18T16:32:13",
                    "statu": 1,
                    "parentId": 5,
                    "name": "数字字典",
                    "path": "/sys/dicts",
                    "perms": "sys:dict:list",
                    "component": "sys/Dict",
                    "type": 1,
                    "icon": "el-icon-s-order",
                    "ordernum": 1,
                    "children": []
                }
            ]
        }
    ]

    Result.data = menus

    return Result
})