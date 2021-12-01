/**
   * 对后端接口获取的产品对象补充响应字段
   * id: 当id不存在时使用productId代替
   * image: 产品默认图
   * fullDescription: fullDescription不存在时使用type+designText+measureText拼凑
   * quantity: 产品默认加购数量，初始为1
   * stockQuantity: 库存数量初始化，-1代表暂未获取库存数量
   * stockStatus: 库存状态
   */
export const resolveProductAttribute = (productInfo) => {
  if (!productInfo) return productInfo
  productInfo.id = productInfo.id || productInfo.productId
  productInfo.image = productInfo?.image ? productInfo?.image : productInfo?.images ? productInfo?.images[0]?.url : ''
  productInfo.fullDescription
      = productInfo.fullDescription
      || [productInfo.type, productInfo.designText, productInfo.measureText].filter(item => item).join(',')
  productInfo.quantity = productInfo.quantity || 1
  productInfo.stockQuantity = productInfo.stockQuantity || -1
  productInfo.stockStatus = productInfo.stockStatus || 'SUFFICIENT'

  return productInfo
}
