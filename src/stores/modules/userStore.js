import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 数据
  const user = ref({
    id: '',
    userName: '',
    permissions: [],
  })
  const token = ref('')
  const setToken = (t) => {
    token.value = t
  }
  const setUserInfo = (u) => {
    // console.log('setUserInfo', u)
    user.value = u
    token.value = u.token
    user.value.permissions = user.value.permissions ? user.value.permissions.split(',') : []
  }
  const hasPermission = (permission) => {
    return user.value.permissions.includes(permission)
  }
  return {
    user,
    token,
    setToken,
    hasPermission,
    setUserInfo
  }
},
// 通过插件持久化
{
  persist: true,
})