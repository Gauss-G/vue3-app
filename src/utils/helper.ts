import globalConsts from '@/config/globalConsts'
// 判断参数是否是其中之一
export function oneOf(value, validList) {
  for (let i = 0; i < validList.length; i++) {
    if (value === validList[i])
      return true
  }
  return false
}
/**
 * 防抖
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait: number, immediate = false) {
  let timeout, params, context, timestamp, result
  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp
    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    }
    else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, params)
        if (!timeout) context = params = null
      }
    }
  }
  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    params = args
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }
    return result
  }
}
/**
 * 拷贝
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object')
    throw new Error('error arguments', 'deepClone')

  if (source === null)
    return undefined

  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach((keys) => {
    if (source[keys] && typeof source[keys] === 'object')
      targetObj[keys] = deepClone(source[keys])
    else
      targetObj[keys] = source[keys]
  })
  return targetObj
}

// 支持设置时间的缓存操作
export const _local = {
  // 存储,可设置过期时间
  set(key, value, expires) {
    const params = {
      key,
      value,
      expires,
    }
    if (expires) {
      // 记录何时将值存入缓存，毫秒级
      const data = Object.assign(params, {
        startTime: new Date().getTime(),
      })
      localStorage.setItem(key, JSON.stringify(data))
    }
    else {
      if (Object.prototype.toString.call(value) === '[object Object]')
        value = JSON.stringify(value)

      if (Object.prototype.toString.call(value) === '[object Array]')
        value = JSON.stringify(value)

      localStorage.setItem(key, value)
    }
  },
  // 取出
  get(key, ignoreTime) {
    let item = localStorage.getItem(key)
    // 先将拿到的试着进行json转为对象的形式
    try {
      item = JSON.parse(item)
    }
    catch (error) {
      // eslint-disable-next-line no-console
      console.warn('failed to parse json', item, error)
      localStorage.removeItem(key)
      return item || ''
    }
    // 如果有startTime的值，说明设置了失效时间
    if (item && item.startTime && !ignoreTime) {
      const date = new Date().getTime()
      // 如果大于就是过期了，如果小于或等于就还没过期
      if (date - item.startTime > item.expires) {
        localStorage.removeItem(key)
        return false
      }
      else {
        return item.value
      }
    }
    else {
      if (item)
        return item.value ? item.value : item

      return ''
    }
  },
  // 删除
  remove(key) {
    localStorage.removeItem(key)
  },
  // 删除相关字符串的缓存
  removeList(str) {
    for (const i in localStorage) {
      if (i.includes(str))
        localStorage.removeItem(i)
    }
  },
  // 清除全部
  clear() {
    localStorage.clear()
  },
}

export function flatCategoriesToObject(allCategories) {
  if (!allCategories || allCategories.constructor !== Array)
    return {}

  const recursiveFlatCategories = (flatResult, categories) => {
    categories.forEach((category) => {
      flatResult[category.id] = category

      if (category.subCategories)
        recursiveFlatCategories(flatResult, category.subCategories)
    })
  }

  const flatResult = allCategories.reduce((prev, category) => {
    prev[category.id] = category
    if (category.subCategories)
      recursiveFlatCategories(prev, category.subCategories)

    return prev
  }, {})

  return flatResult
}

// 时间格式化
export function dateFormat(fmt, date) {
  let ret
  const opt = {
    'y+': date.getFullYear().toString(), // 年
    'm+': (date.getMonth() + 1).toString(), // 月
    'd+': date.getDate().toString(), // 日
    'H+': date.getHours().toString(), // 时
    'M+': date.getMinutes().toString(), // 分
    'S+': date.getSeconds().toString(), // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  }
  for (const k in opt) {
    ret = new RegExp(`(${k})`).exec(fmt)
    if (ret)
      fmt = fmt.replace(ret[1], ret[1].length === 1 ? opt[k] : opt[k].padStart(ret[1].length, '0'))
  }
  return fmt
}
// 计算对象数组中某个属性合计
export function countTotal(arr, keyName) {
  let num = 0
  num = arr.reduce((total, currentValue) => {
    return currentValue[keyName] ? total + currentValue[keyName] : total
  }, 0)
  return num
}

export function getImgUrlByPath(path) {
  return globalConsts.ImgUrlHost + path
}
// 格式化价格
export function formatPrice(s, n) {
  n = n > 0 && n <= 20 ? n : 2
  /* eslint-disable no-useless-escape */
  s = `${parseFloat((`${s}`).replace(/[^\d\.-]/g, '')).toFixed(n)}`
  const l = s.split('.')[0].split('').reverse()
  const r = s.split('.')[1]
  let t = ''
  for (let i = 0; i < l.length; i++)
    t += l[i] + ((i + 1) % 3 === 0 && i + 1 !== l.length ? ',' : '')

  return `${t.split('').reverse().join('')}.${r}`
}
// 判断设备是不是h5
export function deviceMobile() {
  if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent))
    return true
  else if (window.innerWidth <= 900)
    return true
  else
    return false
}
