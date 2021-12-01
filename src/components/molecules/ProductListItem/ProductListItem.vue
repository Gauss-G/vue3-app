<template>
  <div class="list-contant-item" :class="{ compression }" @click="goToDetail(item, (index + 1) * 2)">
    <ProductExposureObserver :product="item" :allow-repeating-trigger="true" />
    <div class="item_img">
      <img v-lazy="(item.mainImageUrl || item.image) + '?f=xxxs'" width="1.26rem" height="1.26rem" alt />
      <img v-if="item.sceneImage && !isH5" v-lazy="item.sceneImage" class="item_scene" />
      <!-- promotion label corner start -->
      <div
        v-if="item.labelImage && item.labelImage.corner && item.labelImage.corner.imageUrl"
        class="promotion-list-img-cornor"
      >
        <img :src="item.labelImage.corner.imageUrl" alt="" />
      </div>
      <div v-if="item.productSubTags && item.productSubTags.length > 0" class="product-card__subtags">
        <ul>
          <li v-for="(subitem, i) in item.productSubTags" :key="i">
            {{ subitem.name }}
          </li>
        </ul>
      </div>
      <!-- promotion label corner end -->
      <div v-if="outOfStock && isShowOut" class="out-of-stock">
        <span>{{ t('product.out_of_stock') }}</span>
      </div>
    </div>
    <div
      v-if="
        !(
          (item.labelImage && item.labelImage.corner && item.labelImage.corner.imageUrl) ||
          (item.labelImage && item.labelImage.banner && item.labelImage.banner.imageUrl)
        ) && item.labelImageUrl
      "
      class="promotion-label"
    >
      <img :src="item.labelImageUrl" alt="" srcset="" width="96" height="20" />
    </div>
    <!-- promotion label banner start -->
    <div
      v-if="item.labelImage && item.labelImage.banner && item.labelImage.banner.imageUrl"
      class="promotion-list-img-banner"
    >
      <img :src="item.labelImage.banner.imageUrl" alt="" />
    </div>
    <!-- promotion label banner end -->
    <div class="list-item-bottom">
      <div v-if="item.priceDisplay && item.priceDisplay.tags && item.priceDisplay.tags.length" class="item-tags-box">
        <div class="item-tags">
          <span v-for="(tag, idx) in item.priceDisplay.tags" :key="idx" :style="{ color: '#' + tag.colorHex }">{{
            tag.name
          }}</span>
        </div>
      </div>
      <!-- <price-valid-date v-if="item.price && item.price.type === 'TRO'" :valid-to-date="item.price.validToDate" /> -->
      <div v-if="item.price && item.price.type === 'TRO'" class="price-valid-date-wrap">
        <span>{{ t('product.price_valid_date') }}</span><span>{{ validToDateStr }}</span>
      </div>
      <div :class="['item-name', !compression && isAddMarginTop ? 'add-margin' : '']">
        {{ item.name }}
      </div>
      <div v-if="item.typeName" class="item-des">
        <template v-if="locale === 'zh'">
          {{ item.typeName }}{{ item.itemMeasureReferenceText ? '，' + item.itemMeasureReferenceText : '' }}
        </template>
        <template v-else>
          {{ item.typeName }}{{ item.itemMeasureReferenceText ? ',' + item.itemMeasureReferenceText : '' }}
        </template>
      </div>
      <div v-else class="item-des">
        <template v-if="locale === 'zh'">
          {{ item.productType }}{{ item.designText ? '，' + item.designText : ''
          }}{{ item.measureText ? '，' + item.measureText : '' }}
        </template>
        <template v-else>
          {{ item.productType }}{{ item.designText ? ',' + item.designText : ''
          }}{{ item.measureText ? ',' + item.measureText : '' }}
        </template>
      </div>
      <div
        v-if="item.priceDisplay && item.priceDisplay.validFromDate && item.priceDisplay.validToDate"
        class="item-time"
      >
        {{ t('product.term_of_validity') }}:
        <br />
        {{ handleDate(item.priceDisplay.validFromDate) }}-{{ handleDate(item.priceDisplay.validToDate) }}
      </div>
      <div
        v-if="!(item.priceDisplay && item.priceDisplay.validFromDate && item.priceDisplay.validToDate)"
        class="padding"
      />
      <commit-price :item="item" show-price-max direction="column" style="margin-top: 0;" />
      <div v-if="hasMoreVariants" class="withprice-more" @click="handleVariantsClick">
        <p class="tag disable-event">
          + {{ item.gprDescription.numberOfVariants }}{{ t('product.variants_tip') }}
        </p>
      </div>
      <div
        v-if="bagAddEnable && !outOfStock"
        class="product-bag-add-button"
        @click.stop.prevent="handleAddToBag($event)"
      >
        <i-button
          type="button"
          :icon="bagAdded ? 'check' : 'ShoppingBagAddIcon'"
          :loading="bagAdding"
          :icon-only="true"
          :small="true"
          variant="emphasised"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'
