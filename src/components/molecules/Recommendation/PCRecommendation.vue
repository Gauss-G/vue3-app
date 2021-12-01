<!-- 缺货时推荐相似商品 -->
<template>
  <div class="recommendation-view">
    <ILayer v-model:value="show" :header-show="false" type="Right" @close="close">
      <div class="recommendation-page">
        <!-- <module-exposure-observer
          trackId="product-resemble.0"
          :observedTargetId="`recommendation-page.` + id"
          :extendedAttributes="gioAttributes"
        /> -->
        <div class="recommendation-header">
          <div class="recommendation-header-left">
            <h3>{{ t('product.out_of_stock_tips') }}</h3>
            <p v-if="product.onlineSalable">
              {{ t('product.or_you_may_try_to') }}
              <span class="underline" @click="onCallStockAddress">{{ t('address.change_area') }}</span>
            </p>
          </div>
          <i-button
            variant="primary"
            icon="CrossIcon"
            :icon-only="true"
            inverse
            small
            @click="close"
          />
        </div>
        <div class="recommendation-panel">
          <div v-if="products.length > 0" class="recommendation-panel-title">
            {{ t('product.be_similar').replace('n', productName) }}
          </div>
          <div v-if="products.length > 0" class="product-list">
            <ul v-if="products.length > 0">
              <li
                v-for="(item, index) in products"
                :id="'product-exposure-recommendation-' + item.id"
                :key="index"
                @click="gioClick(index, item)"
              >
                <!-- <product-exposure-observer
                  :target-id="'product-exposure-recommendation-' + item.id"
                  :product="item"
                  :extended-attributes="getAttributes(index)"
                /> -->
                <LandscapeProductCard :product="item" :show-unavailable-tag="false">
                  <template #operation>
                    <i-button
                      v-if="item.onlineSalable"
                      type="button"
                      icon="ShoppingBagAddIcon"
                      :icon-only="true"
                      :small="true"
                      :loading="isAddShopCarLogining"
                      variant="emphasised"
                      @click="addCard(item)"
                    />
                  </template>
                </LandscapeProductCard>
              </li>
            </ul>
          </div>
          <div v-else class="no-data">
            <div>
              <img :src="utils.getImgUrlByPath('/images/pc/cart/magnifier.png')" />
              <p>{{ t('product.resemble_product_no') }}</p>
              <p>{{ t('product.resemble_product_no_tips') }}</p>
            </div>
          </div>
        </div>
      </div>
    </ILayer>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted, computed, watch } from 'vue'
import base from 'composables/base'
import IIcon from 'atoms/IIcon/IIcon.vue'
import IButton from 'atoms/IButton/IButton.vue'
import ILayer from 'atoms/ILayer/ILayer.vue'
import LandscapeProductCard from 'molecules/LandscapeProductCard/LandscapeProductCard.vue'
import { addShoippingCartByProducts } from 'composables/shoppingBag/shoppingBag'

import gioHooks from '@/utils/hooks/gio'
const { gio, CLICK_TYPE, INVENTORY_STATUS } = gioHooks()

const { t, locale } = base()
const props = defineProps({
  value: {
    type: Boolean,
  },
  product: {
    type: Object,
    default() {
      return {}
    },
  },
  products: {
    type: Array,
    default() {
      return []
    },
  },
})
const emits = defineEmits(['onCallStockAddress', 'update:value', 'addToCart'])
const show = ref(false)
const productName = ref('')
const productReviewsShow = ref<boolean>(false)
const id = ref('')
const isAddShopCarLogining = ref(false)

const gioAttributes = computed(() => {
  const product = props.product
  const id = product?.productId || product.id
  return {
    productName_var: product?.name,
    productInfo_var: product?.itemType === 'SPR' ? `s${id}` : id,
    positionName_var: product?.name,
  }
})
const gioClick = (position, item) => {
  const product = props.product
  productReviewsShow.value = true
  const clickType = CLICK_TYPE.RESEMBLE_ITEM_CLICK
  const attributes = {
    productName_var: product?.name,
    positionName_var: product?.name,
    productInfo_var: product?.itemType === 'SPR' ? `s${product?.id}` : product?.id,
  }
  gio.trackClickData(
    {
      trackId: `product-resemble.${position}`,
      clickType,
    },
    true,
    attributes,
  )
}

const getAttributes = (index) => {
  return {
    modulePosition_var: index,
    // moudule_var: RESEMBLE_TYPE.RESEMBLE,
  }
}
watch(() => props.value, (newVal) => {
  show.value = newVal
})
watch(() => show.value, (newVal) => {
  emits('update:value', newVal)
})
const close = () => {
  const product = props.product
  // gio埋点
  gio.trackClickData(
    {
      trackId: 'product-resemble',
      clickType: CLICK_TYPE.RESEMBLE_ITEM_CLOSE,
    },
    true,
    {
      productName_var: CLICK_TYPE.RESEMBLE_ITEM_CLOSE,
      failReason_var: product.onlineSalable ? INVENTORY_STATUS.OUT : INVENTORY_STATUS.SELL_OUT,
    },
  )
  show.value = false
}
const onCallStockAddress = () => {
  show.value = false
  emits('onCallStockAddress', true)
}
onMounted(() => {
  productName.value = props.product?.name
  id.value = props.product?.productId
})
// 加入购物车
const addCard = async(item) => {
  if (isAddShopCarLogining.value) return
  isAddShopCarLogining.value = true
  const isSuccess = await addShoippingCartByProducts([item])
  isAddShopCarLogining.value = false
  if (isSuccess) emits('addToCart', item)
}
</script>

<style lang="scss" scoped>
.recommendation-page {
  width: 5rem;
}

.recommendation-header {
  background: #0058a3;
  height: 1.2rem;
  display: flex;
  align-items: center;
  padding: 0 0.4rem 0 0.5rem;

  &-left {
    flex: 1;

    h3 {
      color: white;
      font-size: 0.2rem;
    }

    p {
      margin-top: 0.1rem;
      color: white;
      font-size: 0.16rem;
      font-weight: 600;
    }
  }

  .underline {
    text-decoration: underline;
    cursor: pointer;
  }
}

.recommendation-panel {
  padding: 0.3rem 0.5rem;
  height: calc(100vh - 1.2rem);
  overflow-y: auto;

  .recommendation-panel-title {
    font-size: 0.16rem;
    color: #111;
    font-weight: 600;
    margin-bottom: 0.12rem;
  }

  li {
    margin-bottom: 0.21rem;
    border-bottom: 1px solid #f5f5f5;
    overflow: hidden;
    padding: 0.2rem 0;
    position: relative;

    :deep(.landscape-product-card__operation) {
      display: none;
    }

    &:hover {
      :deep(.landscape-product-card__operation) {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
      }
    }
  }

  .no-data {
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    height: 100%;
    width: 100%;
    text-align: center;
    font-size: 0.18rem;
    line-height: 0.32rem;
    color: #111;
  }
}
</style>
