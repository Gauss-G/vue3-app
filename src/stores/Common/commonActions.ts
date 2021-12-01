import Cookies from 'js-cookie'
import * as types from './commonTypes'
import { deviceMobile } from '@/utils/helper'

const actions: {[key: string]: Function} = {
  /**
   * @param  {{commit:Function}} {commit}
   * @param  {string} response
   */
  [types.SET_TITLE]: ({ commit }: { commit: Function }, response: string) => {
    commit(types.SET_TITLE, response)
  },
  /**
   * @param  {{commit:Function}} {commit}
   * @param  {boolean} response
   */
  [types.SET_DEVICEMOBILE]: ({ commit }: { commit: Function }) => {
    commit(types.SET_DEVICEMOBILE, deviceMobile())
  },
  /**
   * @param  {{commit:Function}} {commit}
   * @param  {boolean} response
   */
  [types.SET_HASLOGGEDIN]: ({ commit }: { commit: Function }) => {
    const hasLoggedIn = Cookies.get('accessToken') || localStorage.getItem('refreshToken')
    commit(types.SET_HASLOGGEDIN, !!hasLoggedIn)
  },
  /**
   * @param  {{commit:Function}} {commit}
   * @param  {boolean} response
   */
  [types.SET_HIDE_NAVIGATION]: ({ commit }: { commit: Function }, response) => {
    commit(types.SET_HIDE_NAVIGATION, response)
  },
  /**
   * @param  {{commit:Function}} {commit}
   * @param  {boolean} response
   */
  [types.SET_PAGE_LOADING]: ({ commit }: { commit: Function }, response) => {
    commit(types.SET_PAGE_LOADING, response)
  },
  /**
   * @param  {{commit:Function}} {commit}
   * @param  {boolean} response
   */
  LOGOUT: ({ commit }: { commit: Function }) => {
    // const hasLoggedIn = Cookies.get('accessToken') || localStorage.getItem('refreshToken')
    const topLevelDomain = import.meta.env.VITE_TOP_LEVEL_DOMAIN
    const hostInTopLevelDomain = window.location.hostname.endsWith(topLevelDomain)
    const domainRex
            = /(\w*[-_]\w*\.?){1}\.(com.cn|net.cn|gov.cn|org.nz|org.cn|com|net|org|gov|cc|biz|info|cn|co)$/
    const currentHostDomain = domainRex.exec(window.location.hostname)
      ? `.${domainRex.exec(window.location.hostname)[0]}`
      : window.location.hostname
    const cookieDomain = hostInTopLevelDomain ? topLevelDomain : currentHostDomain

    Cookies.set('accessToken', '', { domain: cookieDomain, path: '/', expires: new Date(0) })
    Cookies.set('refreshToken', '', { domain: cookieDomain, path: '/', expires: new Date(0) })
    Cookies.set('personalized', true)
    window?.localStorage.removeItem('refreshToken')
    commit(types.SET_HASLOGGEDIN, false)
  },
}

export default actions
