import { ref, reactive } from 'vue'
import { deepClone } from '@/utils/helper.ts'
import { common } from '@/api/config'

// 产品库存相关
export default function commonControl() {
  /**
       * 省市区选择列表
       */
  const cityData = ref([])
  /**
       * 用户地址列表
       */
  const addressList = ref([])
  /**
       * 热门城市选项
       */
  const hotSelectList = reactive([{ key: '北京市', name: '北京' },
    { key: '上海市', name: '上海' },
    { key: '广州市', name: '广州' },
    { key: '深圳市', name: '深圳' },
  ])
  /**
     * 用于获取省市区选择列表
     */
  async function getCityData() {
    const localeCityData = window.deliveryCityData // 暂存到windowd对象下
    if (localeCityData && localeCityData.length > 0)
      return cityData.value = localeCityData
    const result = await common.getCityData()
    if (result.isSuccess) {
      window.deliveryCityData = result.data
      cityData.value = result.data
    }
  }
  /**
     * 用于用户地址列表
     */
  async function getAddressList() {
    const result = await common.deliveryAddressList()
    if (result.isSuccess) {
      addressList.value = result.data
      return result.data
    }
    else {
      return []
    }
  }
  /**
     * 根据传参生成省市区地址数据
     * level 1-只取一层 2-取2层
     * ishot 开启热门城市选项设置
     */
  function generateCityDatabyLevel(level, ishot) {
    const hotSList = hotSelectList
    const treefilter = function(list, rank) {
      rank += 1
      list.forEach((x) => {
        if (ishot) {
          const index = hotSList.findIndex(hot => hot.key === x.name)
          if (index >= 0 && (x.children.length > 1 || x.children.lengtt === 0)) {
            x.ishot = true
            x.hotName = hotSList[index].name
          }
        }
        if (level > rank)
          treefilter(x.children, rank)
        else
          x.children = []
      })
      return list
    }
    return treefilter(deepClone(cityData.value), 0)
  }
  return {
    cityData,
    addressList,
    hotSelectList,
    getCityData,
    getAddressList,
    generateCityDatabyLevel,
  }
}
