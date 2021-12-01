
<template>
  <div v-if="product.price" :class="['price', { flexable: flexable }]">
    <div
      :class="[
        'item-big-price',
        {
          'bti-background': showBTI,
          'item-big-price-vip': isVip
        }
      ]"
      :style="{ color: isVip ? '#0077C8' : '#111111' }"
    >
      <!-- 会员商品 && 当前用户是会员，那么上面这行显示会员价，，，否则，上面显示非会员价，下面显示会员价 -->
      <span v-if="variant === 'normal'">
        ¥{{
          (product.price.type == 'FAM' && showFamilyPrice) ||
            product.price.type == 'PMP' ||
            product.price.type == 'NLP' ||
            product.price.type == 'TRO'
            ? formatPrice(product.price.specialPrice, 2)
            : formatPrice(product.price.regularPrice, 2)
        }}
      </span>
      <span v-else-if="variant === 'enlarge'" v-enlarge-money="actualPrice"> </span>
      <span v-else> </span>
      <del v-if="showLineThroughPrice && hasPromotion" class="price-line-through">
        ¥{{ formatPrice(product.price.regularPrice, 2) }}
      </del>
      <del v-if="showLineThroughPrice && hasTROPrice" class="price-line-through">
        ¥{{ formatPrice(product.priceDisplay.originalPrice, 2) }}
      </del>
      <div v-if="product.price.type == 'FAM'" class="price-gray">
        <span>{{ t('cart.nonMemberPrice') }}: ¥{{ formatPrice(product.priceDisplay.originalPrice, 2) }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// REG 原价
// BTI 原价，无黄色标签
// New 原价，展示标签
// NLP 优惠价，无划线价，展示标签，无优惠截止日期
// TRO 优惠价，无划线价，展示标签，无优惠截止日期
// Promotion 优惠价，无划线价，展示标签，无优惠截止日期
// FAM
//   用户登录且为会员
//     展示标签
//     会员价，价格为会员蓝
//   用户登录且为非会员
//     展示标签
//     原价
//   用户未登录
//     展示标签
//     原价
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatPrice } from '@/utils/helper'
export default defineComponent({
  name: 'IPrice',

  props: {
    product: {
      type: Object,
      required: true,
    },
    /**
     * 用户登录且为会员时设置为true
     */
    showFamilyPrice: {
      type: Boolean,
      default: false,
    },
    showLineThroughPrice: {
      type: Boolean,
      default: false,
    },
    flexable: {
      type: Boolean,
      default: false,
    },
    variant: {
      type: String,
      default: 'normal',
      validator: (value: string) => ['normal', 'enlarge'].includes(value),
    },
  },
  setup() {
    const { t } = useI18n()
    return {
      t,
      formatPrice,
    }
  },
  computed: {
    isVip() {
      return this.product.price && this.product.price.type === 'FAM' && this.showFamilyPrice
    },
    showBTI() {
      return this.variant === 'enlarge' && this.product.priceDisplay?.currentPriceColorType === 'BTI'
    },
    hasPromotion() {
      return this.product.price?.type === 'NLP' || this.product.price?.type === 'PMP'
    },
    hasTROPrice() {
      return this.product.price?.type === 'TRO' && this.product.priceDisplay?.originalPriceLineThrough === true
    },
    actualPrice() {
      if (this.product?.price?.type === 'REG')
        return this.product?.price?.regularPrice
      else if (this.product?.price?.specialPrice)
        return this.product?.price?.specialPrice
      else
        return null
    },
  },
})
</script>

<style scoped lang="scss">
.price {
  position: relative;
  z-index: 1;

  &.flexable {
    display: flex;
    justify-items: center;
  }

  .item-big-price {
    font-weight: bold;
    font-size: 0.14rem;
    line-height: 0.22rem;
    display: flex;
    align-items: center;

    &-vip {
      &:deep(.withprice-symbol),
      &:deep(.withprice-price) {
        color: #007cc1;
      }
    }

    .price-gray {
      color: #767676;
      margin-left: 0.04rem;
      font-size: 0.12rem;
    }
  }

  .item-prc {
    font-size: 0.12rem;
    line-height: 0.16rem;
    // min-width: 1.32rem;//适配英文状态
  }

  .member-price-text {
    color: #666;
    text-align: right;
    font-size: 0.12rem;
    line-height: 0.16rem;
  }

  .bti-background {
    position: relative;
    background: #ffd800;
    padding: 0.02rem 0.04rem;
    height: 0.26rem;

    &::before {
      content: '';
      background: red;
      width: 100%;
      height: 0.26rem;
      position: absolute;
      left: 0;
      top: 0;
      z-index: -1;
      transform: translate(2px, 2px);
      -webkit-transform: translate(2px, 2px);
      -moz-transform: translate(2px, 2px);
      -ms-transform: translate(2px, 2px);
      -o-transform: translate(2px, 2px);
    }
  }

  .price-line-through {
    margin-left: 0.05rem;
    font-size: 0.12rem;
    line-height: 0.24rem;
    vertical-align: middle;
    font-style: normal;
    color: #484848;
    font-weight: 500;
  }

  &:deep(.withprice-price) {
    font-size: 0.18rem;
  }
}
</style>
