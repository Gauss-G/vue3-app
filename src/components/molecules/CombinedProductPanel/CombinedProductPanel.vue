<template>
  <div class="combined-product-panel" :class="{'pc-combined-product-panel':!isH5}">
    <div v-if="main && Object.keys(main).length !== 0" class="combined-product-panel__main">
      <landscape-product-card is-price-display-position :product="main" :is-main-product="true" :quantity-editable="true" />
    </div>
    <div class="combined-product-panel__divider" :class="{ 'combined-product-panel__divider_black': title }">
      <label class="label">
        <template v-if="contentType === 'PAX'">
          {{ t('product.pay_title_pax') }}
          <strong v-if="title">{{ ' ' + title + ' ' }}</strong>
          {{ t('product.pay_title_pax_add') }}
        </template>
        <template v-else>
          <template v-if="title">
            <strong>{{ title }}</strong> {{ t('product.needs_to_be_combined_with') }}
          </template>
          <template v-else>
            {{ t('product.more_combined_products_available') }}
          </template>
        </template>
      </label>
    </div>
    <div class="combined-product-panel__list">
      <div class="combined-products-gallary">
        <div
          v-for="item in combinedProducts"
          :key="item.id"
          class="combined-products-item"
          :class="{ 'combined-products-item--border': combinedProducts.length > 1 }"
        >
          <!-- <product-exposure-observer
            :target-id="`product-${_uid}-${item.id}-${mainProduct.id}`"
            :product="item"
            :extended-attributes="getAttributes(item, mainProduct)"
          /> -->
          <landscape-product-card
            :product="item"
            :is-buried-point-switch="mainProduct.id ? false : true"
            :quantity-editable="true"
            :product-num="main.quantity"
            :is-price-display-position="isH5?true:false"
            :show-img-out-stock="false"
            :show-family-price="showFamilyPrice"
          >
            <template #operation>
              <i-checkbox
                v-if="item.stockStatus !== 'OUTOFSTOCK'"
                :disabled="
                  item.stockStatus === 'OUTOFSTOCK' ||
                    !item.onlineSalable ||
                    (main && Object.keys(main).length !== 0 && !main.onlineSalable)
                "
                :value="item.isCombined"
                @change="onCombinedProductChecked(item)"
              />
            </template>
          </landscape-product-card>
        </div>
      </div>
    </div>
    <div class="combined-product-panel__footer">
      <slot name="footer" />
    </div>
  </div>
</template>
<script setup>
import { ref, defineProps, defineEmits, computed, onMounted, onUnmounted } from 'vue'
import base from 'composables/base'
import LandscapeProductCard from 'molecules/LandscapeProductCard/LandscapeProductCard.vue'
import ICheckbox from 'atoms/ICheckbox/ICheckbox.vue'
const { t, locale, isH5 } = base()
const props = defineProps({
  main: {
    type: Object,
    default() {
      return {}
    },
  },
  // 主商品信息
  mainProduct: {
    type: Object,
    default() {
      return {}
    },
  },
  combinedProducts: {
    type: Array,
    default() {
      return []
    },
  },
  showFamilyPrice: {
    type: Boolean,
    default: false,
  },
  // 是否是 PAX
  contentType: {
    type: [Boolean, String],
    default: null,
  },
  title: {
    type: String,
    default: '',
  },
})
const getAttributes = (item, mainProduct) => {
  return {
    module_var: '配套买结算提醒',
    productInfo_var: mainProduct.id,
    productName_var: mainProduct.title,
    mustBeCompleteWithList_var: item.id,
  }
}
const onCombinedProductChecked = (item) => {
  item.isCombined = !item.isCombined
}
</script>
<style lang="scss" scoped>
.combined-product-panel__divider .label {
  font-size: 0.14rem;
  line-height: 0.21rem;
  color: #111;
}

.combined-product-panel {
  padding-bottom: 0.75rem;
  width: inherit;

  .combined-product-panel__divider {
    margin: 0.16rem 0;
    padding: 0.07rem;
  }

  .combined-product-panel__divider_black {
    background: #f9f9f9;
    border-radius: 4px;
  }

  .combined-product-panel__list {
    // display: flex;
    // flex-direction: column;
    // justify-content: space-between;
    ::-webkit-scrollbar {
      display: none;
    }

    .combined-products-gallary {
      display: flex;
      flex-direction: row;
      box-sizing: border-box;
      width: 100%;
      overflow-y: hidden;
      overflow-x: scroll;

      .combined-products-item {
        // padding-right: 0.2rem;
        min-width: 3.2rem;
        display: inline-block;
        position: relative;

        :deep(.landscape-product-card__operation) {
          right: 0.1rem;
          height: calc(100% - 0.2rem);

          .checkbox {
            margin: auto;
          }
        }
      }

      .combined-products-item--border {
        padding-right: 0.2rem;

        :deep(.landscape-product-card) {
          height: 100%;
          padding: 0.1rem 0.1rem;
          border: 1px solid #dfdfdf;
          border-radius: 0.06rem;
        }
      }
    }
  }

  .combined-product-panel__footer {
    width: inherit;
    position: fixed;
    height: 0.75rem;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    background-color: white;
  }
}

.pc-combined-product-panel {
  .combined-product-panel__divider_black {
    background-color: transparent;
  }

  .combined-product-panel__list {
    .combined-products-gallary {
      display: block;
      overflow: auto;

      .combined-products-item--border {
        padding-right: 0.2rem;
        margin: 0.2rem 0;

        :deep(.landscape-product-card) {
          border: 0;
          border-bottom: 1px solid #dfdfdf;
          border-radius: 0;

          .landscape-product-card__description {
            max-width: 100%;
            margin-right: 0.2rem;

            .product-specification {
              margin-bottom: 0.1rem;
            }
          }
        }
      }
    }
  }
}
</style>
