<!-- 库存地址选择 -->
<template>
  <div>
    <H5template
      v-if="isH5"
      v-model:value="show"
      :product-ids="productIds"
      @change="handleChange"
      @close="close"
    />
    <PCtemplate
      v-else
      v-model:value="show"
      :product-ids="productIds"
      @change="handleChange"
      @close="close"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, defineProps, defineEmits } from 'vue'
import base from 'composables/base'
import ILayer from 'atoms/ILayer/ILayer.vue'
import commonControl from 'composables/common/common'
import H5template from './H5template.vue'
import PCtemplate from './PCtemplate.vue'
import { deepClone, _local } from '@/utils/helper'
// import { publicService } from '~/mixins/business/publicService'
const props = defineProps({
  value: {
    type: Boolean,
  },
  // 产品id信息
  productIds: {
    type: Array,
    default() {
      return []
    },
  },
  // 是否显示有货无货的标识和图标
  stockDetail: {
    type: Boolean,
    default: false,
  },
  // 默认值:
  default: {
    type: String,
    default: '',
  },
})
const emits = defineEmits(['update:value', 'change', 'close'])
const { t, isH5 } = base()
const show = ref(false)
watch(() => props.value, (newVal) => {
  show.value = newVal
})
watch(() => show.value, (newVal) => {
  emits('update:value', newVal)
})
const handleChange = (data) => {
  emits('change', data)
}
const close = () => {
  emits('close')
}
</script>

<style lang="scss" scoped>
.stockAddress {
  position: relative;
}
</style>
