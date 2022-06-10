<template>
  <div>
    <el-form :model="passForm" :rules="rules" ref="loginForm" label-width="100px" class="demo-loginForm">
      <h2 class="">你好，{{}}}</h2>
      <el-form-item label="旧密码" prop="currentPass">
        <el-input v-model="passForm.currentPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="password">
        <el-input v-model="passForm.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input v-model="passForm.checkPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('passForm')">提交</el-button>
        <el-button @click="resetForm('passForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "UserCenter",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value == '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.passForm.password) {
        callback(new Error('两次输入密码不一至!'))
      } else {
        callback()
      }
    }
    return {
      userInfo: {},
      passForm: {
        password: '',
        checkPass: '',
        currentPass: ''
      },
      rules: {
        password: [
          {required: true, message: '请输入新密码', trigger: 'blur'},
          {min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur'}
        ],
        checkPass: [{required: true, validator: validatePass, trigger: 'blur'}],
        currentPass: []
      }
    }
  }
}
</script>

<style scoped>

</style>