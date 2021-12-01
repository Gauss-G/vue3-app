import { ref, computed } from 'vue'
import { checkout } from '@/api/config'

export default function shoppingBagCalc(onShelfList) {
  const payTotalDiscount = ref(0) // 促销优惠
  const priceloading = ref(false) // 价格计算的loading
  const payTotalMoney = ref(0) // 价格
  const familySaving = ref(0) // 会员优惠
  const isFamilyCardNo = ref(false) // 判断是否绑定会员卡号
  const familyCardNo = ref('') // 会员卡号
  const totalProduct = ref(0) // 商品总计
  // 选中商品的总数量
  const payTotalNum = computed(() => {
    let num = 0
    onShelfList.value.forEach((item) => {
      if (item.selected)
        num += parseInt(item.quantity, 10)
    })
    return num
  })

  // 计算总价格
  const calculateTotalprice = async(params) => {
    const priceList = []
    onShelfList.value.forEach((item) => {
      if (item.selected && item.quantity) {
        const params = {
          productFullId: item.productFullId,
          quantity: item.quantity,
        }
        priceList.push(params)
      }
    })
    if (priceList.length === 0) {
      payTotalMoney.value = 0
      payTotalDiscount.value = 0
      familySaving.value = 0
      totalProduct.value = 0
    }
    if (priceList.length <= 0) return
    const productItems = {
      productItems: priceList,
      ...params,
    }
    priceloading.value = true
    const res = await checkout.calculatePrice(productItems)
    priceloading.value = false
    if (res.isSuccess) {
      if (res.data.familyCardNo) {
        isFamilyCardNo.value = true // 判断有没有填充会员卡号
        familyCardNo.value = res.data.familyCardNo
      }
      else {
        // 非会员
        isFamilyCardNo.value = false
        familyCardNo.value = res.data.familyCardNo
      }
      if (res.status === 200) {
        payTotalMoney.value = res.data.summaryPrice?.totalPayment || 0
        payTotalDiscount.value = res.data.summaryPrice?.promotionSaving || 0
        familySaving.value = res.data.summaryPrice?.familySaving || 0
        totalProduct.value = res.data.summaryPrice?.totalProduct || 0
      }
    }
    // else {

    // }
  }
  return {
    payTotalDiscount,
    priceloading,
    payTotalNum,
    payTotalMoney,
    familySaving,
    isFamilyCardNo,
    totalProduct,
    familyCardNo,
    calculateTotalprice,
  }
}
