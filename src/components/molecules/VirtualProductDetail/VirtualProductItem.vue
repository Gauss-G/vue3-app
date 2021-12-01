<template>
  <a class="virtual-product-item" :href="productUrl">
    <div class="virtual-product-item__thumbnail">
      <IIamge :src="mainImageUrl" />
      <span v-if="product.stockStatus == 'OUTOFSTOCK'" class="unavailable-tag">
        {{ t('cart.not_available_for_the_time_being') }}
      </span>
    </div>
    <div class="virtual-product-item__body">
      <!-- 商品名称 -->
      <p class="product-name">
        {{ product.name }}
      </p>
      <!-- 商品默认描述信息 -->
      <p>{{ defaultDescription }}</p>
      <div class="virtual-product-item__amount">
        <i-price :product="product"></i-price>
        <span class="quantity"> {{ displayQuantity }} </span>
      </div>
    </div>
  </a>
</template>

<script>
import { computed } from 'vue'
import IIamge from 'atoms/IImage/IImage.vue'
import IPrice from 'atoms/IPrice/IPrice.vue'
import { useI18n } from 'vue-i18n'
import base from 'composables/base.ts'
import { generateLink } from '@/utils/index'

export default {
  components: {
    IPrice,
    IIamge,
  },

  props: {
    product: {
      type: Object,
      required: true,
      default: () => {
        return {}
      },
    },
    quantity: {
      type: Number,
      default: 1,
    },
  },
  setup(props) {
    const {
      t,
      locale,
    } = base()
    const productUrl = computed(() => generateLink(`/p/${props.product.productFullId}`, locale.value))
    return {
      t,
      locale,
      productUrl,
    }
  },
  computed: {
    mainImageUrl() {
      return this.product.image || (this.product.images && this.product.images[0].url)
    },
    defaultDescription() {
      return this.product.productDesc?.length > 0 ? this.product.productDesc.join(',') : null
    },
    displayQuantity() {
      return `x${this.quantity}`
    },
  },
}
</script>

<style scoped lang="scss">
.virtual-product-item {
  display: flex;
  flex: 0 1;
  flex-direction: row;
  padding-bottom: 0.2rem;

  .virtual-product-item__thumbnail {
    position: relative;
    display: flex;
    padding: 0 0.2rem;
    width: 1rem;
    height: 0.6rem;

    .i-image {
      width: 0.6rem;
      height: 0.6rem;
    }

    .unavailable-tag {
      position: absolute;
      width: 0.6rem;
      bottom: 0;
      background: #111;
      color: #fff;
      opacity: 0.5;
      font-size: 0.1rem;
      line-height: 0.2rem;
      text-align: center;
    }
  }

  .virtual-product-item__body {
    padding-right: 0.2rem;
    flex-grow: 1;

    .product-name {
      font-weight: bold;
      font-size: 0.12rem;
      line-height: 0.2rem;
      color: #111;
    }

    p {
      font-size: 0.12rem;
      line-height: 0.18rem;
      color: #484848;
    }

    &:deep(.price) {
      margin-top: 0;
    }

    &:deep(.item-big-price) {
      text-align: left;
    }

    .virtual-product-item__amount {
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      .quantity {
        font-weight: bold;
        font-size: 0.14rem;
        color: #111;
      }
    }
  }
}
</style>
