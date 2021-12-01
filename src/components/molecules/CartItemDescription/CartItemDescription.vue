<template>
  <div class="product-item-description">
    <!-- 购物袋商品名称 -->
    <p v-if="offShelf" :class="['product-item-description__name', `is-${size}`]">
      {{ product.name }}
    </p>
    <!-- 购物袋商品默认描述信息 -->
    <p>{{ defaultDescription }}</p>
    <!-- 购物袋商品附加描述信息 -->
    <p v-if="extraDescription">
      {{ extraDescription }}
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useI18n } from 'vue-i18n'
export interface descriptionModel {
  productFullId?: string
  size?: string
  offShelf?: string
  // product?: {
  //   type: object
  //   default: {
  //     productType: string
  //   }
  // }
}
export interface ProductModel{
  productType?: string
  designText?: string
}

export default defineComponent({
  name: 'CartItemDescription',
  props: {
    error: {
      type: String,
      required: true,
      default: 'success',
    },
    productFullId: {
      type: String,
      default: '',
    },
    product: {
      type: Object,
      default() {
        return {}
      },
    },
    size: {
      type: String,
      default: 'normal',
    },
    offShelf: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const { t, locale } = useI18n()
    const defaultDescription = computed(() => {
      const { offShelf, productFullId, product } = props
      if (!offShelf)
        return `${t('cart.article_no')} : ${productFullId}`

      if (product.designText && product.productType) {
        const descriptions = product.productType
          ? [product.designText, product.productType]
          : [product.designText]
        return locale.value === 'zh' ? descriptions.join('，') : descriptions.join(', ')
      }
      else {
        return product.designText || product.productType
      }
    })
    const extraDescription = computed(() => {
      const { product } = props
      return product.productDesc?.length > 1 ? product.productDesc.slice(1).join(',') : null
    })
    return {
      defaultDescription,
      extraDescription,
    }
  },
  // computed: {
  /**
     * 购物袋商品默认描述信息，颜色，尺寸，类型等
     */
  // defaultDescription() {
  //   const { t, locale } = useI18n()
  //   if (!this.offShelf)
  //     return `${t('cart.article_no')} : ${this.productFullId}`

  //   if (this.product.designText && this.product.productType) {
  //     const descriptions = this.product.productType
  //       ? [this.product.designText, this.product.productType]
  //       : [this.product.designText]
  //     return locale.value === 'zh' ? descriptions.join('，') : descriptions.join(', ')
  //   }
  //   else {
  //     return this.product.designText || this.product.productType
  //   }
  // },
  /**
     * 购物袋商品附加描述信息：虚拟商品货号等
     */
  // extraDescription() {
  //   return this.product.productDesc?.length > 1 ? this.product.productDesc.slice(1).join(',') : null
  // },
  // },
})
</script>

<style scoped lang="scss">
.product-item-description {
  .product-item-description__name {
    font-weight: bold;
    font-size: 0.12rem;
    line-height: 0.21rem;
    min-height: 0.21rem;
    color: #111;

    &.is-normal {
      font-size: 0.12rem;
      line-height: 0.21rem;
    }

    &.is-large {
      font-size: 0.16rem;
      line-height: 0.24rem;
    }
  }

  p {
    font-size: 0.12rem;
    line-height: 0.18rem;
    color: #484848;
    margin-top: 0.02rem;
  }
}
</style>
