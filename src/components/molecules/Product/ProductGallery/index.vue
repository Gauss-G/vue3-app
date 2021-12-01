<template>
  <div class="product-gallery" @click.prevent.stop="handleClickMore">
    <IHyperlink color="black">
      {{ t('comparison.viewGallery') }}
    </IHyperlink>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue'
import base from 'composables/base'
import IHyperlink from '@/components/atoms/IHyperlink/index.vue'

const { t } = base()
const emits = defineEmits(['onShowMore'])

const props = defineProps({
  product: {
    type: Object,
    default: () => {},
  },
})

const handleClickMore = () => {
  emits('onShowMore', props?.product?.media || [])
}
</script>

<style scoped lang="scss">
.product-gallery {
  position: relative;
  display: inline-block;
  margin: -0.2rem 0 0;
  padding: 0;
  font-size: 0.14rem;
  line-height: 0.21rem;
}
</style>
