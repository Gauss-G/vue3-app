<template>
  <div class="item-price">
    <div
      class="item-big-price"
      :class="{ colorDf: !item.offShelf }"
      :style="{ color: item.product.price.type == 'FAM' && item.product.hasFamilyCard ? '#0058A3' : '#111111' }"
    >
      <!-- 会员商品 && 当前用户是会员，那么上面这行显示会员价，，，否则，上面显示非会员价，下面显示会员价 -->
      ¥{{
        (item.product.price.type == 'FAM' && item.product.hasFamilyCard) ||
          item.product.price.type == 'PMP' ||
          item.product.price.type == 'NLP' ||
          item.product.price.type == 'TRO'
          ? formatPrice(item.product.price.specialPrice, 2)
          : formatPrice(item.product.price.regularPrice, 2)
      }}
    </div>
    <div
      v-if="
        item.product.price.type == 'FAM' ||
          item.product.price.type == 'PMP' ||
          (item.product.price.type == 'TRO' && item.product.priceDisplay.originalPriceLineThrough) ||
          item.product.price.type == 'NLP'
      "
      class="item-prc"
    >
      <span v-if="item.product.price.type == 'FAM'" class="member-price-text" :class="{ colorDf: !item.offShelf }">
        {{ item.product.hasFamilyCard ? t('cart.nonMemberPrice') : t('cart.memberPrice') }}
      </span>
      <span
        :class="{ colorDf: !item.offShelf }"
        :style="{
          textDecoration:
            (item.product.price.type == 'TRO' && item.product.priceDisplay.originalPriceLineThrough) ||
            item.product.price.type == 'PMP' ||
            item.product.price.type == 'NLP'
              ? 'line-through'
              : '',
          color: item.product.price.type == 'FAM' && !item.product.hasFamilyCard ? '#0058A3' : '#666'
        }"
      >¥{{
        formatPrice(
          item.product.price.type == 'FAM' && !item.product.hasFamilyCard
            ? item.product.price.specialPrice
            : item.product.price.regularPrice,
          2
        )
      }}
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, defineProps } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatPrice } from '@/utils/helper'
const { t } = useI18n()
const props = defineProps({
  error: {
    type: String,
    required: true,
    default: 'success',
  },
  item: {
    type: Object,
    required: true,
  },
})
</script>

<style scoped lang="scss">
.item-price {
  margin-top: 0.05rem;

  .item-big-price {
    font-weight: bold;
    font-size: 0.14rem;
    line-height: 0.22rem;
    color: #111;
    text-align: right;
  }

  .item-prc {
    font-size: 0.12rem;
    line-height: 0.16rem;
    text-align: right;
    // min-width: 1.32rem;//适配英文状态
  }

  .member-price-text {
    color: #666;
    text-align: right;
    font-size: 0.12rem;
    line-height: 0.16rem;
  }
}
</style>
