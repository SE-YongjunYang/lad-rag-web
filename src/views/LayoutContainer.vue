<script setup>
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
import { userLogoutService } from '@/api/user'
import { 
  SwitchButton,
  Management,
  EditPen,
  UserFilled,
  AlarmClock,
  Bell
 } from '@element-plus/icons-vue'


const userStore = useUserStore()
const router = useRouter()

const handleLogout = async () => {
    // 先提示用户是否确认退出
    await ElMessageBox.confirm('确认退出登录吗？', '温馨提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await userLogoutService()
    userStore.setToken('')
    userStore.setUserInfo({})
    router.push('/login')
}
</script>

<template>
    <el-container class="layout-container">
      <!-- 侧边栏 -->
      <el-aside width="200px" >
        <div>
          <img src="@/assets/lad-rag-logo.png" alt="Logo" style="width: 200px; height:auto;">
        </div>
        <el-menu
          router
          :default-active="$route.path"
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409EFF"
        >
          <el-menu-item index="/dataset/bgl">
            <el-icon><Management /></el-icon>
            <span>Kibana</span>
          </el-menu-item>
          <!-- <el-menu-item v-if="userStore.user?.userName === 'admin'" index="/user/list">
            <span>用户管理</span>
          </el-menu-item> -->
          <el-menu-item index="/detect">
            <el-icon><Bell /></el-icon>
            <span>异常检测设置</span>
          </el-menu-item>
          <el-menu-item index="/alarm">
            <el-icon><AlarmClock /></el-icon>
            <span>告警设置</span>
          </el-menu-item>
          <el-sub-menu index="/user">
              <!-- 多级菜单标题，使用具名插槽 -->
            <template #title>
              <el-icon><UserFilled /></el-icon>
              <span>个人中心</span>
            </template>
            
            <el-menu-item index="/user/password">
              <el-icon><EditPen /></el-icon>
              <span>修改密码</span>
            </el-menu-item>
            <el-menu-item index="/user/list" v-if="userStore.user?.userName === 'admin'">
              <el-icon><EditPen /></el-icon>
              <span>用户列表</span>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>
  
      <!-- 主体内容 -->
      <el-container>
        <el-header>
            <span>欢迎，{{ userStore.user?.userName }}</span>
            <el-button type="info" command="logout" :icon="SwitchButton" plain @click="handleLogout">
              退出登录
            </el-button>
        </el-header>
        <el-main>
          <router-view />
        </el-main>
      </el-container>

    </el-container>
</template>
<style scoped lang="scss">
.layout-container {
  height: 100vh;
  .el-aside {
    background-color: #232323;
    .el-menu {
      border-right: none;
    }
  }
  .el-header {
    display: flex;
    align-items: center;
    justify-content: space-between; /* 将内容分散对齐，实现居右效果 */
    padding: 0 20px;
    background-color: #ffffff;
    border-bottom: 1px solid #e6e6e6;
  }
}
</style>