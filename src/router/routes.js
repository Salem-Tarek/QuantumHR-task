// =========================
// OLD MANUAL IMPORTS (KEPT FOR REFERENCE)
// =========================

// import authRoutes from '@/modules/auth/routes'
// import usersRoutes from '@/modules/users/routes'
// import rolesRoutes from '@/modules/roles/routes'
// import parentCategoriesRoutes from '@/modules/parentCategories/routes'
// import categoriesRoutes from '@/modules/categories/routes'
// import commissionsRoutes from '@/modules/commissions/routes'

// export const routes = [
//     ...authRoutes,
//     ...usersRoutes,
//     ...rolesRoutes,
//     ...parentCategoriesRoutes,
//     ...categoriesRoutes,
//     ...commissionsRoutes,
// ];


// =========================
// NEW DYNAMIC ROUTE LOADING
// =========================

// This will import all routes files under modules/*/routes.js
const routeModules = import.meta.glob('@/modules/**/routes.{js,ts}', {
    eager: true,
})
  
export const routes = Object.values(routeModules).flatMap(
    (module) => module.default || []
)