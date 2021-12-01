export interface CommonState {
  title: string
  deviceMobile: boolean
  hasLoggedIn: boolean
  hideNavigation: boolean
  pageLoading: boolean
}

export interface CartState {
  cartQuantity: number
  cartList: any[]
}
