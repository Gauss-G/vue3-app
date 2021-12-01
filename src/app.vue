<template>
  <div class="main_container">
    <RouterView />
    <IPageLoading :loading="pageLoading" />
  </div>
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue'
import base from '@/composables/base'
import { debounce } from '@/utils/helper'
import { paramsFormat } from '@/utils'
import IPageLoading from '@/components/atoms/IPageLoading/index.vue'
import gioHooks from '@/utils/hooks/gio'
const { changeDeviceConfig } = gioHooks()

const query: {
  hideNavi?: 'true' | 'false' | ''
} = paramsFormat(location.href) || {}

const {
  isH5,
  $store,
} = base()

const pageLoading = computed(() => {
  return $store.getters['Common/pageLoading']
})

watch(isH5, (isH5) => {
  changeDeviceConfig(isH5 ? 'h5' : 'pc')
})

window.onresize = debounce(() => {
  $store.dispatch('Common/SET_DEVICEMOBILE')
}, 300)
$store.dispatch('Common/SET_HASLOGGEDIN')
$store.dispatch('Common/SET_DEVICEMOBILE')
$store.dispatch('Common/SET_HIDE_NAVIGATION', query.hideNavi === 'true')
</script>

<style lang="scss">
.main_container {
  position: initial;
}
</style>
