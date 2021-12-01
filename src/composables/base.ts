// import {
//   ref
// } from 'vue'
import { computed } from 'vue-demi'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { deviceMobile } from '@/utils/helper'
// 基础
/**
 * 抛出 route, stor, locale等信息
 * @returns
 */
export default function base() {
  const {
    t,
    availableLocales,
    locale,
  } = useI18n()
  const $store = useStore()
  const isH5 = computed(() => {
    return $store.getters['Common/deviceMobile']
  })
  const $router = useRouter()
  const $route = useRoute()

  return {
    t,
    availableLocales,
    locale,
    deviceMobile,
    isH5,
    $router,
    $route,
    $store,
  }
}
