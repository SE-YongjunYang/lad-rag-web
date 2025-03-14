<script setup>
import { ref } from 'vue'
import UserDialog from './components/UserDialog.vue'
// import { ElMessageBox } from 'element-plus'
import { Edit, Delete } from '@element-plus/icons-vue'
import { userListService, userDeleteService } from '@/api/user'
const currentUser = ref(null)
const userList = ref([])
const isLoading = ref(false)

const getUserList = async () => {
  // 从接口获取用户列表 
  isLoading.value = true
  const res = await userListService()
  userList.value = res.data
  isLoading.value = false
}
// 调用
getUserList()

// 绑定弹窗
const dialog = ref(null)

const addUser = () => {
  // 调用组建的open方法，并传入空数据
  dialog.value.open({})
}

const editPermission = (row) => {
  // 调用组建的open方法，并传入需要修改的数据
  dialog.value.open(row)
}

const onSuccess = () => {
  // 刷新列表
  getUserList()
}

// const handleSubmit = (userData) => {
//   // 提交到接口
//   console.log('Submit:', userData)
// }

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
      <el-button type="primary" @click="addUser">添加用户</el-button>
    </div>
    <br/>
    
    <el-table :v-loading="isLoading" :data="userList" style="width: 100%">
      <!-- <el-table-column prop="id" label="ID" /> -->
      <el-table-column label="ID">
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="userName" label="用户名" />
      <el-table-column prop="permissions" label="权限">
        <template #default="{row}">
          <el-tag>{{ row.permissions }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{row}">
          <el-button :icon="Edit"
            round
            circle
            type="primary"
            @click="editPermission(row)"></el-button>
          <el-button :icon="Delete"
            round
            circle
            type="danger"
            @click="deleteUser(row.id)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <user-dialog ref="dialog" @success="onSuccess"></user-dialog>
  </div>
</template>
