import { CartState } from '@/typings/commonTypings'

const getters: {[key: string]: Function} = {
  cartList: (state: CartState) => state.cartList,
  cartQuantity: (state: CartState) => state.cartQuantity,
}

export default getters
