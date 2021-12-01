import { ref } from 'vue'
import { mergeApi } from '@/utils/apimerge'
import { product } from '@/api/config'
export const initCheckStockAddressByIP = ref('')
export async function resolveStockState(products, province, city, zipCode) {
  if (!products) return
  const productIds
        = products?.map((item) => {
          const id = item.id || item.productId || item.product?.id
          if (item.itemType === 'SPR' || item?.product?.itemType === 'SPR')
            return `s${id}`

          return id
        }) || []

  try {
    let transLocation = {}
    if (productIds.length <= 0)
      return
    if (province && city && zipCode) {
      transLocation = {
        province,
        city,
        zipCode,
      }
    }
    // const outOfStocks = await product.getStockByCity({
    //   productFullIds: productIds,
    //   location: transLocation,
    // })
    const outOfStocks = await mergeApi((params) => {
      return product.getStockByCity(params)
    }, {
      productFullIds: productIds,
      location: transLocation,
    }, 'productFullIds', 1000)
    initCheckStockAddressByIP.value = ''
    if (!province && !city && !zipCode)
      initCheckStockAddressByIP.value = [outOfStocks.data.province, outOfStocks.data.city].join(',')

    const resultMap = outOfStocks.data?.stockInfos?.reduce((prev, stockState) => {
      prev[stockState.productId] = stockState
      return prev
    }, {})
    // TODO: assign the outofstock to product object
    // quantity => stockQuantity; stockStatus
    products?.forEach((item) => {
      const stockState = resultMap[item.id || item.productId || item.product?.id]
      if (stockState) {
        item.stockQuantity = stockState.quantity
        item.stockStatus = stockState.stockStatus
        item.deliverable = outOfStocks.data.deliverable
      }
      else {
        item.stockQuantity = -1
        item.stockStatus = 'UNKNOWN'

        item.deliverable = true
      }
    })
  }
  catch (err) {}
}
// 产品库存相关
export default function productStock() {
  return {
    initCheckStockAddressByIP,
    resolveStockState,
  }
}
