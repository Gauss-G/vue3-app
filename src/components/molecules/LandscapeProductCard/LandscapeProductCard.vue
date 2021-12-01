<template>
  <div :class="['landscape-product-card', { 'card-mask': showMask, 'landscape-product-card--small': small }]">
    <template v-if="isBuriedPointSwitch">
      <!-- <product-exposure-observer :product="product" :extendedAttributes="gioExtendedAttributes" /> -->
    </template>
    <!-- 产品缩略图 区分线上可售与线上不可售-->
    <a
      v-if="!isMainProduct"
      :class="['landscape-product-card__image', { 'landscape-product-card__image--small': small }]"
      :href="productUrl"
    >
      <img v-lazy="product.image" alt="" srcset="" class="skeleton-image" />
      <div v-if="outOfStock && showImgOutStock" class="out-of-stock">
        <span>{{ t('detail.out_of_stock') }}</span>
      </div>
    </a>
    <div v-else :class="['landscape-product-card__image', { 'landscape-product-card__image--small': small }]">
      <img v-lazy="product.image" alt="" srcset="" class="skeleton-image" />
      <div v-if="outOfStock && showImgOutStock" class="out-of-stock">
        <span>{{ t('detail.out_of_stock') }}</span>
      </div>
    </div>
    <!-- 产品描述信息 -->
    <div class="landscape-product-card__description">
      <div
        v-if="showTag && product.priceDisplay && product.priceDisplay.tags && product.priceDisplay.tags.length"
        class="product-price-tags"
      >
        <i-tag
          v-for="(item, index) in product.priceDisplay.tags"
          :key="product.id + '-' + index"
          :label="item.name"
          :custom-style="{ color: '#' + item.colorHex }"
        />
      </div>
      <a class="product-name" :href="isMainProduct ? 'javascript:void(0);' : productUrl">
        <h2 :class="['product-name', { 'product-name--small': small }]">
          {{ product.name }}
        </h2>
        <!-- 商品描述 -->
        <p :class="['product-specification', { 'product-specification--small': small }]">
          {{ product.fullDescription }}
        </p>
        <p v-if="isPriceDisplayPosition" class="landscape__price">
          <i-price class="landscape__price" :product="product" :show-family-price="showFamilyPrice" :variant="variant" />
        </p>
        <p v-if="showRankingTag && rankingDesciption" class="product-ranking-description">
          {{ rankingDesciption.name }}
        </p>
        <slot name="product-other-attributes" />
      </a>
      <div :class="['landscape-product-card__amount', { 'landscape-product-card__amount--small': small }]">
        <div v-if="quantityEditable && !countDisable" class="landscape-product-card__count">
          <i-count-box
            :value="product.quantity"
            :disabled="!product.isCombined && !isMainProduct"
            @change="onQuantityChanged"
          />
        </div>
        <div v-if="!isPriceDisplayPosition" class="landscape-product-card__price">
          <i-price
            class="landscape-product-card__price"
            :product="product"
            :show-family-price="showFamilyPrice"
            :variant="variant"
          />
        </div>
      </div>
      <div v-if="isUnavailable" class="product-unavailable-tag">
        <span class="product-unavailable-tag__dot" />
        <span class="product-unavailable-tag__text">{{ unavailableTip }}</span>
      </div>
    </div>
    <div :class="['landscape-product-card__operation', { 'landscape-product-card__operation--small': small }]">
      <!-- <template v-if="mainProduct.id">
        <product-exposure-observer
          :targetId="`product-${_uid}-${product.id}-${mainProduct.id}`"
          :product="product"
          :extendedAttributes="getAttributes"
        />
      </template> -->
      <slot name="operation" />
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed, onMounted, onUnmounted } from 'vue'
import IPrice from 'atoms/IPrice/IPrice.vue'
import ICountBox from 'atoms/ICountBox/ICountBox.vue'
import ITag from 'atoms/ITag/ITag.vue'
import base from 'composables/base'
import { toast } from 'atoms/IToast/index'
import { generateLink } from '@/utils/index'
const { t, locale } = base()
// import ProductUnavailableTag from '~/components/business/product/ProductUnavailableTag'
const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  /** 埋点开关 */
  isBuriedPointSwitch: {
    type: Boolean,
    default: true,
  },
  // 价格显示位置 右下角/中间 默认右下角
  isPriceDisplayPosition: {
    type: Boolean,
    default: false,
  },
  isMainProduct: {
    type: Boolean,
    default: false,
  },
  quantityEditable: {
    type: Boolean,
    default: false,
  },
  countDisable: {
    type: Boolean,
    default: false,
  },
  showFamilyPrice: {
    type: Boolean,
    default: false,
  },
  showMask: {
    type: Boolean,
    default: false,
  },
  showTag: {
    type: Boolean,
    default: false,
  },
  showRankingTag: {
    type: Boolean,
    default: false,
  },
  showUnavailableTag: {
    type: Boolean,
    default: true,
  },
  /**
     * 缺货时是否给图片打上缺货样式
     */
  showImgOutStock: {
    type: Boolean,
    default: true,
  },
  variant: {
    type: String,
    default: 'normal',
    validator: value => ['normal', 'enlarge'].includes(value),
  },
  small: {
    type: Boolean,
    default: false,
  },
  enableProductExposure: {
    type: Boolean,
    default: false,
  },
})
const gioExtendedAttributes = computed(() => {
  return props.dataModuleName
    ? {
      module_var: props.dataModuleName,
    }
    : null
})
const outOfStock = computed(() => {
  return props.product.stockStatus === 'OUTOFSTOCK' || !props.product.onlineSalable
})
const rankingDesciption = computed(() => {
  return props.product.productTags?.reduce((prev, item) => {
    if (item.type === 'RANKING_DESC')
      return item
    return prev
  }, null)
})
const productSpecification = computed(() => {
  const specification = []
  if (props.product.productType)
    specification.push(props.product.productType)

  if (props.product.designText)
    specification.push(props.product.productType)

  return specification.join(' ')
})
const displayQuantity = computed(() => {
  return `x ${props.product.quantity}`
})
const productUrl = computed(() => {
  // const showId = this.utils.getDetailUrl(props.product, true, this.$store.state.locale)
  const showId = props.product.id || props.product.productId
  return generateLink(`/p/${showId}`, locale.value)
})
const isUnavailable = computed(() => {
  return !props.product.onlineSalable || props.product.stockStatus === 'OUTOFSTOCK'
})
const unavailableTip = computed(() => {
  if (props.product.saleableInfo && !props.product.saleableInfo.saleable)
    return props.product.saleableInfo.addToCartErrorMsg
  else if (!this.product.onlineSalable)
    return t('cart.not_available_for_the_time_being')
  else if (this.product.stockStatus === 'OUTOFSTOCK')
    return t('cart.sold_out_online')
  else
    return ''
})
const onQuantityChanged = (payload) => {
  // 当Quantity超出可加购的最大数量时，需toast提示，维持原数量不变
  if (payload.value > props.product.maximumOrderQuantity) {
    // 提示超出加购数量消息
    // this.toasted.show(
    //   `[${props.product.name}]${this.t('detail.the_maximum_quantity_that_can_be_purchased_is')}${
    //     props.product.maximumOrderQuantity
    //   }`,
    // )
    toast({
      text: `[${props.product.name}]${t('product.the_maximum_quantity_that_can_be_purchased_is')}${
        props.product.maximumOrderQuantity
      }`,
      duration: 3000,
      textPosition: 'center',
    })
  }
  else {
    // eslint-disable-next-line vue/no-mutating-props
    props.product.quantity = payload.value < 1 ? 1 : payload.value
  }
}
</script>

