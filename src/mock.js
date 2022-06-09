const Mock = require('mockjs')

let Result = {
    code: 200,
    msg: '操作成功',
    data: null
}

Mock.mock('/login', 'post', () => {
    Result.code = 400
    Result.msg = "验证码错误"
    return Result
})