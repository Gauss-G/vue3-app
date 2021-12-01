import { load } from '@fingerprintjs/fingerprintjs'
import { ABTest } from '@/api/config'
const ABTEST_CONFIG_CACHE_KEY = 'abTestConfig'

export const ABTEST_CONFIG_KEY = {
  THREE_D_SCENE: '3d_scene',
  AUTO_PLAY_STATUS: 'autoPlayStatus',
  PRODUCT_REVIEW: 'product-reviews',
  ADDON_PRODUCT_ACTIVITY: 'addon-product-activity',
  SURVEY: 'survey',
  PAX_PLP_PIP_AD: 'pax_plp_pip_ad', // 是否显示pax
  PLUS_PURCHASE: 'plus_purchase',
  BESTA_PLP_PIP_AD: 'besta_plp_pip_ad',
  BUNDLE: 'bundle',
  IB_IRW_PIP: 'ib_irw_pip',
}

export const abtestConfig = {}
export const loadABTestConfig = async() => {
  try {
    // 检查用户浏览器中是否存在ABTest 配置缓存
    const configCache = sessionStorage && sessionStorage.getItem(ABTEST_CONFIG_CACHE_KEY)
    if (configCache && Object.keys(JSON.parse(configCache)).length > 0) {
      abtestConfig.value = JSON.parse(configCache)
      return abtestConfig.value
    }
    else {
      const fp = await load()
      const visitorId = (await fp.get()).visitorId
      const result = await ABTest.getABTestConfig(visitorId)
      abtestConfig.value = result.isSuccess ? result.data : {}
      if (abtestConfig.value) {
        localStorage && localStorage.setItem('deviceId', visitorId)
        sessionStorage && sessionStorage.setItem(ABTEST_CONFIG_CACHE_KEY, JSON.stringify(abtestConfig.value))
        // 添加访问
      }
      else {
        abtestConfig.value = {}
      }
    }

    return abtestConfig.value
  }
  catch (e) {
    // 兼容异常情况无法获取AB Test配置，默认全部关闭
    abtestConfig.value = {}
    return abtestConfig.value
  }
}
export const getABTestConfigByKey = async(key) => {
  const abtestConfig = await loadABTestConfig()
  return abtestConfig[key]
}
