import { CommonState } from '@/typings/commonTypings'

const getters: {[key: string]: Function} = {
  deviceMobile: (state: CommonState) => state.deviceMobile,
  hasLoggedIn: (state: CommonState) => state.hasLoggedIn,
  hideNavigation: (state: CommonState) => state.hideNavigation,
  pageLoading: (state: CommonState) => state.pageLoading,
}

export default getters
