import ITrack, { CLICK_TYPE, GIO_EVENT_TYPE, INVENTORY_STATUS } from '@ikeacn/track'
import { inject } from 'vue'
export default function gioHooks() {
  let iTrack: any = inject('iTrack')
  let gio: any = inject('gio')

  const changeDeviceConfig = (device: 'pc' | 'h5', extaConfig = {}) => {
    const isPC = device === 'pc'
    const platform = isPC ? window.matchMedia('(display-mode: standalone)').matches ? 'pc-pwa' : 'pc' : 'h5'
    const trickConfig = {
      platform: isPC ? 'PcWeb' : 'MobileWeb',
      version: isPC ? '1.7.0' : '2.11.0',
      sessionDataInUserProperties: [{
        key: isPC ? 'ABTEST_CONFIG' : 'abTestConfig',
        valueKeyPrefix: 'abtest',
      }],
      ...extaConfig,
    }

    if (iTrack) {
      iTrack = new ITrack({
        useITrack: iTrack.config.useITrack,
        platform,
        gioConfig: {
          ...iTrack.config.gioConfig,
          ...extaConfig,
        },
        iTrackConfig: {
          ...iTrack.config.iTrackConfig,
          ...trickConfig,
        },
      })
      if (window && window) {
        window.iTrack = iTrack.iTrack
        window.iTrack.gio = iTrack.gio
        window.iTrack.debug = true
      }

      gio = iTrack.gio
    }
  }

  return {
    gio,
    changeDeviceConfig,
    iTrack,
    GIO_EVENT_TYPE,
    CLICK_TYPE,
    INVENTORY_STATUS,
  }
}
