
<template>
  <div class="cart-product-item" :class="{'pc-cart-product-item':!isH5}">
    <div :id="'item' + item.itemId" class="goods-item">
      <div class="goods-item-top">
        <div class="selected-all">
          <div class="select-icon-box" @click="selectable ? selectBtn(item) : ''">
            <div class="select-icon" :class="selectable ? (item.selected ? 'checked' : 'no-checked') : 'no-selected'">
              <i-icon v-if="item.selected" size="0.2rem" component-name="CheckmarkIcon" style="color: #fff;" />
            </div>
          </div>
        </div>
        <div v-if="item.product" class="selected-item-box" @click="goDetail(item)">
          <div class="item-img" :class="{ 'item-img-op5': isOutResemble && !item.stocked }">
            <img v-if="item.offShelf" v-lazy="item.product.image" alt="" srcset="" />
            <img v-if="!item.offShelf" :src="getImgUrlByPath('/images/cart/nokucun.svg')" alt="" />
          </div>
          <div v-if="item.product" class="item-details">
            <div v-if="item.offShelf && sence === 'cart' && isH5" class="overflow-img" @click.stop="editItem">
              <img :src="getImgUrlByPath('/images/cart/overflow.svg')" alt="" />
            </div>

            <!-- 购物袋商品价格标签 TODO: 使用iTag标签替换-->
            <div
              v-if="
                (!item.offline &&
                  item.product.priceDisplay &&
                  item.product.priceDisplay.tags &&
                  item.product.priceDisplay.tags.length > 0) ||
                  (item.product && item.product.price && item.product.price.type == 'PMP') ||
                  (item.product && item.product.label)
              "
              class="item-tags"
            >
              <span
                v-for="(tag, idx) in item.product.priceDisplay.tags"
                :key="idx"
                :style="{ color: '#' + tag.colorHex }"
              >{{ tag.name }}</span>
              <span v-if="item.product.label && item.offShelf" style="color: #e4075b;">{{ item.product.label }}</span>
            </div>

            <CartItemDescription :product="item.product" :off-shelf="item.offShelf" :product-full-id="item.productFullId" />

            <div v-if="item.saleableInfo && !item.saleableInfo.saleable" class="item-prc-onlinesalable">
              <span class="item-prc-onlinesalable-dian" />
              <span class="item-prc-onlinesalable-text">{{ item.saleableInfo.addToCartErrorMsg }}</span>
            </div>
            <div v-else-if="!item.stocked" class="item-prc-onlinesalable">
              <span class="item-prc-onlinesalable-dian" />
              <span class="item-prc-onlinesalable-text">{{
                !item.addressStock ? t('cart.not_available_for_the_time_being') : t('cart.sold_out_online')
              }}</span>
            </div>

            <div v-if="isOutResemble && !item.stocked" class="item-prc-resemble" @click.stop="">
              <product-resemble :product="item" @onCallStockAddress="onCallStockAddress" @addToCart="handleAddToCart" />
            </div>
            <div v-if="item.offShelf" class="item-quantity" :class="{ selectDf: !item.offShelf }">
              <input-number v-if="sence === 'cart' && item.stocked" v-model:value="quantity" :disabled="true" @change="numberChange" />
              <div v-if="sence === 'detail'" class="number">
                <span>{{ t('cart.number') }}：1</span>
              </div>
              <template v-if="!item.offline && !(sence === 'cart' && !item.stocked) && isH5">
                <div class="item-price">
                  <CartPrice :item="item" />
                </div>
              </template>
              <!-- 删除与收藏 -->
              <template v-if="!isH5">
                <div class="item-manage">
                  <ul>
                    <li @click.stop="editItem">
                      <i-icon size="0.24rem" component-name="TrashCanIcon" />
                    </li>
                    <li v-if="item.offShelf && item.product.itemType !== 'VTP'" @click.stop="toggleCollect">
                      <i-icon size="0.24rem" :style="{ color: !item.isCollect ? '#111' : 'red' }" :component-name="!item.isCollect ? 'HeartIcon' : 'HeartFilledIcon'" />
                    </li>
                  </ul>
                </div>
              </template>
            </div>
          </div>
          <div v-if="!isH5" class="item-pc-price">
            <template v-if="!item.offline && !(sence === 'cart' && !item.stocked)">
              <div class="item-price">
                <CartPrice :item="item" />
              </div>
            </template>
          </div>
        </div>
      </div>
      <div v-if="item.stocked && item.offShelf && isOutResemble" class="goods-item-bottom">
        <div v-if="item.product.price && item.product.price.validToDate" class="item-time-end">
          <div class="item-time-text" :class="{ colorDf: !item.offShelf }">
            {{ t('cart.cut_off') }}
          </div>
          <div class="item-time-num" :class="{ colorDf: !item.offShelf }">
            {{ handelDate(item.product.price.validFromDate) }}-{{ handelDate(item.product.price.validToDate) }}
          </div>
        </div>
        <div v-if="item.product.hasAssemblyService" class="item-service">
          <div class="item-service-text">
            {{ t('cart.service') }}
          </div>
          <div class="item-service-thr" @click="openAssembleService">
            <IIcon class="icon" size="0.2rem" component-name="DrillIcon" />
            {{ t('cart.paid_assembly_service') }}
          </div>
        </div>
        <div v-if="item.product.soldSeparatelyDescription" :id="'soldSeparatelyDescription' + index" class="item-service">
          <!--    <module-exposure-observer
          :trackId="'combined-click.' + index"
          :observedTargetId="'soldSeparatelyDescription' + index"
          :extendedAttributes="gioProductAttributes"
        /> -->
          <div class="item-service-text">
            {{ t('cart.combined_products_title') }}
          </div>
          <i class="item-service-yellow"></i>
          <div class="item-service-thr" @click.stop="openCombined(item)">
            {{ t('cart.combined_products') }}
          </div>
        </div>
        <div v-if="item.product.reminders && item.product.reminders.length > 0" class="item-Customized">
          <span :class="{ colorDf: !item.offShelf }">{{ t('cart.remarks') }}</span>
          <span :class="{ colorDf: !item.offShelf }">{{ '•' + item.product.reminders[0] }}</span>
        </div>
      </div>
      <i-message v-if="showMessage" class="goods-item__message" variant="positive">
        <template #icon>
          <!-- <i-svg-icon class="goods-item__icon" :src="`/icons/information-circle.svg`" /> -->
          <i-icon class="goods-item__icon" size="0.18rem" component-name="NoticeCircleIcon" />
        </template>
        <span> {{ t('cart.product_out_of_stock_tips_prefix') }} </span>
        <span class="goods-item__link" @click="customerService"> {{ t('contact_customer_service') }} </span>
        <span> {{ t('cart.product_out_of_stock_tips_suffix') }} </span>
      </i-message>
      <product-list-card
        v-if="showChildItems"
        class="goods-item__child"
        :product-full-id="item.productFullId"
        :product-list="item.product.childItems"
        @viewAll="viewAllChildItems"
      />
      <!-- <assemble-service v-if="item.product.hasAssemblyService" v-model:value="showService" :product="serviceProduct" /> -->
      <i-layer v-model:value="showVTPItems" :type="isH5?'bottom':'right'" :header-show="true" :title="isH5?t('cart.product_component_list'):''">
        <VirtualProductDetail :virtual-product="item.product" />
      </i-layer>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, defineProps, defineEmits, computed, watchEffect } from 'vue'
