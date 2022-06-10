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