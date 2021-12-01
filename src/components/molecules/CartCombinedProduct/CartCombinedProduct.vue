<template>
  <div class="combined-product-view" :class="{'pc-combined-product-view':!isH5}">
    <div v-if="!cartCombinedState" class="combined-product-content">
      <!-- addPurchase: 结算前配套还是直接点击配套买 / 默认为直接点击配套买 直接点击没有曝光 -->
      <!-- <template v-if="!addPurchase"> -->
      <!-- 结算前配套买弹框组件曝光 -->
      <!-- <module-exposure-observer
          :track-id="`combined-product-content-${_uid}`"
          :observed-target-id="`combined-product-content-${_uid}`"
          :enable-tracking="true"
          :extended-attributes="{ module_var: '配套买结算提醒' }"
        /> -->
      <!-- </template> -->
      <template v-if="!addPurchase">
        <h2 class="combined-product-content-title">
          {{ t('product.combined_title') }}
        </h2>
      </template>
      <div v-if="!isH5" class="combined-product-title">
        <span>{{ t('cart.combined_products_title') }}</span>
      </div>
      <div class="combined-product-body">
        <div v-for="item in carCombined" :key="item.id" class="combined-product-li">
          <combined-product-panel
            :combined-products="item.combinedProducts"
            :title="item.title"
            :content-type="item.type"
            :main-product="item"
            :show-family-price="showFamilyPrice"
          />
        </div>
      </div>
      <div class="combined-product-footer">
        <div class="combined-product-body__amount">
          <template v-if="addPurchase">
            <p class="combined-product-amount__quantity">
              {{ combinedProductQuantityLabel }}
            </p>
            <div class="combined-product-amount__summary">
              <span class="amount-summary__label">{{ t('cart.total_price_label') }}</span>
              <span class="amount-summary__price">¥ {{ formatPrice(calcPrice + combinedProductAmount, 2) }}</span>
            </div>
          </template>
          <template v-else>
            <div class="combined-product-amount__summary_div">
              <p class="amount-summary__label_p">
                {{ t('cart.combined_total_price_label') }}
              </p>
              <strong class="amount-summary__price_strong">
                ¥ {{ formatPrice(calcPrice + combinedProductAmount, 2) }}
              </strong>
            </div>
          </template>
        </div>
        <div class="combined-product-body__button">
          <template v-if="!addPurchase">
            <i-button
              type="button"
              :loading="cartCombinedBtnLoadding"
              :fluid="true"
              variant="emphasised"
              @click="CombinedSubmit"
            >
              <span>{{ t('cart.immediate_settlement') }}</span>
            </i-button>
          </template>
          <template v-else>
            <i-button
              type="button"
              :disabled="!availableToPurchase"
              :loading="cartCombinedBtnLoadding"
              :fluid="true"
              variant="emphasised"
              @click="CombinedSubmit"
            >
              {{ addToBagTitle }}
            </i-button>
          </template>
        </div>
      </div>
    </div>
    <div v-else class="combined-product-other">
      <div v-if="cartCombinedState === 'loadding'" class="combined-product-skeleton">
        <div class="skeleton-item" style="width: 100%; height: 0.6rem;"></div>
        <div class="skeleton-item" style="width: 80%;"></div>
        <div class="skeleton-item" style="width: 65%;"></div>
        <div class="skeleton-item" style="width: 100%;"></div>
        <div class="skeleton-item" style="width: 20%;"></div>
      </div>
      <div v-if="cartCombinedState === 'error'" class="combined-product-error">
        <div class="error-refresh" @click="refresh">
          <img :src="getImgUrlByPath('/images/pc/networkdelay.svg')" />
          <p>{{ t('public.failed_to_load') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { ref, defineProps, defineEmits, computed, onMounted, onUnmounted } from 'vue'
import base from 'composables/base'
import CombinedProductPanel from 'molecules/CombinedProductPanel/CombinedProductPanel.vue'
import IButton from 'atoms/IButton/IButton.vue'
import { toast } from 'atoms/IToast/index'
import { getImgUrlByPath, formatPrice } from '@/utils/helper'
const { t, locale, isH5 } = base()
const props = defineProps({
  // 配套商品数据
  carCombined: {
    type: Array,
    default() {
      return []
    },
  },
  // 结算时使用外部传入的总价
  calcPrice: {
    type: Number,
    default: 0,
  },
  // 结算时使用外部传入的数量
  payTotalNum: {
    type: Number,
    default: 0,
  },
  // 配套还是结算 / 默认配套
  addPurchase: {
    type: Boolean,
    default: true,
  },
  // 按钮提交的loading
  cartCombinedBtnLoadding: {
    type: Boolean,
    default: false,
  },
  // 当前组件的状态 loading  error  为空时代表正常显示
  cartCombinedState: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['refresh', 'onCombinedSubmit', 'onchange'])
const combinedProducts = ref([])
const showFamilyPrice = ref(false)
const addToBagTitle = computed(() => {
  return props.checkedCombinedProduct?.length > 1 ? t('cart.batch_add_to_bag') : t('cart.add_cart')
})
const availableToPurchase = computed(() => {
  return (
    props.carCombined.filter(item => item.combinedProducts.filter(products => products.isCombined).length > 0)
      .length > 0
  )
})
const combinedProductQuantityLabel = computed(() => {
  let totalQuantity = 0
  let newTotalQuantity = 0
  // 不做else 避免出现 NaN
  if (typeof props.payTotalNum === 'number')
    newTotalQuantity = props.payTotalNum

  totalQuantity += newTotalQuantity
  props.carCombined.forEach((item) => {
    totalQuantity += item.combinedProducts.filter(products => products.isCombined).length
  })
  return locale.value === 'zh'
    ? `${totalQuantity} ${t('product.total_quantity_label')}`
    : `${t('product.total_quantity_label')} ${totalQuantity} `
})

const checkedCombinedProduct = computed(() => {
  const list = []
  props.carCombined.forEach((item) => {
    list.push(...item.combinedProducts.filter(products => products.isCombined))
  })
  emit('onchange', list)
  return list
})
const combinedProductAmount = computed(() => {
  const calcAmount = (product) => {
    if (!product || !product.price) return 0
    const unitPrice
          = (product.price.type === 'FAM' && product.hasFamilyCard)
          || product.price.type === 'PMP'
          || product.price.type === 'NLP'
          || product.price.type === 'TRO'
            ? product.price.specialPrice * 100
            : product.price.regularPrice * 100

    return product.quantity * unitPrice
  }
  const combineProductAmount = checkedCombinedProduct.value.reduce((prev, item) => {
    return prev + calcAmount(item)
  }, 0)

  return combineProductAmount / 100
})
onMounted(() => {
  showFamilyPrice.value = Boolean(localStorage.getItem('isFAM'))
})
onUnmounted(() => {
  document.body.style = ''
})
/**
 * 去除重复的选项
 * @param {Arrar} data 列表数据
 * @param {String} condition 条件
 * @param {String} key 需要合并的选项
 * @returns 合并好的新数组
 */
const mergeData = (data, condition, key) => {
  const arr = []
  data.forEach((item) => {
    const obj = arr.find(value => value[condition] === item[condition]) || null
    if (obj)
      obj[key] += item[key]
    else
      arr.push(item)
  })
  return arr
}
const refresh = () => {
  emit('refresh')
}
const CombinedSubmit = () => {
  const newData = mergeData(checkedCombinedProduct.value, 'id', 'quantity')
  const commodityNumberMax = newData.some(item => item.quantity > 99)
  if (commodityNumberMax) {
    const arr = []
    newData.forEach((item) => {
      if (item.quantity > 99) {
        arr.push(item.name)
        item.quantity = 99
      }
    })
    // const toastOptions = {
    //   position: 'top-center',
    //   fullWidth: true,
    //   fitToScreen: true,
    //   singleton: true,
    // }
    // toasted.show(`${arr.join(',')} ${t('cart.select_up_to_99_items')}`, toastOptions)
    toast({ text: `${arr.join(',')} ${t('cart.select_up_to_99_items')}`, duration: 3000, textPosition: 'center' })
  }
  emit('onCombinedSubmit', newData)
}
</script>

<style lang="scss" scoped>
.combined-product-title {
  font-style: normal;
  font-weight: bold;
  font-size: 0.22rem;
  line-height: 0.32rem;
  margin-top: 0.2rem;
  color: #111;
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  padding-left: 0.32rem;
}

.combined-product-footer {
  position: fixed;
  width: 100%;
  left: 0;
  bottom: 0;
  background-color: white;
  z-index: 1;
  display: flex;
  justify-content: space-around;
  padding: 0.13rem 0.24rem;

  .combined-product-body__amount {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;

    .combined-product-amount__quantity {
      font-size: 0.12rem;
      line-height: 0.22rem;
      color: #111;
    }

    .combined-product-amount__summary {
      display: flex;
      align-items: center;

      .amount-summary__label {
        font-weight: 600;
        font-size: 0.14rem;
        line-height: 0.22rem;
        color: #111;
        padding-right: 0.05rem;
      }

      .amount-summary__price {
        font-weight: bold;
        font-size: 0.2rem;
        line-height: 0.22rem;
        color: #111;
      }

      &_div {
        .amount-summary__label_p {
          font-size: 0.12rem;
          line-height: 0.22rem;
          color: #111;
        }

        .amount-summary__price_strong {
          font-size: 0.2rem;
          line-height: 0.22rem;
          color: #111;
        }
      }
    }
  }

  .combined-product-body__button {
    max-width: 1.56rem;
    flex: 1;
    justify-content: center;
    margin: auto;

    :deep(.btn__inner) {
      padding: 0 0.2rem;
    }
  }
}

.combined-product-body {
  padding: 0 0.24rem 1rem 0.24rem;

  .combined-product-li {
    :deep(.combined-product-panel) {
      padding-bottom: 0;

      .combined-products-item {
        min-width: 2.9rem !important;

        .landscape-product-card {
          padding: 0.05rem 0.1rem !important;

          .landscape-product-card__amount {
            margin-top: 0.05rem;
          }
        }
      }
    }
  }
}

.combined-product-view {
  width: 100%;
  height: 100%;
  min-height: 3rem;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;

  .combined-product-content-title {
    width: 100%;
    padding: 0 0.24rem;
    color: #484848;
    font-size: 0.14rem;
    line-height: 0.24rem;
    font-weight: 400;
  }
}

.combined-product-other {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  z-index: 1;
  padding: 0 0.5rem;

  .combined-product-error {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .error-refresh {
      cursor: pointer;
    }

    img {
      width: 1rem;
      display: block;
      margin: 0 auto;
    }

    p {
      white-space: nowrap;
      font-size: 0.14rem;
      text-align: center;
      margin-top: 0.1rem;
      color: #959595;
    }
  }

  .combined-product-skeleton {
    .skeleton-item {
      height: 0.26rem;
      border-radius: 4px;
      margin: 0.16rem 0;
      background: linear-gradient(90deg, #f5f5f5 25%, #e6e6e6 37%, #f5f5f5 63%);
      background-size: 400% 100%;
      animation: skeleton-loading 1.4s ease infinite;
    }
  }
}

@keyframes skeleton-loading {
  0% {
    background-position: 100% 50%;
  }

  to {
    background-position: 0 50%;
  }
}

.pc-combined-product-view {
  .combined-product-footer {
    padding: 0.14rem 0.5rem;

    .combined-product-body__amount {
      display: flex;
      flex: initial;
      flex-direction: column;
      justify-content: center;
    }

    .combined-product-body__button {
      max-width: 100%;
      padding: 0 0.16rem 0 0.32rem;
      justify-content: center;
      margin: auto;
    }
  }
}
</style>