import base from 'composables/base.ts'
import { CartPrice, CartItemDescription, AssembleService } from 'molecules'
import ProductListCard from 'molecules/ProductListCard/ProductListCard.vue'
import VirtualProductDetail from 'molecules/VirtualProductDetail/VirtualProductDetail.vue'
import ProductResemble from 'molecules/ProductResemble/ProductResemble.vue'
import { toast } from 'atoms/IToast/index'
// 基础组件
import ILayer from 'atoms/ILayer/ILayer.vue'
import IMessage from 'atoms/IMessage/IMessage.vue'
import ISvgIcon from 'atoms/ISvgIcon/SvgIcon.vue'
import IIcon from 'atoms/IIcon/IIcon.vue'
import InputNumber from 'molecules/InputNumber/InputNumber.vue'
import { getImgUrlByPath, debounce, formatPrice } from '@/utils/helper'
import { shoppingBag } from '@/api/config'
import { generateLink } from '@/utils/index'
// import gioHooks from '@/utils/hooks/gio'
// const { gio } = gioHooks()

const props = defineProps({
  dataTrackId: {
    type: String,
    default() {
      return ''
    },
  },
  dataModuleId: {
    type: String,
    default() {
      return ''
    },
  },
  error: {
    type: String,
    required: true,
    default: 'success',
  },
  productInfo: {
    type: Object,
    default() {
      return {}
    },
  },
  item: {
    type: Object,
    default() {
      return {}
    },
  },
  sence: {
    type: String,
    default() {
      return ''
    },
  },
  index: {
    type: Number,
    default() {
      return 0
    },
  },
  // 缺货推荐
  isOutResemble: {
    type: Boolean,
    default: false,
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['onCallStockAddress', 'calculationAllSelect', 'showServiceContBtn', 'openCombined', 'carItemEdit', 'toggleCollect', 'delete', 'addToCart'])
const { t, $router, locale, isH5 } = base()
const quantity = ref(props.item.quantity)
const showVTPItems = ref(false) // 显示虚拟商品的商品清单及配件
const showService = ref(false) // 组装服务
// const serviceProduct = ref({}) // 组装服务gio商品信息
const hasUnavailableItems = computed(() => {
  return props.item.product.childItems?.some((child) => {
    return child.product.stockStatus === 'OUTOFSTOCK'
  })
})
/**
     * 用于判断购物袋中的商品是否可选择
     */
const selectable = computed(() => {
  const item = props.item
  return (
    item.stocked
      && item.offShelf
      && !(item.product?.itemType === 'VTP' && props.isEditing)
      && !hasUnavailableItems.value
  )
})
const showChildItems = computed(() => {
  return props.item.product?.childItems?.length > 0
})
const showMessage = computed(() => {
  if (props.item.product.itemType !== 'VTP') return false

  return (
    props.item.product?.offline || props.item.product?.saleableInfo?.saleable === false || hasUnavailableItems.value
  )
})
// 改变数量
const numberChange = debounce(async(data) => {
  if (data.type === 'add' && data.number >= 99) {
    // this.nativeMessage = this.t('cart.select_up_to_99_items')
    // this.nativeMessage = this.t('cart.select_at_least_one_product')
    // this.nativeMessageShow = true
    toast({ text: t('cart.select_up_to_99_items'), duration: 3000, textPosition: 'center' })
  }
  const item = props.item
  const params = {
    itemId: item.itemId,
    quantity: data.number,
  }
  const res = await shoppingBag.numberChanges(params)
  if (res.isSuccess) {
    item.oldQuantity = data.number
  }
  else {
    item.quantity = item.oldQuantity
    quantity.value = item.oldQuantity
    if (res.data && res.data.message) {
      // this.toasted.show(err.data.message)
      toast({ text: res.data.message, duration: 3000, textPosition: 'center' })
    }
  }
}, 500)
// 去详情页
const goDetail = (item) => {
  // 下线及VTP类型的商品不支持PIP页面跳转
  if (item.product?.offline || item.product?.itemType === 'VTP')
    return

  // gio.trackClickData({
  //   trackId: props.dataTrackId ? props.dataTrackId : `product-click.${props.index}`,
  //   trackLabel: item.product.name,
  //   productInfo: item.product.type === 'SPR' ? `s${item.product.id}` : item.product.id,
  // })
  // const showId = this.utils.getDetailUrl(item.product)
  const showId = item.product.id
  sessionStorage.setItem('listPosition', props.index.toString())
  const link = generateLink(`/p/${showId}`, locale.value)
  if (isH5.value) {
    // $router.push({
    //   path: link,
    // })
    window.location.href = link
  }
  else {
    window.open(link)
  }
}
const customerService = () => {
  const productName = props.item.product.name
  const productCode = props.item.product.productDesc[1] || ''
  const productDesc = props.item.product.productDesc[0] || ''
  const message = `我设计的 ${productName} ${productCode}。我的衣柜信息：${productDesc}。我的衣柜配件部分缺货请帮我调整缺货商品`
  // this.invokeCustomerService(globalConsts.ServiceID, message)
}
const viewAllChildItems = () => {
  showVTPItems.value = true
}
// 编辑单个商品
const editItem = () => {
  emit('carItemEdit', props.item, props.index, isH5.value)
}
// 打开组装服务
const openAssembleService = () => {
  // serviceProduct.value = props.item.product
  // showService.value = true
  // emit('showServiceContBtn')
}
const handelDate = (date) => {
  return date.replace(/-/g, '.')
}
const selectBtn = (item) => {
  item.selected = !item.selected

  const trackId = item.selected ? `${props.dataModuleId}.0` : `${props.dataModuleId}.1`
  // gio.trackClickData({
  //   trackId,
  //   trackLabel: item.selected ? '选择商品' : '去选商品',
  // })

  emit('calculationAllSelect')
}
// 打开配套买
const openCombined = () => {
  const item = props.item
  // gio.trackClickData({
  //   trackId: props.dataTrackId ? props.dataTrackId : `combined-click.${props.index}`,
  //   trackLabel: item.product?.name || item.name,
  //   productInfo: item.product?.type === 'SPR' ? `s${item.product?.id}` : item.product?.id || item.id,
  // })
  emit('openCombined', item, props.index)
}
const onCallStockAddress = () => {
  emit('onCallStockAddress')
}
// 收藏- 取消收藏
const toggleCollect = () => {
  emit('toggleCollect', props.item)
}
const handleAddToCart = (item) => {
  emit('addToCart', item)
}
watchEffect(() => {
  quantity.value = props.item.quantity
})
</script>

<style lang="scss" scoped>
.goods-item__message {
  margin-left: 0.08rem;
  margin-top: 0.12rem;

  span {
    font-size: 0.12rem;
    line-height: 0.24rem;
    vertical-align: middle;
  }

  .goods-item__icon {
    min-width: 0.24rem;
    padding: 0 0.05rem;
    vertical-align: middle;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :deep(.i-message__body) {
    padding: 0;
  }

  .goods-item__link {
    text-decoration: underline;
    color: #0058a3;
    vertical-align: middle;
  }
}

.goods-item {
  border-bottom: 1px solid #f5f5f5;
  padding: 0.3rem 0.2rem 0.3rem 0.12rem;

  .goods-item-bottom {
    .item-time-end {
      display: flex;
      height: 0.3rem;
      align-items: center;

      .item-time-text {
        flex: 0 0 1.21rem;
        color: #666;
        font-size: 0.12rem;
        line-height: 0.14rem;
        text-align: right;
      }

      .item-time-num {
        color: #666;
        font-size: 0.12rem;
        line-height: 0.14rem;
        opacity: 0.68;
        white-space: nowrap;
        margin-left: 0.1rem;
      }
    }

    .item-time {
      display: flex;
      height: 0.3rem;
      align-items: center;
    }

    .item-service {
      display: flex;
      height: 0.3rem;
      align-items: center;

      .item-service-text {
        flex: 0 0 1.21rem;
        color: #666;
        font-size: 0.12rem;
        line-height: 0.14rem;
        text-align: right;
      }

      img {
        width: 0.25rem;
        height: 0.25rem;
        margin-left: 0.05rem;
        // margin-right: .06rem;
      }

      .item-service-thr {
        color: #666;
        font-size: 0.12rem;
        line-height: 0.24rem;
        opacity: 0.68;
        display: flex;
        align-items: center;

        .icon {
          margin-left: 0.05rem;
          vertical-align: bottom;
          color: #333;
        }
      }

      .item-service-yellow {
        width: 0.06rem;
        height: 0.06rem;
        background: #ffa524;
        border-radius: 100% 100%;
        display: inline-block;
        margin: 0 0.05rem 0 0.1rem;
      }
    }

    .item-Customized {
      display: flex;
      min-height: 0.3rem;
      padding-top: 0.08rem;
      align-items: flex-start;

      span:nth-child(1) {
        flex: 0 0 1.21rem;
        color: #666;
        font-size: 0.12rem;
        line-height: 0.14rem;
        text-align: right;
      }

      span:nth-child(2) {
        color: #666;
        font-size: 0.12rem;
        line-height: 0.16rem;
        opacity: 0.68;
        margin-left: 0.1rem;
      }
    }
  }

  .goods-item-top {
    display: flex;

    .selected-all {
      display: flex;
      flex: 0 0 24px;
      width: 24px;
      height: 24px;
      position: relative;

      .select-icon-box {
        position: absolute;
        left: -50%;
        top: 0.2rem;
        z-index: 1;
        width: 0.5rem;
        height: 0.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .select-icon {
        border: 0.01rem solid #959595;
        cursor: pointer;
      }
    }

    .selected-item-box {
      flex: 1 0 0;
      display: flex;
      // border-bottom: 0.01r solid #DFDFDF;
      // padding-bottom: .34rem;
      position: relative;
      cursor: pointer;

      .item-img {
        margin-left: 0.07rem;

        img {
          width: 0.8rem;
          height: 0.8rem;
          -o-object-fit: contain;
          object-fit: contain;
        }
      }

      .item-details {
        margin-left: 0.17rem;
        flex: 1 0 0;
        position: relative;

        .overflow-img {
          width: 0.13rem;
          height: 0.13rem;
          display: flex;
          align-items: center;
          position: absolute;
          top: 0;
          right: 0;
        }

        .item-tags {
          font-size: 0.11rem;
          line-height: 0.16rem;
          min-height: 0.16rem;
          border-radius: 0.04rem;
          margin-bottom: 0.1rem;

          span {
            display: inline-block;
            font-weight: bold;
            line-height: 0.16rem;
            min-height: 0.16rem;
            border-radius: 0.04rem;
            margin-right: 0.05rem;
          }
        }

        .item-name {
          font-weight: bold;
          font-size: 0.12rem;
          line-height: 0.21rem;
          min-height: 0.21rem;
          color: #111;
        }

        .item-des {
          font-size: 0.12rem;
          line-height: 0.18rem;
          color: #484848;
          margin-top: 0.02rem;
        }

        .item-prc-onlinesalable {
          margin-top: 0.08rem;
          line-height: 0.18rem;
          height: 0.18rem;

          .item-prc-onlinesalable-dian {
            display: inline-block;
            background: #e00751;
            margin: 0.06rem 0.05rem 0.06rem 0;
            border-radius: 50%;
            width: 0.07rem;
            height: 0.07rem;
            vertical-align: middle;
          }

          .item-prc-onlinesalable-text {
            font-style: normal;
            font-weight: normal;
            font-size: 0.12rem;
            line-height: 0.18rem;
            color: #484848;
            vertical-align: middle;
          }
        }

        .item-stock {
          margin-top: 0.12rem;
          display: flex;
          height: 0.18rem;
          align-items: center;

          div:nth-child(1) {
            background: #e00751;
            width: 0.07rem;
            height: 0.07rem;
            border-radius: 50%;
          }

          div:nth-child(2) {
            margin-left: 0.06rem;
            color: #484848;
            font-size: 0.12rem;
          }
        }

        .item-quantity {
          display: flex;
          // justify-content: space-between;
          margin-top: 0.12rem;
          width: 100%;
          // min-height: .65rem;

          .item-price {
            margin-top: 0.05rem;
            flex: 1;

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
            }

            .member-price-text {
              color: #111;
              text-align: right;
              font-size: 0.12rem;
              line-height: 0.16rem;
            }
          }
        }
      }
    }
  }

  .goods-item__child {
    margin-left: 0.08rem;
    margin-top: 0.15rem;
  }
}

.item-prc-resemble {
  margin: 0.1rem 0;
  display: inline-block;
}

.goods-item:last-child {
  border: none;
}

.number {
  font-style: normal;
  font-weight: normal;
  font-size: 0.12rem;
  line-height: 0.27rem;
  color: #666;
}

.item-img-op5 {
  opacity: 0.5;
}

.checked {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  // background: ~'url(@{ImgUrlHost}/images/h5/cart/cart-checked.svg)' no-repeat center;
  // background-position: center;
  background-color: #0058a3;
  border: 0 !important;
  display: flex;
  justify-content: center;
  align-items: center;
}

.no-checked {
  width: 24px; //全部改成24px是因为android手机上的.16rem不是圆形而是椭圆
  height: 24px;
  border-radius: 50%;
  border: 0.01rem solid #dfdfdf;
}

.no-selected {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 0.01rem solid #dfdfdf !important;
  background: #f5f5f5;
}

.colorDf {
  color: #dfdfdf !important;
}

.item-pc-price {
  padding-top: 0.23rem;
}

.item-manage {
  display: none;

  ul {
    height: 100%;
    display: flex;
    align-items: center;
  }

  li {
    display: inline-block;
    margin: 0 0 0 0.15rem;
  }
}

.item-quantity:hover {
  .item-manage {
    display: inline-block;
  }
}

.pc-cart-product-item {
  .item-Customized {
    span:nth-child(1) {
      flex: none !important;
    }
  }
}
</style>
