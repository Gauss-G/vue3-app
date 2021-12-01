import * as types from './commonTypes'
import { CommonState } from '@/typings/commonTypings'

const mutations: {[key: string]: Function} = {
  /**
   * @param  {CommonState} state
   * @param  {string} response
   */
  [types.SET_TITLE]: (state: CommonState, response: string) => {
    document.title = response
    state.title = response
  },
  /**
   * @param  {CommonState} state
   * @param  {boolean} response
   */
  [types.SET_DEVICEMOBILE]: (state: CommonState, response: boolean) => {
    state.deviceMobile = response
  },
  /**
   * @param  {CommonState} state
   * @param  {boolean} response
   */
  [types.SET_HASLOGGEDIN]: (state: CommonState, response: boolean) => {
    state.hasLoggedIn = response
  },
  /**
   * @param  {CommonState} state
   * @param  {boolean} response
   */
  [types.SET_HIDE_NAVIGATION]: (state: CommonState, response: boolean) => {
    state.hideNavigation = response
  },
  /**
     * @param  {CommonState} state
     * @param  {boolean} response
     */
  [types.SET_PAGE_LOADING]: (state: CommonState, response: boolean) => {
    state.pageLoading = response
  },
}

export default mutations
