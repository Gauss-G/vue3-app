<!--
  props:
    showPriceMax: 是否显示横线价
    type: 类型
      button: 选择规格弹窗按钮的价格（价格大小参差不齐，且没有黄色块，颜色为白色）
      default: 默认(有黄色块，价格大小参差不齐)
      neat: 整齐（价格大小是整齐的，且没有黄色块）
    direction: 横线价的方向 (横/竖)
    textAlign: 横线价在竖着时候的对齐方式
-->
<template>
  <div
    class="commit-price-component"
    :class="[type ? 'commit-price-component__' + type : '']"
    :style="{
      'flex-direction': direction,
      'align-items': direction === 'row' ? 'center' : 'flex-start',
      'text-align': textAlign
    }"
  >
    <div class="main-price">
      <div
        class="price"
        :class="[
          item.price && item.price.type === 'FAM' ? 'FAM' : '',
          item.priceDisplay &&
            item.priceDisplay.currentPriceColorType &&
            item.priceDisplay.currentPriceColorType === 'BTI'
            ? 'price-yel-BTI'
            : ''
        ]"
      >
        <div class="price-text">
          <span class="price-f">¥</span>
          <span v-if="item.priceDisplay && item.priceDisplay.currentPrice" class="price-min">
            {{
              item.priceDisplay.currentPrice
                ? formatPrice(item.priceDisplay.currentPrice).slice(
                  0,
                  formatPrice(item.priceDisplay.currentPrice).indexOf('.')
                )
                : 0
            }}
          </span>
          <span v-if="item.priceDisplay && item.priceDisplay.currentPrice" class="price-f">
            {{
              item.priceDisplay.currentPrice
                ? formatPrice(item.priceDisplay.currentPrice).slice(
                  formatPrice(item.priceDisplay.currentPrice).indexOf('.'),
                  formatPrice(item.priceDisplay.currentPrice).length
                )
                : 0
            }}
          </span>
          <span v-if="item.price && item.price.priceUnit" class="price-unit">/{{ item.price.priceUnit }}</span>
        </div>
        <template v-if="type !== 'button' && type !== 'neat'">
          <div
            :class="[
              item.priceDisplay &&
                item.priceDisplay.currentPriceColorType &&
                item.priceDisplay.currentPriceColorType === 'BTI'
                ? 'price-yel'
                : ''
            ]"
          />
          <div
            v-if="
              item.priceDisplay &&
                item.priceDisplay.currentPriceColorType &&
                item.priceDisplay.currentPriceColorType === 'BTI'
            "
            class="back-red"
          />
        </template>
      </div>
    </div>
    <!--原价,横线价-->
    <div v-if="showPriceMax" class="max-text-d-wrapper" :class="[direction === 'column' && 'column-style']">
      <span v-if="item.price && item.price.type === 'FAM'" class="commit-price-component-max-text-d">
        ¥ {{ item.priceDisplay.originalPrice ? formatPrice(item.priceDisplay.originalPrice, 2) : '0.00' }}
        {{ t('search.nonMemberPrice') }}
      </span>
      <span v-if="item.price && item.price.type === 'NLP'" class="commit-price-component-max-text-d text-d">
        ¥ {{ item.priceDisplay.originalPrice ? formatPrice(item.priceDisplay.originalPrice, 2) : '0.00' }}
      </span>
      <!--划线价格-->
      <span
        v-if="item.price && item.price.type === 'TRO' && item.priceDisplay.originalPriceLineThrough === true"
        class="commit-price-component-max-text-d text-d"
      >
        ¥ {{ item.priceDisplay.originalPrice ? formatPrice(item.priceDisplay.originalPrice, 2) : '0.00' }}
      </span>
      <span
        v-if="item.priceDisplay && item.priceDisplay.originalPrice && item.price.type === 'PMP'"
        class="commit-price-component-max"
      >
        ¥ {{ item.priceDisplay.originalPrice ? formatPrice(item.priceDisplay.originalPrice, 2) : '0.00' }}
        <span v-if="item.price && item.price.priceUnit">/{{ item.price.priceUnit }}</span>
      </span>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatPrice } from '@/utils/helper'
