const routes: {}[] = [
  {
    path: '/cn/:lang/comparison',
    name: 'comparison',
    component: () => import('./views/comparison.vue'),
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
