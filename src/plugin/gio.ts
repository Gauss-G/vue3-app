import ITrack from '@ikeacn/track'
import Cookies from 'js-cookie'
import type { App, Plugin } from 'vue'

const apiHost = import.meta.env.VITE_API_SRV_HOST
const srvToken = import.meta.env.VITE_SRV_TRACK_TOKEN
const gioId = import.meta.env.VITE_GIO_ID

declare global {
  interface Window {
    disableGIOTrack: any
    gio: any
  }
}

const isFunctionalDisabled = () => {
  const savedCookieContent = Cookies.get('ikeacn_cookie_consent')
  if (!savedCookieContent) return false

  return !savedCookieContent.includes('functional')
}

const GioPlugin: Plugin = {
  install: (app: App) => {
    // 获取用户的Cookie配置，如果用户禁用了functional类别的cookie，则设置disableGIOTrack为true
    window.disableGIOTrack = isFunctionalDisabled()
    if (window.disableGIOTrack)
      window.gio = () => {}

    const iTrackConfig = {
      apiHost,
      platform: 'PcWeb',
      channel: 'WEB',
      source: 'NEW_WEB',
      version: '1.7.0',
      token: srvToken,
      sessionDataInUserProperties: [
        {
          key: 'ABTEST_CONFIG',
          valueKeyPrefix: 'abtest',
        },
      ],
    }

    const iTrick: any = new ITrack({
      useITrack: !window.disableGIOTrack,
      platform: window.matchMedia('(display-mode: standalone)').matches ? 'pc-pwa' : 'pc',
      gioConfig: {
        useITrack: !window.disableGIOTrack,
        gioId,
      },
      iTrackConfig,
    })

    // set iTrack
    app.config.globalProperties.$iTrack = iTrick
    app.provide('iTrack', iTrick)
    // set gio
    app.config.globalProperties.$gio = iTrick.gio
    app.provide('gio', iTrick.gio)
    // set window obj
    if (window && window.iTrack)
      window.iTrack.gio = iTrick.gio
  },
}
export default GioPlugin
