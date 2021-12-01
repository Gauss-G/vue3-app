import stock from 'composables/product/stock'
import { ref } from 'vue'
import { csh, product } from '@/api/config'
import { _local } from '@/utils/helper.ts'
const { resolveStockState } = stock()

/**
   * 对后端接口获取的产品对象补充响应字段
   * id: 当id不存在时使用productId代替
   * image: 产品默认图
   * fullDescription: fullDescription不存在时使用type+designText+measureText拼凑
   * quantity: 产品默认加购数量，初始为1
   * stockQuantity: 库存数量初始化，-1代表暂未获取库存数量
   * stockStatus: 库存状态
   */
export function resolveProductAttribute(productInfo) {
  if (!productInfo) return productInfo
  productInfo.id = productInfo?.id || productInfo?.productId
  // productInfo.image =
  //   productInfo.image || (productInfo.images && productInfo.images.length > 0) ? productInfo.images[0].url : ''
  productInfo.image = productInfo?.image ? productInfo?.image : productInfo?.images ? productInfo?.images[0]?.url : ''
  productInfo.fullDescription
    = productInfo.fullDescription
    || [productInfo?.type, productInfo?.designText, productInfo?.measureText]?.filter(item => item).join(',')
  productInfo.quantity = productInfo.quantity || 1
  productInfo.stockQuantity = productInfo.stockQuantity || -1
  productInfo.stockStatus = productInfo.stockStatus || 'SUFFICIENT'

  return productInfo
}

/**
     * 初始化PAX商品的数据
     * @param {Array} data 需要处理的数据
     * @param {Number} number 主商品数量
     * @param {Boolean | String} type 当前只做 PAX 的判断 , 可以拓展到更多类型
     * @returns 返回 data 一个新 Array
     */
export function initializePaxData(data, type, number = 1) {
  if (!data) return []
  // 注意: 没有 type 返回 data
  if (!type) return data
  if (data.length) {
    // 不需要定义新的变量来增加内存压力
    data = data.map((item) => {
      // 配套商品需要数量的初始化 , 门把手PAX门的比例为 1:2
      // 记录配套商品的原始倍数
      item.quantityInitialValue = item.quantity
      item.quantity = Math.ceil((item.quantity / 2) * number)
      if (isNaN(item.quantity)) {
        item.quantityInitialValue = 1
        item.quantity = 1
      }
      // 随机排序信息
      // item.priority
      return item
    })
    data = data.filter(item => item.complexFurniture === 'PAX') || []
    // 冒泡排序
    if (data.length > 1) {
      data = data.sort((min, max) => {
        return min.priority - max.priority
      })
    }
    return data
  }
  else {
    return []
  }
}
/**
     * 统一处理数据
     * @param {*} brotherProducts 需要传入的数据
     * @returns 处理好的数据
     */
export function resolveBrotherProducts(brotherProducts) {
  let combinedProducts = []
  if (brotherProducts?.length > 0) {
    combinedProducts = brotherProducts.map((item) => {
      return Object.assign({}, item.product, {
        quantity: item.quantity,
        quantityInitialValue: item.quantityInitialValue,
        stockQuantity: item.stock,
        stockStatus: item.stockStatus,
        complexFurniture: item.complexFurniture || null,
        isCombined: false,
      })
    })
  }
  return combinedProducts
}
const PRODUCT_COMBINED_MODE = {
  NONE: 0,
  SINGLE: 1,
  MULTIPLE: 2,
}
/**
 * 是否为PAX
 */
const isPax = ref(false)
/**
 * 配套商品列表
 */
const combinedProducts = ref([])
/**
 * 配套商品选择模式
 */
const combinedMode = ref(0)
// number 主商品数量 购物车页面联动需要知道主商品数量来联动
export async function resolveCombinedProducts(productId, number = 1) {
  if (!productId) return
  const result = await product.getBrotherProducts(productId)
  isPax.value = result?.data?.brotherProducts?.some(item => item.complexFurniture === 'PAX') || false

  result.data = {
    brotherProducts: initializePaxData(result?.data?.brotherProducts, isPax.value, number),
  }

  const { brotherProducts } = result.data || []

  if (brotherProducts?.length > 0) {
    combinedProducts.value = resolveBrotherProducts(brotherProducts)

    combinedMode.value
      = combinedProducts.value.length === 1 ? PRODUCT_COMBINED_MODE.SINGLE : PRODUCT_COMBINED_MODE.MULTIPLE
  }
  else {
    combinedMode.value = PRODUCT_COMBINED_MODE.NONE
    combinedProducts.value = []
  }

  const orderLimitPromises = combinedProducts.value.map((combinedProduct) => {
    return csh.getOrderLimit(combinedProduct.id)
  })

  try {
    Promise.all(orderLimitPromises).then((results) => {
      results.forEach((result, index) => {
        combinedProducts.value[index].maximumOrderQuantity = result.data.maximum_order_quantity
      })
    })
  }
  catch (err) {
    // eslint-disable-next-line no-console
    console.log(err)
  }

  // 检查用户是否存在库存地址，用于校验库存信息
  if (_local.get('stockAddress')) {
    const stockAddress = _local.get('stockAddress')
    await resolveStockState(
      combinedProducts.value,
      stockAddress.province,
      stockAddress.city,
      stockAddress.zipCode,
    )
  }
}
/**
 * 批量处理配套买数据
 * @param {*} data 需要处理的数据
 * @returns 返回处理好的数据
 */
const getBrotherProductsWithStock = async(data) => {
  const res = await product.getBrotherProductsWithStock(data)
  res.data.forEach((item) => {
    item.brotherProducts = resolveBrotherProducts(item.brotherProducts)
  })
  return res
}

/**
 * 批量获取产品信息
 * @param {*} data 需要处理的数据
 * @returns 返回处理好的数据
 */
const getProductsByIdList = (ids: string[]): Promise<any> => {
  return product.getProductsByIdList({
    ids: ids.join(','),
  })
}

const getProductInfo = (id: string, type: string): Promise<any> => {
  return product.getProductInfo(id, type)
}

// 产品相关
export default function productBase() {
  return {
    isPax,
    combinedProducts,
    combinedMode,
    resolveCombinedProducts,
    resolveProductAttribute,
    getBrotherProductsWithStock,
    getProductsByIdList,
    getProductInfo,
  }
}
