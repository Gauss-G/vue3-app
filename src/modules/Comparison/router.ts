const routes: {}[] = [
  {
    path: '/cn/:lang/comparison',
    name: 'comparison',
    component: () => import('./views/comparison.vue'),
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('./views/home/index.vue'),
  },
  {
    path: '/cn/:lang',
    name: 'root',
    redirect: (to) => {
      return `/cn/${to.params.lang}/comparison`
    },
  },
  {
    path: '/',
    name: '',
    redirect: '/cn/zh/comparison',
  },
]

export default routes
