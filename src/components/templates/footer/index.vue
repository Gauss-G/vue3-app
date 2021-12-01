<!-- 库存地址选择 -->
<template>
  <div>
    <H5template v-if="isH5" />
    <PCtemplate v-else />
  </div>
</template>

<script setup>
import base from 'composables/base'
import H5template from './H5template.vue'
import PCtemplate from './PCtemplate.vue'
const { isH5 } = base()
</script>
