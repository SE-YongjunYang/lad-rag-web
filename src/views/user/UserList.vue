<script setup>
import { ref } from 'vue'
import {  Delete } from '@element-plus/icons-vue'
import { userAddService, userListService, userDeleteService } from '@/api/user'

const userList = ref([])
const isLoading = ref(false)
const dialogVisible = ref(false)
const form = ref({
  userName: '',
  password: '',
  re_pwd: ''
})

// 自定义校验规则：新密码和确认密码必须相同
const validateRePwd = (rule, value, callback) => {
  if (value !== form.value.password) {
    callback(new Error('确认密码和密码必须相同'))
  } else {
    callback()
  }
}

// 表单校验规则
const rules = {
  userName: [
    { required: true, message: '用户名不能为空', trigger: 'blur' },
    // 必须是5-10位字母
    { pattern: /^[a-zA-Z0-9]{5,10}$/, message: '用户名必须是5-10位字母或数字', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '新密码不能为空', trigger: 'blur' },
    { min: 6, max: 15, message: '密码长度必须在6到15位之间', trigger: 'blur' }
  ],
  re_pwd: [
    { required: true, message: '确认密码不能为空', trigger: 'blur' },
    { min: 6, max: 15, message: '密码长度必须在6到15位之间', trigger: 'blur' },
    { validator: validateRePwd, trigger: 'blur' }
  ]
}

const getUserList = async () => {
  // 从接口获取用户列表 
  isLoading.value = true
  const res = await userListService()
  userList.value = res.data
  isLoading.value = false
}
// 调用
getUserList()

const onSubmit = async () => {
  // console.log(form.value)
  // 新增用户, 提交新增
  await userAddService({userName: form.value.userName, password: form.value.password})
  // 关闭弹窗
  dialogVisible.value = false
  getUserList()
}

const deleteUser = async (id) => {
  // 先弹出确认框
  await ElMessageBox.confirm('确认删除该用户?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  await userDeleteService(id)
  ElMessage.success('删除成功')
  // 刷新列表
  getUserList()
}
</script>

<template>
  <div>
    <div class="header">
      <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
    </div>
    <br/>
    
    <el-table :v-loading="isLoading" :data="userList" style="width: 100%">
      <el-table-column label="ID">
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="userName" label="用户名" />
      <el-table-column label="操作" align="center">
        <template #default="{row}">
          <el-button :icon="Delete"
            round
            circle
            type="danger"
            @click="deleteUser(row.id)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" title="添加用户" width="30%">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="用户名">
          <el-input v-model="form.userName"/>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" 
          type="password" 
          placeholder="请输入新密码"
          show-password/>
        </el-form-item>
        <el-form-item label="确认密码" prop="re_pwd">
          <el-input v-model="form.re_pwd" 
          type="password" 
          placeholder="请确认密码"
          show-password/>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>
