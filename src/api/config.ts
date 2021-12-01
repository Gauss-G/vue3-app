import adapter from '@ikeacn/adapter'
import axios from 'axios'
import Cookies from 'js-cookie'
import store from '@/store'
import locales from '@/locales'

/**
 * 默认语言中文
 */
const DEFAULT_LANG = locales.global.locale.value || 'zh'

const defaultHeader = {
  'Source': 'NEW_WEB',
  'X-Client-Platform': 'PcWeb',
  'X-Client-Version': '2.11.0',
  'X-Client-Channel': 'WEB',
  'X-Client-DeviceId': localStorage?.getItem('deviceId') || '',
  'Accept-Language': DEFAULT_LANG === 'en' ? 'en-US' : 'zh',
}

const REQUEST_DELEGATE = axios.create({
  timeout: 30000,
  headers: defaultHeader,
})
REQUEST_DELEGATE.getTopDomainName = () => {
  const topLevelDomain = import.meta.env.VITE_TOP_LEVEL_DOMAIN
  const hostInTopLevelDomain = window.location.hostname.endsWith(topLevelDomain)
  const domainRex = /(\w*[-_]\w*\.?){1}\.(com.cn|net.cn|gov.cn|org.nz|org.cn|com|net|org|gov|cc|biz|info|cn|co)$/
  const currentHostDomain = domainRex.exec(window.location.hostname)
    ? `.${domainRex.exec(window.location.hostname)[0]}`
    : window.location.hostname

  return hostInTopLevelDomain ? topLevelDomain : currentHostDomain
}
REQUEST_DELEGATE.interceptors.request.use((config) => {
  if (Cookies.get('accessToken'))
    config.headers.Authorization = `Bearer ${Cookies.get('accessToken')}`

  return config
}, (error) => {
  return Promise.reject(error)
})
REQUEST_DELEGATE.interceptors.response.use((Response) => {
  return Response
}, (error) => {
  if (error.response.status === 401 || error.response.status === '401') { // 登陆过期需要登陆
    store.dispatch('Common/LOGOUT')
  }
  return Promise.reject(error)
})
// 是不是开发模式
const DEV = import.meta.env.DEV
const API_HOST = DEV ? '/api-host' : import.meta.env.VITE_API_HOST
const API_CSH = DEV ? '/api-csh' : import.meta.env.VITE_API_CSH
const API_SEARCH = DEV ? '/api-search' : import.meta.env.VITE_API_SEARCH
const API_CIAM = DEV ? '/api-ciam-host' : import.meta.env.VITE_LOGIN_HOST
const search = adapter.search({
  lang: DEFAULT_LANG,
  requestDelegate: REQUEST_DELEGATE,
  defaultHeader,
  domain: API_SEARCH,
})
const csh = adapter.csh({
  lang: DEFAULT_LANG,
  requestDelegate: REQUEST_DELEGATE,
  defaultHeader,
  domain: API_CSH,
})

const checkout = adapter.checkout({
  lang: DEFAULT_LANG,
  requestDelegate: REQUEST_DELEGATE,
  defaultHeader,
  domain: API_HOST,
})
const product = adapter.product({
  lang: DEFAULT_LANG,
  requestDelegate: REQUEST_DELEGATE,
  defaultHeader,
  domain: API_HOST,
})
const common = adapter.common({
  lang: DEFAULT_LANG,
  requestDelegate: REQUEST_DELEGATE,
  defaultHeader,
  domain: API_HOST,
})

const profile = adapter.profile({
  lang: DEFAULT_LANG,
  requestDelegate: REQUEST_DELEGATE,
  defaultHeader,
  domain: API_HOST,
})
const shoppingBag = adapter.shoppingBag({
  lang: DEFAULT_LANG,
  requestDelegate: REQUEST_DELEGATE,
  defaultHeader,
  domain: API_HOST,
})
const content = adapter.content({
  lang: DEFAULT_LANG,
  requestDelegate: REQUEST_DELEGATE,
  defaultHeader,
  domain: API_HOST,
})

const ABTest = adapter.abtest({
  lang: DEFAULT_LANG,
  requestDelegate: REQUEST_DELEGATE,
  defaultHeader,
  domain: API_HOST,
})
const activity = adapter.activity({
  lang: DEFAULT_LANG,
  requestDelegate: REQUEST_DELEGATE,
  defaultHeader,
  domain: API_HOST,
})
const category = adapter.category({
  lang: DEFAULT_LANG,
  requestDelegate: REQUEST_DELEGATE,
  defaultHeader,
  domain: API_HOST,
})
const cms = adapter.cms({
  lang: DEFAULT_LANG,
  requestDelegate: REQUEST_DELEGATE,
  defaultHeader,
  domain: API_HOST,
})
const ciam = adapter.ciam({
  lang: DEFAULT_LANG,
  requestDelegate: REQUEST_DELEGATE,
  defaultHeader,
  domain: API_CIAM,
})
const reviewList: any = adapter.review({
  lang: 'zh',
  requestDelegate: REQUEST_DELEGATE,
  defaultHeader,
  domain: API_HOST,
})
export {
  ABTest,
  checkout,
  product,
  common,
  csh,
  search,
  content,
  shoppingBag,
  profile,
  activity,
  category,
  cms,
  ciam,
  reviewList,
}