<style scoped lang="scss">
.landscape-product-card {
  width: 100%;
  display: flex;
  position: relative;
  cursor: pointer;
  justify-content: flex-start;

  .product-price-tags {
    margin-bottom: 0.04rem;
  }

  .landscape-product-card__checkbox {
    display: flex;
    flex: 0 0 0.43rem;
  }

  .landscape-product-card__image {
    position: relative;
    // padding-top: .16rem;
    flex: 0 0 calc(26%);

    &.landscape-product-card__image--small {
      flex: 0 0 0.48rem;
      padding-top: 0.06rem;
    }

    img {
      width: calc(100%);
      object-fit: cover;
    }

    .skeleton-image::before {
      content: '';
      position: absolute;
      top: 0.16rem;
      left: 0;
      background-color: #f5f5f5;
      border-radius: 0.04rem;
      width: 0.6rem;
      height: 0.6rem;
    }

    .out-of-stock {
      position: absolute;
      display: flex;
      width: 100%;
      height: 100%;
      max-height: 0.08rem;
      top: 0.16rem;

      > span {
        font-size: 0.12rem;
        line-height: 0.2rem;
        max-width: 0.48rem;
        color: #fff;
        margin: auto;
        z-index: 1;
        text-align: center;
      }

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0.5;
        background: radial-gradient(circle, #000 0%, #000 50%, #fff 52%, #fff 100%);
      }
    }
  }

  .landscape-product-card__description {
    max-width: 2.5rem;
    padding-left: 0.1rem;
    padding-right: 0.24rem;
    flex: auto;

    .product-name {
      font-weight: 600;
      font-size: 0.14rem;
      line-height: 0.18rem;
      color: #000;

      .landscape__price {
        :deep(.item-big-price) {
          text-align: left;
          font-size: 0.14rem;
          line-height: 0.16rem;
        }
      }

      &.product-name--small {
        white-space: nowrap;
        text-overflow: ellipsis;
        width: 1.2rem;
        font-size: 0.12rem;
        line-height: 0.14rem;
        overflow: hidden;
      }
    }

    .product-ranking-description {
      display: inline-block;
      background: #fff3db;
      color: #ce8e14;
      font-size: 0.09rem;
      line-height: 0.13rem;
      border-radius: 2px;
      padding: 0.03rem 0.05rem;
      white-space: nowrap;
    }

    .product-specification {
      padding-top: 0.05rem;
      font-size: 0.12rem;
      line-height: 0.18rem;
      color: #666;

      &.product-specification--small {
        font-size: 0.12rem;
        line-height: 0.14rem;
        white-space: nowrap;
        text-overflow: ellipsis;
        width: 1.2rem;
        overflow: hidden;
      }
    }
  }

  .landscape-product-card__operation {
    position: absolute;
    display: flex;
    height: calc(100% - 0.2rem);
    right: 0.04rem;
    margin: 0 auto;
    justify-items: flex-start;

    div,
    button,
    a {
      margin: auto;
    }

    &.landscape-product-card__operation--small {
      right: 0.08rem;
      align-items: flex-end;

      div,
      button,
      a {
        margin: inherit;
      }

      :deep(.btn__inner) {
        height: 0.3rem;
        width: 0.3rem;
      }

      :deep(.btn__icon) {
        height: 0.16rem;
        width: 0.16rem;
      }
    }
  }

  .landscape-product-card__amount {
    display: flex;
    justify-content: flex-start;
    margin-top: 0.16rem;
    min-height: 0.32rem;

    &.landscape-product-card__amount--small {
      margin-top: 0.07rem;
      min-height: 0.18rem;

      :deep(.item-big-price) {
        font-size: 0.12rem;
        line-height: 0.14rem;
      }
    }

    .landscape-product-card__count {
      flex: auto;
    }

    .landscape-product-card__price {
      flex: initial;
      margin: auto 0;
    }

    .landscape-product-card__quantity {
      flex: initial;
      font-size: 0.12rem;
      line-height: 0.24rem;
      border: 1px solid #dfdfdf;
      border-radius: 0.24rem;
      padding: 0 0.16rem;
      margin: auto 0;
    }
  }

  // &.card-mask {
  //   opacity: 0.5;
  //   pointer-events: none;
  // }
}

.product-unavailable-tag {
  margin-top: 0.08rem;
  line-height: 0.18rem;
  height: 18px;

  .product-unavailable-tag__dot {
    display: inline-block;
    background: #e00751;
    margin: 6px 0;
    border-radius: 50%;
    width: 0.07rem;
    height: 0.07rem;
    vertical-align: middle;
  }

  .product-unavailable-tag__text {
    font-style: normal;
    font-weight: normal;
    font-size: 0.12rem;
    line-height: 0.18rem;
    color: #484848;
    vertical-align: middle;
  }
}
</style>
