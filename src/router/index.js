import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/LoginPage.vue')
  },
  {
    path: '/',
    component: () => import('@/views/layout/LayoutContainer.vue'),
    redirect: '/dataset/bgl',
    children: [
      {
        path: '/dataset/bgl',
        name: 'BGL',
        component: () => import('@/views/dataset/BGLList.vue'),
        meta: {
          requiredPermissions: ['data.BGL.r'] // 需要 data.bgl.r 权限
        }
      },
      {
        path: '/user/list',
        name: 'UserList',
        component: () => import('@/views/user/UserList.vue'),
        meta: { requiresAdmin: true }
      }
    ]
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/403.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  if (!userStore.token && to.path!== '/login') 
    return { path: '/login' }
  
  // 检查路由的权限要求
  if (to.meta.requiredPermissions) {
    console.log('requiredPermissions', to.meta.requiredPermissions)
    const hasPermission = to.meta.requiredPermissions.some(permission =>
      userStore.hasPermission(permission))
    if (!hasPermission) {
      next('/403') // 没有权限，跳转到 403 页面
      return
    }
  }
  if(to.meta.requiresAdmin &&!userStore.user.userName === 'admin') {
    next({ path: '/' })
  }
  // 继续执行路由
  next()
})

export default router
