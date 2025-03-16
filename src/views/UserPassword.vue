<script setup>
import { ref } from 'vue'
import { userUpdatePassService } from '@/api/user'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'

// 表单数据
const pwdForm = ref({
  userName: '',
  oldPassword: '',
  newPassword: '',
  re_pwd: ''
})

// 表单引用
const pwdFormRef = ref(null)

// 自定义校验规则：原密码和新密码不能相同
const validateNewPwd = (rule, value, callback) => {
  if (value === pwdForm.value.oldPassword) {
    callback(new Error('原密码和新密码不能相同'))
  } else {
    callback()
  }
}

// 自定义校验规则：新密码和确认密码必须相同
const validateRePwd = (rule, value, callback) => {
  if (value !== pwdForm.value.newPassword) {
    callback(new Error('新密码和确认密码必须相同'))
  } else {
    callback()
  }
}

// 表单校验规则
const rules = {
  oldPassword: [
    { required: true, message: '原密码不能为空', trigger: 'blur' },
    { min: 6, max: 15, message: '密码长度必须在6到15位之间', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '新密码不能为空', trigger: 'blur' },
    { min: 6, max: 15, message: '密码长度必须在6到15位之间', trigger: 'blur' },
    { validator: validateNewPwd, trigger: 'blur' }
  ],
  re_pwd: [
    { required: true, message: '确认密码不能为空', trigger: 'blur' },
    { min: 6, max: 15, message: '密码长度必须在6到15位之间', trigger: 'blur' },
    { validator: validateRePwd, trigger: 'blur' }
  ]
}

const userStore = useUserStore()
pwdForm.value.userName = userStore.user.userName
const router = useRouter()

// 提交表单
const submitForm = async () => {
  const valid = await pwdFormRef.value.validate()
  if (valid) {
    await userUpdatePassService(pwdForm.value)
    ElMessage.success('密码修改成功！')
    // 重置用户信息
    userStore.setToken('')
    userStore.setUserInfo({})
    // 跳转到登录页面
    router.push('/login')
  } else {
    ElMessage.error('请检查表单输入是否正确')
  }
}

// 重置表单
const resetForm = () => {
  pwdFormRef.value.resetFields()
}
</script>

<template>
  <page-container title="重置密码">
    <el-row>
      <el-col :span="6">
        <el-form :model="pwdForm" :rules="rules" ref="pwdFormRef" label-width="120px">
          <!-- 原密码 -->
          <el-form-item label="原密码" prop="oldPassword">
            <el-input
              v-model="pwdForm.oldPassword"
              type="password"
              placeholder="请输入原密码"
              show-password
            ></el-input>
          </el-form-item>

          <!-- 新密码 -->
          <el-form-item label="新密码" prop="newPassword">
            <el-input
              v-model="pwdForm.newPassword"
              type="password"
              placeholder="请输入新密码"
              show-password
            ></el-input>
          </el-form-item>

          <!-- 确认密码 -->
          <el-form-item label="确认密码" prop="re_pwd">
            <el-input
              v-model="pwdForm.re_pwd"
              type="password"
              placeholder="请确认新密码"
              show-password
            ></el-input>
          </el-form-item>

          <!-- 按钮 -->
          <el-form-item>
            <el-button type="primary" @click="submitForm">修改密码</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </page-container>
</template>

<style lang="scss" scoped></style>
