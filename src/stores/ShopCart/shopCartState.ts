import { CartState } from '@/typings/commonTypings'

const state: Function = (): CartState => ({
  cartQuantity: 0,
  cartList: [],
})

export default state