import CommitPrice from 'atoms/CommitPrice/CommitPrice.vue'
import IButton from 'atoms/IButton/IButton.vue'
import ProductExposureObserver from 'atoms/observer/ProductExposureObserver.vue'
import base from 'composables/base'

import { generateLink } from '@/utils/index'
import { dateFormat, formatPrice } from '@/utils/helper'
import gioHooks from '@/utils/hooks/gio'
const { gio } = gioHooks()

const { t, locale, isH5 } = base()
const emits = defineEmits(['onAddToBag'])
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
  dataModuleName: {
    type: String,
    default() {
      return ''
    },
  },
  item: {
    type: Object,
    default() {
      return {}
    },
  },
  index: {
    type: Number,
    default() {
      return 1
    },
  },
  isShowOut: {
    type: Boolean,
    required: false,
  },
  bagAddEnable: {
    type: Boolean,
    required: false,
  },
  compression: {
    type: Boolean,
    required: false,
  },
})
const isAddMarginTop = computed(() => {
  const item = props.item
  let result = null
  if (
    (item.priceDisplay && item.priceDisplay.tags && item.priceDisplay.tags.length)
        || (item.price && item.price.type === 'TRO')
  ) {
    // 有tag或者有价格有效期，不加margin
    result = false
  }
  else {
    result = true
  }
  return result
})
const hasMoreVariants = computed(() => {
  return props.item.gprDescription?.numberOfVariants > 0
})
const validToDateStr = computed(() => {
  const validToDate = props.item.price.validToDate
  const validToDateStr
        = locale.value === 'zh' ? dateFormat(validToDate, 'YYYY年MM月DD日') : dateFormat(validToDate, 'MMM Do YYYY')
  return validToDateStr
})
const outOfStock = computed(() => {
  return props.item.stockStatus === 'OUTOFSTOCK' || !props.item.onlineSalable
})

const handleVariantsClick = () => {
  gio.trackPLPVariantClick(props.item)
  sessionStorage.setItem('PLPVariantClick', true)
}
const goToDetail = (item, index) => {
  sessionStorage.setItem('listPosition', index)
  const showId = item.id || item.product.id
  const link = generateLink(`/p/${showId}`, locale.value)
  // gtag('event', 'content_widget_click', {
  //   event_category: 'search_page_actions',
  //   event_label: item.url,
  //   search_type: 'hard_search',
  //   page_type: 'search - serp',
  //   non_interaction: false,
  //   transport_type: '',
  // })
  // let navigationLink = ''
  // if (this.$attrs.breadList) {
  //   const breadList = this.$attrs.breadList
  //   const list = Object.values(breadList)
  //   list.forEach((val, index) => {
  //     if (index === list.length - 1)
  //       navigationLink += val.id
  //     else
  //       navigationLink += `${val.id} | `
  //   })
  // }
  // select_content
  // gtag('event', 'select_content', {
  //   event_label: item.id,
  //   items: [
  //     {
  //       id: item.id,
  //       list_name: this.name === 'home' ? 'PLP - home' : 'PLP - campaigns',
  //       list_position: this.index + 1,
  //       list_click_position: this.index + 1,
  //       name: this.utils.getGaName(item),
  //       brand: this.utils.getGaBrand(item.name),
  //       variant: item.itemType || '',
  //     },
  //   ],
  //   non_interaction: false,
  //   transport_type: 'beacon',
  //   navigation_type: 'Main Navigation Bar',
  //   navigation_from: window.location.href,
  //   navigation_link: navigationLink,
  // })

  gio.trackClickData({
    trackId: props.dataTrackId ? props.dataTrackId : `product-click.${props.index}`,
    trackLabel: item.name,
    moduleId: props.dataModuleId,
    moduleName: props.dataModuleName || '',
    productInfo: item.type === 'SPR' ? `s${item.id}` : item.id,
    productName: item.name,
    modulePosition_var: props.index || 0,
  })

  if (isH5.value)
    window.location.href = link

  else
    window.open(link)
}
const handleShowPrice = (item) => {
  if (item.price.type === 'FAM' || item.price.type === 'PMP' || item.price.type === 'NLP')
    return formatPrice(item.price.specialPrice, 2)

  return formatPrice(item.price.regularPrice, 2)
}
const handleStyle = (item) => {
  if (item.priceDisplay.currentPriceColorType === 'BTI')
    return true
  else if (item.priceDisplay.currentPriceColorType === 'HEX')
    return false
}
const handleDate = (date) => {
  return date.replace(/-/g, '.')
}
const handleAddToBag = (event) => {
  emits('onAddToBag', {
    target: event.target,
    item: props.item,
    trackId: props.dataTrackId ? props.dataTrackId : `product-click.${props.index}`,
    trackData: {
      moduleId: props.dataModuleId,
      moduleName: props.dataModuleName || '',
      modulePosition_var: props.index || 0,
      position_var: props.index || 0,
    },
  })
}
</script>

