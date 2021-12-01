<template>
  <div class="pay-pop-selectshippingaddress">
    <div class="pay-pop-selectshippingaddress-title">
      {{ t('address.select_shipping_address') }}
    </div>
    <div class="selectshippingaddress-list">
      <div
        v-for="(item, index) in addressList"
        :key="index"
        class="selectshippingaddress-item"
        @click="checkedAddressFn(item)"
      >
        <div class="selectshippingaddress-item-name">
          {{ item.name }}
          <span v-if="item.default" class="selectshippingaddress-item-default">{{ t('cart.default_address') }}</span>
        </div>
        <div class="selectshippingaddress-item-mobile">
          {{ item.mobile }}
        </div>
        <div class="selectshippingaddress-item-address">
          <div class="address-detail">
            {{ item.province }} {{ item.city }} {{ item.district }} {{ item.street }} {{ item.detailAddress }}
          </div>
          <div class="edit-address" @click.stop="editAddress(item)">
            {{ t('edit') }}
          </div>
        </div>
        <div v-if="!item.zipCode" class="selectshippingaddress-item-address-tips">
          {{ t('address.invalid_tips') }}
        </div>
        <img
          v-if="item.addressId == checkedAddressId && item.zipCode"
          class="selectshippingaddress-item-img"
          :src="getImgUrlByPath('/images/detail/storeSelected.svg')"
          alt=""
        />
        <img
          v-if="item.addressId != checkedAddressId && item.zipCode"
          class="selectshippingaddress-item-img"
          :src="getImgUrlByPath('/images/detail/storeDefault.svg')"
          alt=""
        />
      </div>
    </div>
    <button class="new-delivery-address" @click="createAddress">
      <!-- {{ t('address.new_address') }} -->
      <i-button type="button" :fluid="true" variant="primary" @click="createAddress">
        {{ t('address.new_address') }}
      </i-button>
    </button>
    <i-layer v-model:value="editShow" type="right">
      <AddressEdit :address-listlength="addressList.length" :is-edit="isEdit" :item="addressItem" @close="editShow = false" />
    </i-layer>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed } from 'vue'
// import { mapState } from 'vuex'
// import AddressEdit from './AddressEdit'
// import ILayer from '~/components/base/ILayer'
// import IScrollbar from '~/components/base/IScrollbar'
import { useI18n } from 'vue-i18n'
import ILayer from 'atoms/ILayer/ILayer.vue'
import AddressEdit from 'molecules/AddressEdit/AddressEdit.vue'
import IButton from 'atoms/IButton/IButton.vue'
import { getImgUrlByPath } from '@/utils/helper'

const { t } = useI18n()

const props = defineProps({
  // 用户地址列表
  addressList: {
    type: Array,
    default() {
      return []
    },
  },
  // 当前所选地址
  checkedAddressId: {
    type: String,
    default: '',
  },
})
const emits = defineEmits(['change'])
const isEdit = ref(false)
const editShow = ref(false)
const addressItem = ref({})
const editAddress = (item) => {
  isEdit.value = true
  editShow.value = true
  addressItem.value = item
}
const createAddress = () => {
  isEdit.value = false
  addressItem.value = {}
  editShow.value = true
}
const checkedAddressFn = (item) => {
  if (!item.zipCode) return
  emits('change', item)
}
</script>

<style lang="scss" scoped>
//选择地址时
.pay-pop-selectshippingaddress {
  width: 100%;
  overflow: hidden;
  height: 100%;

  .pay-pop-selectshippingaddress-title {
    font-style: normal;
    font-weight: 600;
    font-size: 0.22rem;
    line-height: 0.32rem;
    color: #111;
  }

  .pay-pop-selectshippingaddress-add {
    display: flex;
    justify-content: space-between;

    span {
      font-style: normal;
      font-weight: normal;
      font-size: 0.14rem;
      line-height: 0.21rem;
      text-decoration-line: underline;
      color: #111;
      cursor: pointer;
      margin-top: 0.1rem;
    }
  }

  // .selectshippingaddress-list::-webkit-scrollbar {
  //   display: none;
  // }

  .selectshippingaddress-list {
    margin-top: 0.2rem;
    height: calc(100vh - 1.7rem);
    overflow-y: auto;
    // padding-bottom: 50/16rem;
    // margin-right: -50/16rem;
    // margin-bottom: -50/16rem;

    .selectshippingaddress-item {
      cursor: pointer;
      padding: 0.2rem 0;
      border-bottom: 1px solid #dfdfdf;
      position: relative;

      .selectshippingaddress-item-address {
        width: 100% !important;

        &::after {
          content: '';
          clear: both;
          display: block;
        }

        div.address-detail {
          width: 80% !important;
          float: left;
        }

        div.edit-address {
          float: right;
          text-align: center;
          width: 50px !important;
        }

        div.edit-address:hover {
          cursor: pointer;
        }

        font {
          width: 100%;
        }
      }

      .selectshippingaddress-item-address-tips {
        color: #e00751;
        margin-top: 0.1rem;
      }

      .selectshippingaddress-item-img {
        position: absolute;
        right: 0;
        top: 35%;
        transform: translate(0, -50%);
      }

      .selectshippingaddress-item-name {
        font-style: normal;
        font-weight: bold;
        font-size: 0.14rem;
        line-height: 0.22rem;
        color: #000;

        .selectshippingaddress-item-default {
          margin-left: 0.08rem;
          padding: 0 0.08rem;
          background: #0058a3;
          border-radius: 2px;
          font-style: normal;
          font-weight: 500;
          font-size: 0.12rem;
          line-height: 0.22rem;
          text-align: right;
          color: #fff;
        }
      }

      .selectshippingaddress-item-mobile {
        margin-top: 0.15rem;
        font-style: normal;
        font-weight: normal;
        font-size: 0.14rem;
        line-height: 0.24rem;
        color: #666;
      }
    }
  }

  .new-delivery-address {
    position: absolute;
    bottom: 0.2rem;
    left: 0;
    width: 100%;
    padding: 0 0.4rem;
  }
}

:deep(.control-panel .control-header) {
  height: 90px;
}
// :deep.i-scrollbar__bar {
//   right: -35/16rem;
// }
</style>
