import { ref } from 'vue'
import { shoppingBag, profile } from '@/api/config'

export default function shoppingListControl() {
  const cartList = ref([]) // 总的购物列表数据
  const offShelfList = ref([]) // 已下架
  const onShelfList = ref([]) // 正常商品
  const cartItemEditShow = ref(false)
  const selectEditItem = ref({})
  const selectEditItemIndex = ref(0)
  // 获取购物袋商品
  const getShoppingList = async() => {
    const res = await shoppingBag.getShoppingCart({})
    if (res.isSuccess) {
      cartList.value = []
      offShelfList.value = []
      onShelfList.value = []
      const offShelf = []
      const onShelf = []
      res.data?.items.forEach((item) => {
        item.selected = false
        item.isShow = false
        item.stocked = item.product.onlineSalable
        item.saleableInfo = item.product.saleableInfo
        item.oldQuantity = item.product.quantity
        item.addressStock = true
        item.offShelf = !item.product.offline
        if (!item.product.offline)
          onShelf.push(item)
        else
          offShelf.push(item)
      })
      // const inStock = []
      // const outStock = []
      // offShelf.forEach((ele) => {
      //   if (ele.saleableInfo) {
      //     if (ele.saleableInfo.saleable) {
      //       inStock.push(ele)
      //     } else {
      //       outStock.push(ele)
      //     }
      //   } else if (ele.stocked) {
      //     inStock.push(ele)
      //   } else {
      //     outStock.push(ele)
      //   }
      // })
      onShelfList.value = onShelf
      offShelfList.value = offShelf
      cartList.value = res.data?.items
    }
  }
  // 获取商品是否收藏
  const isFavoriteProduct = async(item: Object) => {
    // VTP类型的商品不需要检查是否已加入收藏
    if (item.product.itemType === 'VTP') return false
    const res = await profile.checkIsFavorite(item.product.id, item.product.itemType)
    if (res.isSuccess)
      return res.data.favoriteProduct
    else
      return false
  }
  // 收藏-取消收藏
  const toggleCollect = async(item: Object) => {
    let res
    if (item.isCollect)
      res = await profile.removeFavorites(item.product.id, item.product.itemType)
    else
      res = await profile.addFavorites(item.product.id, item.product.itemType)
    if (res.isSuccess) {
      item.isCollect = !item.isCollect
      // 收藏成功
      return res
    }
    else {
      // 收藏成功
      return res
    }
  }
  // 批量收藏
  const addCollectionSelect = () => {
    onShelfList.value.forEach(async(ele) => {
      if (ele.selected) {
        const res = await toggleCollect({
          product: ele.product,
          isCollect: false,
        })
        if (res) ele.isCollect = true
        ele.selected = false
      }
    })
  }
  // 批量获取购物车商品是否收藏
  const getProductsCollect = () => {
    onShelfList.value.forEach(async(ele) => {
      ele.isCollect = await isFavoriteProduct(ele)
    })
  }
  // 从购物车中删除
  const deleteItem = async(data: Array) => {
    const params = {
      itemId: data.map(item => item.itemId).join(','),
    }
    const res = await shoppingBag.cartRemoveItem(params)
    if (res.isSuccess) {
      await getShoppingList()
      cartItemEditShow.value = false
    }
    return res
  }
  // 编辑购物袋商品
  const carItemEdit = async(item, index, isCollect = false) => {
    selectEditItem.value = item
    selectEditItemIndex.value = index
    cartItemEditShow.value = true
    if (!isCollect) return
    // 获取商品是否收藏
    item.isCollect = await isFavoriteProduct(item)
  }
  return {
    cartList,
    onShelfList,
    offShelfList,
    cartItemEditShow,
    selectEditItem,
    selectEditItemIndex,
    carItemEdit,
    getShoppingList,
    toggleCollect,
    deleteItem,
    isFavoriteProduct,
    addCollectionSelect,
    getProductsCollect,
  }
}
