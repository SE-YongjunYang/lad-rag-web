<script setup>
import { ref, watch } from 'vue'
import { getAllPermissionService, userSetAuthService, userAddService } from '@/api/user'

const dialogVisible = ref(false)
const form = ref({
  id: '',
  userName: '',
  password: '',
  permissions: []
})

const allPermissions = ref([])

const open = async (row) => {
  form.value = row
  dialogVisible.value = true
  console.log(form.value)
  // 根据用户id, 回显权限
  // 1. 查询所有权限
  const res = await getAllPermissionService()
  allPermissions.value = res.data

  // 2. 设置已选择的权限
  if (row.permissions) {
    // 将字符串拆分成数组
    const permissionCodes = row.permissions.split(',')

    // 根据code从allPermissions中查找对应的id
    form.value.permissions = allPermissions.value
      .filter(permission => permissionCodes.includes(permission.code))
      .map(permission => permission.id)
  }
}

// 绑定表单
const formRef = ref(null)
// 通知父组件回显
const emit = defineEmits(['success'])

const onSubmit = async () => {
  // 修改权限
  if(form.value.id) {
    // 根据权限id, 提交修改
    await userSetAuthService({userId: form.value.id, permissionIds: form.value.permissions})
  } else {
    // 新增用户, 提交新增
    await userAddService({userName: form.value.userName, password: form.value.password, permissionIds: form.value.permissions})
  }
  // 关闭弹窗
  dialogVisible.value = false
  // 通知父组件回显
  emit('success')
}

// 暴露给父组件的方法
defineExpose({
  open
})
</script>

<template>
  <el-dialog 
  v-model="dialogVisible" 
  :title="form.id ? '修改用户权限' : '添加用户'">
    <el-form :model="form">
      <el-form-item label="用户名">
        <el-input v-model="form.userName" :disabled="!!form.id" />
      </el-form-item>
      <el-form-item label="密码" v-if="!form.id">
        <el-input v-model="form.password" type="password" />
      </el-form-item>
      <el-form-item label="权限">
        <el-select v-model="form.permissions" multiple>
          <el-option v-for="permission in allPermissions"
            :key="permission.id"
            :label="permission.description"
            :value="permission.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="onSubmit">确认</el-button>
    </template>
  </el-dialog>
</template>