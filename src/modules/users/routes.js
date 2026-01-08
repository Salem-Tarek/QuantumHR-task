import { routePermissions } from "@/enums"

const routes = [
  {
    path: '/',
    name: 'users-list',
    component: () => import('./pages/List.vue'),
    meta: { needAuth: true }
  }
]
  
export default routes