<!-- 库存地址选择 -->
<template>
  <div>
    <i-layer v-model:value="show" :title="t('address.select_address')" @close="close">
      <div v-if="pageloading" class="control-content-loadding">
        <div class="t-cell">
          <i-loading />
        </div>
      </div>
      <div class="stockaddress-panel">
        <div class="stockaddress-selected">
          <div class="stockaddress-selected-title">
            {{ t('address.delivery_to_now') }}
          </div>
          <div class="stockaddress-selected-info">
            <label>{{ formatAddress(cascaderValue) }}</label>
            <span @click="cascaderShow = true">{{ t('address.switch_city') }}</span>
          </div>
        </div>
        <div v-if="selectAddressList.length > 0" class="stockaddress-list">
          <h3>{{ t('address.select_stock_address') }}</h3>
          <ul>
            <li v-for="(item, index) in selectAddressList" :key="index">
              <stock-address-item :item="item" :is-check="true" @check="toggleAddress" />
            </li>
          </ul>
        </div>
      </div>
    </i-layer>
    <i-cascader
      v-model:value="cascaderShow"
      :text="cascaderValue"
      :data="cascaderData"
      :options="cascaderOptions"
      :is-have-hot="true"
      @change="change"
      @close="cascaderClose"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, defineProps, defineEmits } from 'vue'
import ILoading from 'atoms/ILoading/ILoading'
import ICascader from 'atoms/ICascader/ICascader.vue'
import base from 'composables/base'
import ILayer from 'atoms/ILayer/ILayer.vue'
import commonControl from 'composables/common/common'
import IIcon from 'atoms/IIcon/IIcon.vue'
import StockAddressItem from './StockAddressItem.vue'
import { deepClone, _local } from '@/utils/helper'
// import { publicService } from '~/mixins/business/publicService'
const props = defineProps({
  value: {
    type: Boolean,
  },
  // 产品id信息
  // productIds: {
  //   type: Array,
  //   default() {
  //     return []
  //   }
  // },
  // 是否显示有货无货的标识和图标
  stockDetail: {
    type: Boolean,
    default: false,
  },
  // 默认值:
  default: {
    type: String,
    default: '',
  },
})
const emits = defineEmits(['update:value', 'change', 'close'])
const { t, isH5 } = base()
const { cityData, addressList, getCityData, getAddressList, generateCityDatabyLevel } = commonControl(props)
const show = ref(false)
const contentShow = ref(false)// 显示动画
const pageloading = ref(false) //  选择时的loading
const cascaderData = ref([]) // 库存选择的数组集合
const cascaderOptions = ref({
  placeholder: t('address.select_City'),
})
const cascaderValue = ref('')
const isInit = ref(false) // 初始化数据的状态
const selectAddressList = ref([])
const cascaderShow = ref(false) // 城市选择显示
// 格式化地址
const formatAddress = (value) => {
  if (!value)
    return ''

  return value.split('/').splice(1).join('')
}
const close = () => {
  show.value = false
}
// 切换地址触发
const toggleAddress = (item) => {
  item.check = true
  selectAddressList.value.forEach((address) => {
    if (item.addressId !== address.addressId)
      address.check = false
  })
  const mo = { addressId: item.addressId, province: item.province, city: item.city, zipCode: item.zipCode }
  if (!item.province)
    return

  const stockAddress = {
    address: `${item.province}/${item.city}/${item.district}/${item.street}`,
    addressId: item.addressId,
    province: item.province,
    city: item.city,
    zipCode: item.zipCode,
  }
  if (!isInit.value)
    close()

  isInit.value = false
  cascaderValue.value = stockAddress.address
  _local.set('stockAddress', stockAddress)
  emits('change', {
    ...mo,
    address: stockAddress.address,
  })
  // $store.dispatch('setStockAddress',  stockAddress)
}
const isStockedAddress = (address, stockedAddress) => {
  if (address && stockedAddress)
    return stockedAddress.address === address

  return false
}
// 选择省市触发
const change = (data) => {
  if (data.list.length < 4)
    return
  selectAddressList.value.forEach((item) => {
    item.check = false
  })
  const mo = { addressId: '', province: data.list[0].name, city: data.list[1].name, zipCode: data.list[3].zipCode }
  // pageloading = true
  const address = `${data.list[0].name}/${data.list[1].name}/${data.list[2]?.name}/${data.list[3]?.name}`
  const stockedAddress = _local.get('stockAddress') ? _local.get('stockAddress') : {}
  const isStocked = isStockedAddress(address, stockedAddress)
  cascaderValue.value = data.text
  // const number = awaitsearchStock(mo)
  // pageloading = false
  const stockAddress = {
    ...mo,
    address: data.text,
    addressId: isStocked ? stockedAddress.addressId || '' : '',
  }
  if (!isInit.value)
    close()

  _local.set('stockAddress', stockAddress)
  emits('change', {
    ...mo,
    address: stockAddress.address,
  })
}
const cascaderClose = () => {
  if (!cascaderValue.value)
    close()
}
// 初始化数据
const initData = async() => {
  await getCityData() // 获取省市区数据
  cascaderData.value = generateCityDatabyLevel(4, true) // 生成省市和热门选项数据
  // 登陆状态下有地址时
  pageloading.value = true
  let addressList = await getAddressList()
  pageloading.value = false
  if (addressList)
    addressList = addressList.filter(item => item.zipCode)

  let selectItem = null
  const stockAddress = _local.get('stockAddress') ? _local.get('stockAddress') : {}
  selectAddressList.value = addressList
    ? deepClone(addressList).map((item) => {
      item.check = false
      if (stockAddress.addressId) {
        if (stockAddress.addressId === item.addressId) {
          item.check = true
          selectItem = item
        }
      }
      else if ((!stockAddress || !stockAddress.addressId) && item.default) {
        item.check = true
        selectItem = item
      }
      return item
    })
    : []

  // 走城市选择
  if (stockAddress.address && !stockAddress.addressId) {
    cascaderValue.value = stockAddress.address
    change({
      text: stockAddress.address,
      list: stockAddress.address.split('/').map((item) => {
        return { name: item, zipCode: stockAddress.zipCode }
      }),
    })
    emits('change', stockAddress)
    return
  }

  if (!stockAddress && !selectItem && selectAddressList.value.length > 0) {
    selectAddressList.value[0].check = true
    selectItem = selectAddressList.value[0]
  }
  // 走地址选择
  if (selectItem) {
    cascaderValue.value = `${selectItem.province}/${selectItem.city}`
    isInit.value = true
    toggleAddress(selectItem)
  }
}
onMounted(() => {
  initData()
})
watch(() => props.value, (newVal) => {
  show.value = newVal
})
watch(() => show.value, (newVal) => {
  emits('update:value', newVal)
})
watch(() => props.default, (newVal) => {
  if (newVal)
    cascaderValue.value = newVal
})

