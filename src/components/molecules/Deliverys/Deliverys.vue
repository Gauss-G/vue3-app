<template>
  <div class="pay-delivery">
    <div class="pay-delivery-title">
      {{ t('address.delivery_type') }}
    </div>
    <div class="pay-delivery-panel">
      <div class="delivery-info">
        <div class="delivery-icon">
          <img :src="getImgUrlByPath('/images/pc/pay/pay/selectDeliveryMethod.svg')" />
        </div>
        <div class="delivery-detail">
          <label>普通送货</label>
          <p>标准配送，下单后通过货车或包裹形式送达。</p>
        </div>
        <div class="delivery-other">
          <label>{{ t('pay.selectOtherDeliveryMethod') }}</label>
        </div>
      </div>
      <!-- 所选地址 -->
      <div class="address-info">
        <div class="address-li">
          <label>{{ t('address.consignee') }}</label>
          <p>{{ checkedAddress.name }} {{ checkedAddress.mobile }}</p>
        </div>
        <div class="address-li">
          <label>{{ t('address.receiving_address') }}</label>
          <p>
            {{ checkedAddress.province }}{{ checkedAddress.city }}{{ checkedAddress.district }}{{ checkedAddress.street
            }}{{ checkedAddress.detailAddress }}
          </p>
        </div>
        <div class="address-other" @click="addressShow = true">
          {{ t('address.change_receiving_address') }}
        </div>
      </div>
    </div>
    <i-layer v-model:value="addressShow" type="right">
      <AddressListSelect :address-list="addressList" :checked-address-id="checkedAddress.addressId" @change="addressChange" />
    </i-layer>
  </div>
</template>

<script setup>
import { ref, defineProps, computed } from 'vue'
import base from 'composables/base'

import ILayer from 'atoms/ILayer/ILayer.vue'
import AddressListSelect from 'molecules/AddressList/AddressList.vue'
import { getImgUrlByPath } from '@/utils/helper'

const { t, $store } = base()
const props = defineProps({
  // 用户地址列表
  addressList: {
    type: Array,
    default() {
      return []
    },
  },
})
const addressShow = ref(false)
const addressChange = (item) => {
  // this.$store.dispatch('payInfo/setCheckedAddress', item)
  $store.dispatch('Checkout/SET_CHECKED_ADDRESS', item)
  addressShow.value = false
}
const checkedAddress = computed(() => {
  return $store.getters['Checkout/checkedAddress']
})
</script>

<style scoped lang="scss">
.pay-delivery {
  * {
    vertical-align: middle;
    position: relative;
  }

  .pay-delivery-title {
    font-style: normal;
    font-weight: bold;
    font-size: 0.18rem;
    line-height: 0.27rem;
    color: #111;
  }

  .pay-delivery-panel {
    background: #f5f5f5;
    border-radius: 4px;
    overflow: hidden;
  }

  .delivery-info {
    margin: 0.2rem;
    // min-height: .9rem;
    // padding: .2rem 0;
    .delivery-icon {
      width: 0.4rem;
      display: inline-block;
    }

    .delivery-detail {
      display: inline-block;
      max-width: calc(100% - 0.2rem);
      font-size: 0.14rem;
      line-height: 0.18rem;

      label {
        font-weight: bold;
        font-size: 0.16rem;
        line-height: 0.24rem;
        color: #111;
      }
    }
  }

  .address-info {
    margin: 0.2rem;
    padding: 0.2rem 0 0 0;
    border-top: 1px solid #dfdfdf;

    .address-li {
      font-size: 0.14rem;
      line-height: 0.18rem;
      color: #666;
      margin-bottom: 0.2rem;

      p {
        line-height: 0.22rem;
        color: #111;
        margin: 5px 0 0 0;
      }

      &:last-child {
        margin: 0;
      }
    }
  }

  .delivery-other,
  .address-other {
    position: absolute;
    top: 50%;
    right: 0.2rem;
    cursor: pointer;
    transform: translateY(-50%);
    font-size: 0.14rem;
    line-height: 0.21rem;
    color: #111;
  }
}

.pay-pop-selectshippingaddress {
  padding: 0 0.5rem;
}
</style>
