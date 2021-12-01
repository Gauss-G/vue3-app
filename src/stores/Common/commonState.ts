import { CommonState } from '@/typings/commonTypings'

const state: Function = (): CommonState => ({
  title: '商品比较',
  deviceMobile: false,
  hasLoggedIn: false,
  hideNavigation: false,
  pageLoading: false,
})

export default state
