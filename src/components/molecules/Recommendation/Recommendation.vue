<!-- 相似商品推荐 -->
<template>
  <div v-if="show" class="recommendation">
    <div class="control-mide" @click="close"></div>
    <div
      class="control-panel"
      :class="{ 'cont-show': contentShow, 'control-panel-move': isTouchMove && searchListLeft.length > 0 }"
    >
      <!-- <module-exposure-observer
        track-id="product-resemble.0"
        :observed-target-id="`control-panel.` + id"
        :extended-attributes="gioAttributes"
      /> -->
      <div class="control-header">
        <div class="header-title" :class="{ 'header-title-webbox': locale === 'zh' }">
          <template v-if="product.onlineSalable && locale === 'zh'">
            <label>{{ stockAddress }}</label>
            <span>{{ t('product.not_available_for_the_time_being') }}</span>
            <a @click="onCallStockAddress">{{ t('address.change_area') }}</a>
          </template>
          <template v-else-if="product.onlineSalable && locale !== 'zh'">
            <p>{{ stockAddress }}</p>
            <span>{{ t('product.not_available_for_the_time_being') }}</span>
            <a @click="onCallStockAddress">{{ t('address.change_area') }}</a>
          </template>
          <template v-else>
            {{ t('product.out_of_stock_tips') }}
          </template>
        </div>
        <!-- <img :src="utils.getImgUrlByPath('/images/cart/closeService.svg')" alt="" srcset="" @click="close" /> -->
        <i-icon component-name="CrossSmallIcon" size=".3rem" @click="close" />
      </div>
      <div class="control-content" @touchmove="setMoveClass">
        <div v-if="searchListLeft.length > 0" class="products-list">
          <div class="products-group">
            <ul>
              <li
                v-for="(item, index) in searchListLeft"
                :id="'product-exposure-recommendation-' + item.id"
                :key="index"
                @click="gioClick(item.gioIndex, item)"
              >
                <!-- <product-exposure-observer
                  :target-id="'product-exposure-recommendation-' + item.id"
                  :product="item"
                  :extended-attributes="getAttributes(item.gioIndex)"
                /> -->
                <ProductListItem :index="index" :item="item" />
              </li>
            </ul>
          </div>
          <div class="products-group">
            <ul>
              <li
                v-for="(item, index) in searchListRight"
                :id="'product-exposure-recommendation-' + item.id"
                :key="index"
                @click="gioClick(item.gioIndex, item)"
              >
                <!-- <product-exposure-observer
                  :target-id="'product-exposure-recommendation-' + item.id"
                  :product="item"
                  :extended-attributes="getAttributes(item.gioIndex)"
                />-->
                <ProductListItem :index="index" :item="item" />
              </li>
            </ul>
          </div>
        </div>
        <div v-else class="no-data">
          <div>
            <img :src="getImgUrlByPath('/images/pc/cart/magnifier.png')" />
            <p>{{ t('product.resemble_product_no') }}</p>
            <p>{{ t('product.resemble_product_no_tips') }}</p>
          </div>
        </div>

        <div v-if="searchListLeft.length > 0" class="footer-tips">
          {{ t('public.its_the_end_of_it') }}
        </div>
        <div v-if="searchListLeft.length <= 0" class="fotter-btn" @click="arrivalReminder">
          {{ t('public.arrival_reminder') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// import SearchListItem from '~/components/searchListItem'
// import ProductExposureObserver from '~/components/observer/ProductExposureObserver'
// import { CLICK_TYPE, RESEMBLE_TYPE, INVENTORY_STATUS } from '~/constants/gio/variables'
// import ModuleExposureObserver from '~/components/observer/ModuleExposureObserver'
import { ref, defineProps, defineEmits, onMounted, computed, watch } from 'vue'
import base from 'composables/base'
import ProductListItem from 'molecules/ProductListItem/ProductListItem.vue'
import IIcon from 'atoms/IIcon/IIcon.vue'
// import ILayer from 'atoms/ILayer/ILayer.vue'
import { _local, getImgUrlByPath } from '@/utils/helper'
import gioHooks from '@/utils/hooks/gio'
const { t, locale } = base()
const { gio } = gioHooks()

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
const emits = defineEmits(['onCallStockAddress', 'update:value'])
const show = ref(props.value)
const contentShow = ref(false)
const isTouchMove = ref(false)// 是否有滑动
const searchListLeft = ref([])
const searchListRight = ref([])
const stockAddress = ref('')// 库存地址
const productName = ref('')
const id = ref('')
const gioAttributes = computed(() => {
  const product = props.product
  const id = product?.productId || product.id
  return {
    productName_var: product?.name,
    productInfo_var: product?.itemType === 'SPR' ? `s${id}` : id,
    positionName_var: product?.name,
  }
})
watch(() => props.value, (newVal) => {
  show.value = newVal
})
watch(() => show.value, (newVal) => {
  emits('update:value', newVal)
  if (newVal) {
    const stock = _local.get('stockAddress') ? _local.get('stockAddress') : {}
    if (stock.address) {
      // 先拿到第一个斜杠的位置 ， 如果没有 ， 用原本的数据
      const index = stock.address.indexOf('/')
      if (index !== -1) {
        const address = stock.address.substring(index + 1) || ''
        stockAddress.value = address.replace(/\//g, '')
      }
      else {
        stockAddress.value = stock.address
      }
    }
    setTimeout(() => {
      contentShow.value = newVal
    }, 100)
  }
})
const groupingList = () => {
  searchListRight.value = []
  searchListLeft.value = []
  props.products.forEach((item, index) => {
    item.gioIndex = index
    if ((index + 1) % 2 === 0)
      searchListRight.value.push(item)
    else
      searchListLeft.value.push(item)
  })
}
const setMoveClass = () => {
  isTouchMove.value = true
}
// 到货提醒
const arrivalReminder = () => {
  window.location.href = 'https://datayi.cn/6qGXnabidpPQP'
}
watch(() => props.products, () => {
  groupingList()
})

const gioClick = (position, item) => {
  // productReviewsShow = true
  // const clickType = CLICK_TYPE.RESEMBLE_ITEM_CLICK
  // const attributes = {
  //   productName_var: item?.name,
  //   positionName_var: item?.name,
  //   productInfo_var: item?.itemType === 'SPR' ? `s${item?.id}` : item?.id,
  // }
  // $gio.trackClickData(
  //   {
  //     trackId: `product-resemble.${position}`,
  //     clickType,
  //   },
  //   true,
  //   attributes,
  // )
}

const getAttributes = (index) => {
  return {
    modulePosition_var: index,
    // moudule_var: RESEMBLE_TYPE.RESEMBLE,
  }
}
const close = () => {
  contentShow.value = false
  setTimeout(() => {
    isTouchMove.value = false
    // $gio.trackClickData(
    //   {
    //     trackId: 'product-resemble',
    //     clickType: CLICK_TYPE.RESEMBLE_ITEM_CLOSE,
    //   },
    //   true,
    //   {
    //     productName_var: CLICK_TYPE.RESEMBLE_ITEM_CLOSE,
    //     failReason_var: product.onlineSalable ? INVENTORY_STATUS.OUT : INVENTORY_STATUS.SELL_OUT,
    //   },
    // )
    show.value = false
  }, 500)
}
const onCallStockAddress = () => {
  close()
  emits('onCallStockAddress')
}
onMounted(() => {
  productName.value = props.product?.name
  id.value = props.product?.productId
  groupingList()
})
</script>

<style lang="scss" scoped>

.cont-show {
  transform: translateY(0) !important;
}

.header-title {
  line-height: 0.28rem;
  padding: 0.2rem 0.28rem 0.2rem 0;

  label {
    -webkit-box-flex: 1;
  }

  label,
  p {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-all;
  }

  span {
    display: block;
    white-space: nowrap;
    margin: 0 0.12rem;
  }

  a {
    display: inline-block;
    color: #0058a3;
  }
}

.header-title-webbox {
  display: -webkit-box;
  line-height: 0.48rem;
  padding: 0 0.28rem 0 0;
}

.products-list {
  padding: 0.2rem;
  display: -webkit-box;
  overflow: hidden;

  .products-group {
    -webkit-box-flex: 1;
    max-width: 50%;

    &:first-child {
      margin-right: 0.15rem;
    }
  }

  li {
    border: 1px solid #dfdfdf;
    margin-bottom: 0.2rem;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.footer-tips {
  font-style: normal;
  font-weight: normal;
  font-size: 0.12rem;
  line-height: 0.22rem;
  text-align: center;
  color: #767676;
  padding-bottom: 0.2rem;
}

.fotter-btn {
  position: absolute;
  bottom: 0.2rem;
  right: 0.2rem;
  left: 0.2rem;
  background: #2e9cbe;
  border-radius: 0.3rem;
  height: 0.55rem;
  font-weight: bold;
  font-size: 0.14rem;
  line-height: 0.22rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  color: #fff;
}

.no-data {
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  height: 80%;
  width: 100%;
  text-align: center;
  font-size: 0.14rem;
  line-height: 0.22rem;
  font-weight: normal;
  color: #999;

  img {
    width: 0.95rem;
  }

  p:nth-child(2) {
    font-size: 0.18rem;
    line-height: 0.32rem;
    font-weight: bold;
    color: #111;
  }
}

.control-mide {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(17, 17, 17, 0.3);
  z-index: 998;
}

.control-panel {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  // height: 70%;
  top: 35%;
  background: #fff;
  transition: all 0.5s ease;
  transform: translateY(100%);
  z-index: 999;
  border-radius: 0.1rem 0.1rem 0 0;

  .control-header {
    min-height: 0.48rem;
    text-align: left;
    line-height: 0.48rem;
    position: relative;
    color: #111;
    padding: 0 0.2rem;
    font-weight: bold;
    border-bottom: 0.01rem solid #f2f2f2;

    .iicon {
      position: absolute;
      top: 0.08rem;
      right: 0.05rem;
      z-index: 102;
    }
  }

  .control-content {
    height: calc(100% - 0.48rem);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
}

.control-panel-move {
  // height:90%;
  top: 0.8rem;
}

</style>
