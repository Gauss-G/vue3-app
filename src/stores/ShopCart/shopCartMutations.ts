import * as types from './shopCartTypes'
import { CartState } from '@/typings/commonTypings'

const mutations: {[key: string]: Function} = {
  /**
   * @param  {CartState} state
   * @param  {any} response
   */
  [types.SET_CART_LIST]: async(state: CartState, response: any) => {
    state.cartList = response.items
    state.cartQuantity = response.count
  },
}

export default mutations
