<template>
  <div class="product-bag-add-panel">
    <LandscapeProductCard
      class="product-bag-add-panel__card"
      :product="product"
      :show-family-price="true"
      :quantity-editable="quantityEditable"
      :count-disable="true"
    />

    <i-button
      class="product-bag-add-panel__btn"
      type="button"
      :small="true"
      variant="emphasised"
      :fluid="true"
      :loading="bagAdding"
      @click="addToBag"
    >
      {{ t('cart.add_cart') }}
    </i-button>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import IButton from 'atoms/IButton/IButton.vue'
import LandscapeProductCard from 'molecules/LandscapeProductCard/LandscapeProductCard.vue'
import { addShoippingCartByProducts } from 'composables/shoppingBag/shoppingBag'
import { toast } from 'atoms/IToast/index'
import base from 'composables/base'
const { t } = base()
const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  quantityEditable: {
    type: Boolean,
    default: true,
  },
})
const emits = defineEmits(['addCartSuccess'])
const addToBag = async() => {
  const res = await addShoippingCartByProducts([props.product])
  if (res.isSuccess) emits('addCartSuccess')
  else
    toast({ text: t('cart.failed_to_add_shopping_bag'), duration: 3000, textPosition: 'center' })
}
</script>

<style lang="scss" scoped>
.product-bag-add-panel {
  display: flex;
  position: relative;
  padding: 0.2rem;
  justify-content: flex-start;
  align-content: center;
  flex-direction: column;

  .product-bag-add-panel__btn {
    padding-top: 0.2rem;
  }
}
</style>