const { t } = useI18n()
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  showPriceMax: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: 'default',
    validator(type) {
      return ['default', 'button', 'neat'].includes(type)
    },
  },
  direction: {
    type: String,
    default: 'row',
    validator(direction) {
      return ['row', 'column'].includes(direction)
    },
  },
  textAlign: {
    type: String,
    default: 'left',
    validator(direction) {
      return ['left', 'right'].includes(direction)
    },
  },
})
</script>

<style scoped lang="scss">
.commit-price-component {
  display: flex;
  color: #111;
  font-size: 0.1rem;
  font-weight: bold;
  position: relative;
  margin-top: 0.03rem;

  &.commit-price-component__button {
    color: #fff;
    margin-top: 0;
  }

  &.commit-price-component__neat {
    margin-top: 0;
    height: 100%;
    justify-content: center;

    .FAM {
      .price-text {
        color: #fff;
      }
    }

    .price.price-yel-BTI {
      padding: 0;
    }

    .price-text {
      font-size: 0;

      .price-min,
      .price-f {
        display: inline-block;
        font-size: 0.14rem !important;
        line-height: 0.22rem !important;
        margin: 0;
        padding: 0;
        vertical-align: middle !important;
      }

      .price-unit {
        margin-left: 0 !important;
        vertical-align: middle;
      }
    }
  }

  // .main-price {
  //   margin-right: .1rem;
  // }

  .max-text-d-wrapper {
    margin-left: 0.1rem;
    flex: 1;
  }

  .column-style {
    margin-left: 0;
    width: 100%;
  }

  .main-price {
    width: inherit;
  }

  .price {
    // padding: .03rem .06rem 0 .06rem;
    display: inline-block;
    position: relative;
    min-width: 0.6rem;

    &.price-yel-BTI {
      padding: 0.05rem;

      .price-text {
        line-height: 1;
      }

      .price-f {
        font-size: 0.1rem;
        line-height: 0.12rem;
        vertical-align: unset;
      }

      .price-min {
        font-size: 0.16rem;
        line-height: 0.16rem;
        vertical-align: middle;
      }

      .price-unit {
        margin-left: -0.03rem;
        font-size: 0.1rem;
        line-height: 0.12rem;
        vertical-align: sub;
      }
    }

    &.FAM {
      color: #0077c8;
      min-width: 0.7rem;
    }

    .price-text {
      position: relative;
      z-index: 3;
      // min-width: .7rem;
    }

    .price-yel {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      background-color: #ffd800;
      z-index: 2;
    }

    .back-red {
      width: 100%;
      height: 100%;
      background: #ed022a;
      position: absolute;
      left: 0.02rem;
      top: 0.02rem;
      //z-index: -1;
    }

    span:nth-child(1) {
      vertical-align: top;
      // padding-top: .02rem;
      display: inline-block;
      font-size: 0.1rem;
      line-height: 0.18rem;
      margin-right: 3/100rem !important;
    }

    span:nth-child(2) {
      font-size: 0.18rem;
      line-height: 0.22rem;
      // margin-left: -0.05rem;
    }

    span:nth-child(3) {
      vertical-align: top;
      // margin-left: -0.05rem;
      // padding-top: .02rem;
      display: inline-block;
      font-size: 0.1rem;
      line-height: 0.18rem;
    }
  }

  .commit-price-component-max {
    text-decoration: line-through;
    // margin-left: .09rem;
    color: #666;
    font-style: normal;
    font-weight: normal;
    font-size: 0.12rem;
    line-height: 0.16rem;
    text-decoration-line: line-through;
  }

  .commit-price-component-max-text-d {
    color: #666;
    font-style: normal;
    font-weight: normal;
    font-size: 0.12rem;
    line-height: 0.16rem;
  }

  .text-d {
    text-decoration: line-through;
  }
}
</style>
