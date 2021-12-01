// import { ref } from 'vue'
import { shoppingBag } from '@/api/config'

// 添加购物袋商品
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const addShoippingCartByProducts = async(products: Array, dataTrackId = null, gioExtendedAttributes: any) => {
  let response = { isSuccess: false }
  if (products.length <= 0) return response
  const list = [...products]
  const params = []
  list.forEach((item) => {
    let itemId = ''
    if (item.itemType === 'SPR')
      itemId = `s${item.id}`
    else
      itemId = item.id

    if (item.onlineSalable) {
      params.push({
        productFullId: itemId,
        quantity: item.quantity || 1,
      })
    }
  })
  if (params.length !== list.length)
    return response

  const res = await shoppingBag.addShoppingCart({
    products: params,
  })
  response = res
  // if (res.isSuccess) {
  //   response = res
  //   // GIO
  //   this.$gio.trackAddToCart(
  //     {
  //       trackId: dataTrackId || this.dataTrackId,
  //     },
  //     {
  //       ...gioExtendedAttributes,
  //     },
  //   )
  //   products.forEach((item) => {
  //     this.addCartGio(item)
  //   })
  // }
  // else {
  //   if (res.err && res.err.data)
  //     this.toasted.show(res.err.data.message)
  //   else
  //     this.toasted.show(this.t('detail.failed_to_add_to_cart'))

  //   gtag('event', 'add_to_cart', {
  //     event_label: res.err.data?.message || this.t('detail.failed_to_add_to_cart'),
  //     event_category: 'error',
  //     currency: 'cny',
  //     non_interaction: false,
  //     transport_type: '',
  //   })
  // }
  return response
}
