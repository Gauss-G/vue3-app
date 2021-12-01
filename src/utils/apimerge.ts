import { debounce, deepClone } from '@/utils/helper'

let paremsAll = null
let queue = [] // promise队列
let duration = 500
const next = debounce(async(api) => {
  const res = await api(paremsAll)
  queue.forEach(resolve => resolve(res))
  queue = []
  paremsAll = null
}, duration)
/**
 * api合并---针对类似库存的api处理
 * api: 当前请求函数
 * params: 参数
 * field : 需要合并的字段 除此之外的字段不一样则不合并
 * time 多少毫秒以内的请求进行合并
 */
export function mergeApi(api, params, field, time) {
  if (time)
    duration = time
  let aBath = true
  if (paremsAll) {
    for (const m in params) {
      if (m !== field && JSON.stringify(params[m]) !== JSON.stringify(paremsAll[m]))
        aBath = false
    }
    if (aBath)
      paremsAll[field] = paremsAll[field].concat(params[field])
  }
  else { paremsAll = params ? deepClone(params) : '' }
  if (aBath) {
    next(api)
    return new Promise((resolve) => {
      queue.push((data) => {
        resolve(data)
      })
    })
  }
  else {
    queue = []
    paremsAll = null
    return api(params)
  }
}
