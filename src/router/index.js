import { createRouter, createWebHistory } from 'vue-router'

import { useAuthStore } from '@/modules/auth/store';
import { routes } from './routes.js'
import { useAppToast } from '@/composables/useAppToast'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...routes,
    {
      path: '/:catchAll(.*)',
      redirect: '/',
    }
  ],
})
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const { showToast } = useAppToast()

  const hasAccess = authStore.isLogged

  if (!to.meta.needAuth && to.name !== 'login') {
    return next()
  }

  if (to.name === 'login') {

    if (hasAccess) {
      return next('/')
    }

    return next()
  }

  if (hasAccess) {
    return next()
  }

  showToast({
    message: 'You have to login first',
    title: 'Error!',
    type: 'error'
  })

  return next('/login')
})

export default router
