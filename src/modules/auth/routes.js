const routes = [
    {
      path: '/login',
      name: 'login',
      component: () => import('./pages/sign-in.vue'),
      meta: { layout: false }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('./pages/profile.vue'),
      meta: { layout: true, needAuth: true }
    },
  ]
    
  export default routes