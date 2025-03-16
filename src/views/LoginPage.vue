<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
import { User, Lock } from '@element-plus/icons-vue'
import { userLoginService } from '@/api/user'

// const form = ref({ username: '', password: '' })
// const loading = ref(false)
// const userStore = useUserStore()
// const router = useRouter()

// const handleLogin = async () => {
//   try {
//     loading.value = true
//     await userStore.login(form.value)
//     router.push('/')
//   } finally {
//     loading.value = false
//   }
// }
// form数据对象，与el-form的:model绑定
const ruleForm = ref({
  userName: '',
  password: ''
})
// 校验规则对象(无需响应式)，与el-form的:rules绑定
// 1. 非空校验非空校验 required:true message消息提示，trigger触发校验的时机 blurchange
// 2. 长度校验 min:xx，max:xx
// 3. 正则校验 pattern: 正则规则 \S 非空字符
// 4. 自定义校验 直接写校验函数
//    validator: (rule, value, callback)
//    (1) rule 校验规则对象
//    (2) value 所校验表单元素的表单值
//    (3) callback
//         - callback() 校验成功
//         - callback(new Error('错误消息提示')) 校验失败
const rules = {
  userName: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, message: '用户名长度不能少于3位', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    // 正则表达式里不能出现空格
    { pattern: /^\S{6,15}$/, message: '密码必须为6 -15位非空字符', trigger: 'blur' }
  ],
}
// 表单对象，与el-form的ref绑定
const form = ref(null)
const userStore = useUserStore()
const router = useRouter()

const login = async () => {
  // 表单校验
  await form.value.validate()
  // 校验通过，开始登录
  const res = await userLoginService(ruleForm.value)
  // 登录成功，保存token到store并持久化
  console.log(res)
  res.data && userStore.setUserInfo(res.data)
  

  ElMessage.success('登录成功')
  // 登录成功，跳转首页
  router.push('/')
}

</script>


<template>
  <!-- 
    1. 结构相关
      el-row表示一行，一行分成24份el-col表示列
      (1):span="12" 代表在一行中，占12份(50%)
      (2):span="6" 表示在一行中，占6份(25%)
      (3):offset="3"代表在一行中，左侧margin份数

      el-form 整个表单组件
      el-form-item 表单的一行 (一个表单域)
      el-input 表单元素(输入框)
    2. 校验相关
      (1)el-form => :model="ruleForm"       绑定的整个form的数据对象{XXX，XXX，XXX}
      (2)el-form => :rules="rules"          绑定的整个rules规则对象{ XXX， XXX，XXX}
      (3)el-form-item => v-model="ruleForm.xxx"  给表单元素，绑定form的子属性
      (4)el-form-item => :prop="xxx"        prop配置生效的是哪个校验规则 (和rules中的字段要对应)
  -->
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <!-- 登录相关 -->
      <el-form :model="ruleForm" :rules="rules" ref="form" size="large" autocomplete="off">
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input v-model="ruleForm.userName" :prefix-icon="User" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="ruleForm.password"
            name="password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
        </el-form-item> -->
        <el-form-item>
          <el-button @click="login" class="button" type="primary" auto-insert-space>登录</el-button>
        </el-form-item>
        <!-- <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = true"> 注册 → </el-link>
        </el-form-item> -->
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;
  .bg {
    background:
      url('@/assets/lad-rag-logo.png') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    .title {
      margin: 0 auto;
    }
    .button {
      width: 100%;
    }
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
