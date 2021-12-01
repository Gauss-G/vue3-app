<!-- 库存地址选择 -->
<template>
  <div>
    <headerMessage header-message-shown-page="shoppingBag" />
    <H5template v-if="isH5" />
    <PCtemplate v-else />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import base from 'composables/base'
import headerMessage from 'molecules/headerMessage/index.vue'
import H5template from './H5template.vue'
import PCtemplate from './PCtemplate.vue'

const { isH5, $store } = base()
const isLogin = computed(() => {
  return $store.getters['Common/hasLoggedIn']
})
if (isLogin.value)
  $store.dispatch('ShopCart/SET_CART_LIST')

</script>
