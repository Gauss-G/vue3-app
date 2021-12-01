import {
  createRouter,
  createWebHistory,
  // eslint-disable-next-line import/named
  RouteRecordRaw,
} from 'vue-router'
import { routerGuard } from '@/utils'

const domainRouterFiles = import.meta.globEager('../src/modules/**/router.ts')
const domainRoutes: RouteRecordRaw[] = []
Object.entries(domainRouterFiles)
  .forEach((routerFile) => {
    domainRoutes.push(...routerFile[1].default)
  })

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/:pathMatch(.*)',
      name: 'notFound',
      component: () => import('./views/notFound.vue'),
    },

    ...domainRoutes,
  ],
})

export default routerGuard(router)