</script>

<style lang="scss" scoped>
.stockaddress-list {
  padding-bottom: 0.2rem;

  h3 {
    font-size: 0.14rem;
    line-height: 0.22rem;
    color: #666;
    font-weight: 400;
    padding: 0.15rem 0;
  }

  li {
    margin-bottom: 0.2rem;
    // &:last-child{
    //   border: 0;
    // }
  }
}

.stockaddress-panel {
  padding: 0 0.2rem;
}

.stockaddress-selected {
  font-size: 0.14rem;
  padding: 0.28rem 0 0 0;

  .stockaddress-selected-title {
    color: #666;
    margin-bottom: 0.15rem;
  }

  .stockaddress-selected-info {
    min-height: 0.3rem;
    display: flex;
    align-items: center;

    label {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex: 1;
      font-weight: 500;
    }

    span {
      margin-left: 0.1rem;
      color: #0058a3;
    }
  }
}

.checked {
  width: 24/16rem;
  height: 24/16rem;
  border-radius: 50%;
  // background: ~'url(@{ImgUrlHost}/images/cart/check.svg)' no-repeat center;
  background-position: center;
  border: none !important;
}

.control-content-loadding {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.6);
  z-index: 1;
  display: table;

  .t-cell {
    display: table-cell;
    vertical-align: middle;
    text-align: center;

    .line-spin-fade-loader {
      transform: scale(0.7);
      top: -15px;
    }
  }
}

:deep(.control-panel) {
  max-height: 80%;
}
</style>
