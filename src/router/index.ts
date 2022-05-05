import { createRouter, createWebHistory } from 'vue-router'
import createNavigationGuards from './guards'
import { routes } from './route-config'

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

createNavigationGuards(router)

export default router
