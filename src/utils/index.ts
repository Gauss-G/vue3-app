import routerGuard from './routerGuard'
import globalConsts from '@/config/globalConsts'

// 参数传递url
export function encapsulateUrlQuery(query) {
  const encodeReserveRE = /[!'()*]/g
  const encodeReserveReplacer = c => `%${c.charCodeAt(0).toString(16)}`
  const commaRE = /%2C/g
  const encode = str =>
    encodeURIComponent(str).replace(encodeReserveRE, encodeReserveReplacer).replace(commaRE, ',')

  const params = query
    ? Object.keys(query)
      .map((key) => {
        const val = query[key]

        if (val === undefined)
          return ''

        if (val === null)
          return encode(key)

        if (Array.isArray(val)) {
          const result = []
          val.forEach((val2) => {
            if (val2 === undefined)
              return

            if (val2 === null)
              result.push(encode(key))

            else
              result.push(`${encode(key)}=${encode(val2)}`)
          })
          return result.join('&')
        }

        return `${encode(key)}=${encode(val)}`
      })
      .filter(x => x.length > 0)
      .join('&')
    : null
  return params ? `?${params}` : ''
}
// export function generateLink(link, locale) {
//   const { path, query } = ctx
//   if (path) {
//     const href = path.startsWith('/cn') ? path : `/cn/${locale}${path}`
//     const params = encapsulateUrlQuery(query)
//     return `${href}${params}`
//   }
// }
// 生成跳转链接 .com/cn/lang/
function getQueryVariable(variable) {
  const query = window.location.search.substring(1)
  const vars = query.split('&')
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=')
    if (pair[0] === variable) return pair[1]
  }
  return (false)
}
export function generateLink(path, locale) {
  if (path) {
    if (path.includes('http'))
      return path
    let href = import.meta.env.VITE_LINK_URL || ''
    const url = getQueryVariable('url') || ''
    if (url) href = url
    href += `${path.startsWith('/cn') ? path : `/cn/${locale}${path}`}`
    return `${href}`
  }
  else {
    return ''
  }
}
export {
  routerGuard,
}
export function cmsReplaceUrl(url, locale) {
  const replaceHead = url.includes('www.ikea.cn') || url.includes('www.ikea.com') || url.includes('m2.ikea.cn')
  if (replaceHead) {
    let pushUrl = url.replace(globalConsts.IkeaHost, '')
    pushUrl = pushUrl.replace(globalConsts.IkeaComHost, '')
    pushUrl = pushUrl.replace(globalConsts.IkeaMHost, '')
    return generateLink(pushUrl, locale)
  }
  else {
    return generateLink(url, locale)
  }
}

export function getRegularRule() {
  return {
    phoneReg: /^1[3-9]\d{9}$/,
    // 用户名
    userNameReg: /^[\u4E00-\u9FA5a-zA-Z]+([\u4E00-\u9FA5a-zA-Z\s]{0,30})+[\u4E00-\u9FA5a-zA-Z]$/,
    addressReg: /^[A-Za-z0-9\s\u4E00-\u9FA5-]{1,50}$/,
    chineseRegx: /^[\u4E00-\u9FA5a-zA-Z]+([\u4E00-\u9FA5a-zA-Z\s]{0,30})+[\u4E00-\u9FA5a-zA-Z]$/,
    idCardNumRegx: /^[0-9]{7}[0-9Xx]$/,
    pwdRight:
      /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]{8,20}$/,
    pwdWrong: /([\S])\1{2,}/,
    familyCardNoRegx: /^6275980[0-9]{12}$/,
    email_REGEX:
      /^[^@\\(（）)\[\]【】:：,，!！\s\t]+@[^@.\\(（）)\[\]【】:：,，!！\s\t]+(\.[a-zA-Z\u4E00-\u9FA5]+)+$/,
    email_LENGTH_REGEX: /^.{4,100}$/,
  }
}

export function paramsFormat(url: string) {
  const qInd = url.indexOf('?')
  const sharpInd = url.indexOf('#') // 路由
  let search = ''
  const paramsObj = {}

  function _deal(search, paramsObj) {
    let paramsList: string[] = []
    paramsList = search.split('&')
    for (let ind = 0; ind < paramsList.length; ind++) {
      const param: string = paramsList[ind]
      if (param) {
        const pind = param.indexOf('=')
        if (pind >= 0) {
          const key = param.substring(0, pind)
          let value: string | null = param.substr(pind + 1)
          if (value === 'undefined' || value === 'null') value = null // 过滤字符串，否则接口报错
          paramsObj[key] = value
        }
        else {
          paramsObj[param] = ''
        }
      }
    }
  }

  if (qInd >= 0) {
    if (sharpInd > 0)
      search = url.substring(qInd + 1, sharpInd)
    else
      search = url.substring(qInd + 1)
    // from跳转链接，不需要解析其他参数
    const reg = /\?(from(?:url)?)=(.*\.html)/i
    if (reg.test(search)) {
      const matches: any = search.match(reg)
      paramsObj[matches[1]] = matches[2]
    }
    else {
      _deal(search, paramsObj)
    }
  }
  return paramsObj
}
