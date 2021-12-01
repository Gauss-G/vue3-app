import { createApp } from 'vue'
import lazyPlugin from 'vue3-lazy'
// import { useI18n } from 'vue-i18n'
import App from './app.vue'
import locales from './locales'
// import gio from './plugin/gio'
import router from './router'
import store from './store'

router.beforeEach((to, from, next) => {
  if (['zh', 'en'].includes(to?.params?.lang))
    locales.global.locale.value = to?.params?.lang

  next()
})
createApp(App)
  .use(store)
  .use(router)
  .use(locales)
  .use(lazyPlugin, {})
  // .use(gio)
  .mount('#app')
