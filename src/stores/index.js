import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

const pinia = createPinia()
// 使用持久化
pinia.use(persist)

export default pinia
export * from './modules/userStore'