<!-- 虚拟商品详情 -->
<template>
  <div class="virtual-product-detail" :class="{'pc':!isH5}">
    <div v-if="!isH5" class="virtual-product-detail__title">
      <span>{{ t('cart.product_component_list') }}</span>
    </div>
    <div class="virtual-product-detail__thumbnail">
      <IIamge :src="thumbnailLeft" classes="thumbnail-left"></IIamge>
      <IIamge :src="thumbnailRight" classes="thumbnail-right"></IIamge>
    </div>
    <div class="virtual-product-detail__description">
      <CartItemDescription :product="virtualProduct" size="large" />
      <IPrice :product="virtualProduct"></IPrice>
    </div>
    <i-divider class="virtual-product-detail__divider" />
    <div class="virtual-product-detail__items">
      <div v-for="item in virtualProduct.childItems" :key="item.product.productId">
        <virtual-product-item
          :product="item.product"
          :quantity="item.quantity"
        />
        <i-divider class="virtual-product-item__divider" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, computed } from 'vue'
import IIamge from 'atoms/IImage/IImage.vue'
import base from 'composables/base'
import IPrice from 'atoms/IPrice/IPrice.vue'
import IDivider from 'atoms/IDivider/IDivider.vue'
import CartItemDescription from '../CartItemDescription/CartItemDescription.vue'
import VirtualProductItem from './VirtualProductItem.vue'
const { t, isH5 } = base()
const props = defineProps({
  virtualProduct: {
    type: Object,
    default() {
      return {}
    },
  },
})
const thumbnailLeft = computed(() => {
  return props.virtualProduct.detailImages?.length > 0 ? props.virtualProduct.detailImages[0] : ''
})
const thumbnailRight = computed(() => {
  return props.virtualProduct.detailImages?.length > 1 ? props.virtualProduct.detailImages[1] : ''
})
</script>

<style lang="scss" scoped>
.virtual-product-detail {
  max-width: 100vw;
  width: 100%;
  display: flex;
  flex-direction: column;

  .virtual-product-detail__thumbnail {
    display: flex;
    justify-content: space-around;
    padding: 20px;
  }

  .virtual-product-detail__description {
    display: flex;
    justify-content: space-between;
    padding: 0.2rem;

    .price {
      margin-top: 0.02rem;

      .item-big-price {
        font-size: 0.16rem;
      }
    }
  }

  .virtual-product-detail__divider {
    margin: 0 0.2rem 0.2rem 0.2rem;
  }

  .thumbnail-right,
  .thumbnail-left {
    width: 1.2rem;
    height: 1.2rem;
    -o-object-fit: contain;
    object-fit: contain;
  }

  .virtual-product-detail__title {
    font-weight: bold;
    font-size: 22px;
    line-height: 32px;
    padding: 0.2rem 0.5rem;
  }
}

.pc {
  .virtual-product-detail__items,
  .virtual-product-detail__description,
  .virtual-product-detail__thumbnail {
    margin: 0 0.3rem;
  }

  .virtual-product-detail__items {
    border: 1px solid #f5f5f5;
    box-sizing: border-box;
    border-radius: 4px;
    padding: 0.2rem 0;
    margin-bottom: 0.3rem;
  }

  .virtual-product-item__divider {
    border-top: 1px solid #f5f5f5;
    margin: 0 0.2rem 0.2rem 0.2rem;
  }
}
</style>
