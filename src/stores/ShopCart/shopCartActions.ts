import * as types from './shopCartTypes'
import { shoppingBag } from '@/api/config'

const actions: {[key: string]: Function} = {
  /**
   * @param  {{commit:Function}} {commit}
   * @param  {any} response
   */
  [types.SET_CART_LIST]: async({ commit }: { commit: Function }) => {
    let count = 0
    const items = []
    try {
      const res: any = await shoppingBag.getShoppingCart({})
      if (res.isSuccess && res.data) {
        const { items = [] } = res.data
        items.forEach((element) => {
          count += element.quantity
        })
      }
    }
    catch (err) {}

    commit(types.SET_CART_LIST, {
      list: items,
      count,
    })
  },
}

export default actions
