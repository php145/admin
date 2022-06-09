const Mock = require('mockjs')

let Result = {
    code : 200,
    msg : '操作成功',
    data: null
}

Mock.mock('/login','post',() =>{
    Result.data = {

    }
    return Result
})