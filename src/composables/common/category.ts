import { category } from '@/api/config'
import { _local } from '@/utils/helper.ts'

// 类目相关
export default function categoryControl(lang) {
  const getCatalogsAll = async() => {
    const storageList = _local.get(`categoryList${lang}`)
    if (storageList && storageList.length > 0)
      return storageList

    const res = await category.getCatalogsAll(lang)
    if (res.isSuccess) {
      _local.set(`categoryList${lang}`, res.data, 60 * 1000 * 30) // 存储半小时缓存
      return res.data
    }
    else {
      return []
    }
  }
  return {
    getCatalogsAll,
  }
}
