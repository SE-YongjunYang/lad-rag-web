import axios from 'axios'
import { useUserStore } from '@/stores'
import router from '@/router'

const baseURL = 'http://localhost:8080'

const request = axios.create({
  // TODO 1. 基础地址，超时时间
  baseURL,
  timeout: 10000
})

// 添加请求拦截器
request.interceptors.request.use(
  (config) => {
    // 2. 携带token
    // !!!!!需要将userStore放到拦截器中进行初始化，否则会造成循环依赖
    const userStore = useUserStore()
    if (config.url !== '/login' && userStore.token) {
        // TODO 头部的名称Authorization考虑换为Token
      config.headers.token = userStore.token
    }
    return config
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
request.interceptors.response.use(
  (response) => {
    // 3. 处理业务失败
    if (response.data.code !== 1) {
      ElMessage.error(response.data.message || '服务异常')
      return Promise.reject(response.data)
    }
    // TODO 4. 摘取核心响应数据
    return response.data
  },
  (error) => {
    // TODO 5. 处理401错误, 跳转登录页
    // 错误的特殊情况 => 401 权限不足 或 token 过期 => 拦截到登录
    // 可选链操作符?. 用于检查对象是否存在
    if (error.response?.status === 401) {
      router.push('/login')
    }
    // TODO 6. 处理其他错误
    ElMessage.error(error.response?.data?.message || '服务异常')
    return Promise.reject(error)
  }
)

// 导出axios实例
export default request
// 导出基准地址
export { baseURL }
