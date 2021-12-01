
// import gioHooks from '@/utils/hooks/gio'
export default function langHooks() {
  // const { gio } = gioHooks()

  const handleSetLanguage = (language: 'en' | 'zh') => {
    localStorage.removeItem('getScrollTopzh')
    localStorage.removeItem('getScrollTopen')
    if (sessionStorage.getItem('localStorageKeyzh'))
      window.sessionStorage.removeItem('localStorageKeyzh')

    if (sessionStorage.getItem('localStorageKeyen'))
      window.sessionStorage.removeItem('localStorageKeyen')

    // Change URL
    const changeLanguage = `cn/${language}`
    const beforeUrl = window.location.href
    const afterUrl = beforeUrl.replace(/\/cn\/\S\S/, `/${changeLanguage}`)
    // gio.trackByEventID('headerLanguageSwitch', { targetLang: language })
    window.location.href = afterUrl
    // // Find whether target url is valid by response head
    // const req = new XMLHttpRequest()
    // req.open('HEAD', afterUrl, false)
    // req.send()
    // if (req.status === 200)
    //   window.location.href = afterUrl
    // else
    //   window.location.href = `/cn/${language}${window.location.search}`
  }

  return {
    handleSetLanguage,
  }
}