<style lang="scss" scoped>
.list-contant-item {
  width: 100%;
  background-color: #fff;
  margin-bottom: 0.1rem;
  border-radius: 0.05rem;
  position: relative;

  &.compression {
    position: relative;
    display: block;
    margin-bottom: 0.2rem;

    .out-of-stock {
      span {
        padding: 0 0.1rem;
        width: 0.6rem;
        height: 0.6rem;
        font-size: 0.1rem;
        line-height: 0.16rem;
      }
    }

    .item_img {
      position: relative;
      display: inline-block;
      vertical-align: top;
      width: 0.9rem;
      height: 0.9rem;
      padding-top: 0;
    }

    .list-item-bottom {
      display: inline-block;
      vertical-align: top;
      padding: 0.08rem;
      margin: 0;
      width: calc(100% - 0.9rem);

      .item-tags-box,
      .price-valid-date-wrap,
      .item-des,
      .item-time,
      .withprice-more {
        display: none;
      }

      .padding {
        height: 0.1rem;
      }

      .item-name {
        display: block;
        margin: 0;
        font-size: 0.14rem;
        line-height: 0.21rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .product-bag-add-button {
      display: block !important;

      button {
        &:deep(.btn__inner) {
          width: 0.32rem;
          height: 0.32rem;
        }
      }
    }
  }

  .out-of-stock {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    z-index: 1;

    span {
      background: rgba(0, 0, 0, 0.7);
      padding: 0 0.1rem;
      width: 0.75rem;
      height: 0.75rem;
      border-radius: 50%;
      font-size: 0.12rem;
      line-height: 0.2rem;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2;
      text-align: center;
    }
  }

  .product-card__subtags {
    position: absolute;
    left: 0.1rem;
    bottom: 0;
    z-index: 1;
    min-width: 0.3rem;

    li {
      background: rgba(17, 17, 17, 0.8);
      border-radius: 3px;
      min-width: 0.3rem;
      height: 0.2rem;
      text-align: center;
      color: #fff;
      font-weight: bold;
      font-size: 0.1rem;
      line-height: 0.2rem;
      margin: 2px 0;
      padding: 0 0.04rem;
    }
  }

  .promotion-label {
    position: absolute;
    width: 1rem;
    height: 0.2rem;
    left: 0;
    top: 1.44rem;
    z-index: 1;

    img {
      width: 100%;
      height: auto;
    }
  }

  .promotion-list-img-banner {
    width: 100%;
    height: 0.24rem;
    max-height: 0.4rem;

    > img {
      width: 100%;
      height: 100%;
    }
  }

  .item_img {
    width: 100%;
    padding-top: 100%;
    position: relative;
    border-radius: 0.06rem 0.06rem 0 0;
    cursor: pointer;

    img {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      object-fit: cover;
      object-position: center;
    }

    .item_scene {
      opacity: 0;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      transition: 300ms all;
      transform: translate(0%, 0);
    }

    &:hover {
      .item_scene {
        display: block;
        opacity: 1;
      }
    }

    .promotion-list-img-cornor {
      width: 0.4rem;
      height: 0.4rem;
      position: absolute;
      left: 0;
      top: 0;

      > img {
        width: 100%;
        height: 100%;
      }
    }

    .no_img {
      background-color: #f5f5f5;
      width: 1.23rem;
      height: 1.23rem;
      border-radius: 6px;
      margin: 0 auto;
      position: relative;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  .list-item-bottom {
    padding: 0.1rem 0;
    margin-top: 0.1rem;
    // .item-tags-box {
    //   height: 0.32rem;
    // }
    .item-tags {
      min-height: 0.16rem;
      display: flex;
      flex-wrap: wrap;

      span {
        border-radius: 0.04rem;
        //padding: 0 .09rem;
        font-weight: bold;
        //border: .01rem solid #F5F5F5;
        color: #e42312;
        line-height: 0.16rem;
        font-size: 0.12rem;
        margin-right: 0.04rem;
      }
    }

    .item-name {
      // width: 1.36rem;
      line-height: 0.16rem;
      margin-top: 0.05rem;
      color: #111;
      font-weight: bold;
      font-size: 0.12rem;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      white-space: normal;

      &.add-margin {
        margin-top: 0.21rem;
      }
    }

    .item-des {
      margin-top: 0.05rem;
      color: #666;
      opacity: 0.68;
      font-size: 0.12rem;
      line-height: 0.16rem;
      height: auto;
      word-break: break-word;
      white-space: normal;
    }

    .item-time {
      word-break: break-word;
      min-height: 0.14rem;
      line-height: 0.15rem;
      font-size: 0.12rem;
      color: #666;
      margin-top: 0.05rem;
      opacity: 0.68;
    }

    .padding {
      height: 0.15rem;
    }

    .member-price {
      margin-top: 0.02rem;
      min-height: 0.16rem;
      line-height: 0.16rem;

      span {
        font-size: 0.12rem;
        line-height: 0.16rem;
      }

      span:nth-child(1) {
        color: #111;
      }

      span:nth-child(2) {
        color: #666;
      }
    }

    .item-prc-box {
      position: relative;
      display: inline-block;
      //margin-top: .15rem;

      .item-prc {
        color: #111;
        font-size: 0.1rem;
        font-weight: bold;
        display: inline-block;
        padding-left: 0.06rem;
        padding-right: 0.08rem;
        position: relative;
        z-index: 10;

        span:nth-child(1) {
          vertical-align: top;
          padding-top: 0.04rem;
          display: inline-block;
        }

        span:nth-child(2) {
          font-size: 0.18rem;
          margin-left: -0.05rem;
        }

        span:nth-child(3) {
          vertical-align: top;
          margin-left: -0.05rem;
          padding-top: 0.04rem;
          display: inline-block;
        }

        span:nth-child(4) {
          margin-left: -0.03rem;
        }
      }

      .redback {
        position: absolute;
        width: 100%;
        height: 0.26rem;
        background: #ed022a;
        z-index: 1;
        left: 0;
        top: 0;
        transform: translate(2px, 3px);
        -webkit-transform: translate(2px, 3px);
        -moz-transform: translate(2px, 3px);
        -ms-transform: translate(2px, 3px);
        -o-transform: translate(2px, 3px);
      }
    }
  }
}

.withprice-pricenum-bgc {
  background: #ffd800;
}

.withprice-more {
  word-break: break-all;
  margin-top: 0.1rem;

  .tag {
    font-size: 0.12rem;
    color: #0058a3;
    word-break: keep-all;
    position: relative;
    text-align: right;
  }

  .withprice-color {
    display: inline-block;
    margin-bottom: 0.1rem;
    line-height: 1;

    .color-tag {
      width: 0.12rem;
      height: 0.12rem;
      margin-right: 0.06rem;
      padding: 0;
      cursor: pointer;
      border-radius: 0.12rem;
      display: inline-block;
      line-height: 1;
      vertical-align: middle;
    }

    .tag-bgColor-10583 {
      border: none;
    }
  }
}

.price-valid-date-wrap {
  color: #ed022a;
  font-weight: bold;
  font-size: 0.1rem;
  line-height: 0.16rem;
  word-break: break-word;
  white-space: normal;

  span:first-child {
    padding-right: 0.06rem;
  }
}

.product-bag-add-button {
  position: absolute;
  bottom: 0;
  right: 0;
  display: none;
}

.list-contant-item:hover {
  .product-bag-add-button {
    display: block;
  }
}
</style>
