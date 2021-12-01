<template>
  <div
    class="header-message"
    :class="{ 'pc-header-message':!isH5 }"
    :style="{ backgroundColor : notification.bgColor, color: notification.textColor || '#fff' }"
  >
    <div v-if="show" class="header-message-inner__wrapper">
      <div
        v-if="notification && notification.appPromotion && notification.appPromotion.isShow && !isH5"
        class="app-promotion-container"
      >
        <AppPromotion class="app-promotion" :desc-data="notification.appPromotion" />
      </div>
      <NoticeMessage :notifications="notification.content" :text-color="notification.textColor" />
      <div v-if="notification && notification.language && notification.language.isShow && !isH5" class="language-switch-container">
        <LanguageSwitch />
      </div>
    </div>
    <div class="header-message__close" :style="{ color: notification.textColor }" @click="closeHeaderMessage" />
  </div>
</template>
<script lang="ts" setup>
import { ref, defineProps, defineEmits, computed, onMounted, watch } from 'vue'
import IIcon from 'atoms/IIcon/IIcon.vue'
import base from 'composables/base'
import LanguageSwitch from './LanguageSwitch.vue'
import AppPromotion from './AppPromotion.vue'
import NoticeMessage from './NoticeMessage.vue'
import { cms } from '@/api/config'

const { locale, isH5 } = base()
const props = defineProps({
  isShowHeaderMessage: {
    type: Boolean,
    default: true,
  },
  // 具体展示的页面：homepage,shoppingBag,default
  headerMessageShownPage: {
    type: String,
    default: 'default',
    required: true,
  },
})
const DS_HEADER_DATA_ID = import.meta.env.VITE_DS_HEADER_DATA_ID
const lang = locale.value
const emits = defineEmits(['onChange'])
const source = ref<any>({})
const notification = ref<any>({
  bgColor: '#111111',
  textColor: '#fff',
  content: [],
})
const isShow = ref(true)

const show = computed(() => {
  let _show = !!(isShow.value && props.isShowHeaderMessage && notification.value)
  if (isH5.value && notification.value.content && notification.value.content.length === 0)
    _show = false

  emits('onChange', _show)
  return _show
})

const haddleNotice = (navData) => {
  const noticeContent: any[] = []
  let notice
  if (navData?.notification && isH5.value) {
    notice = navData.notification[props.headerMessageShownPage]?.content?.length
      ? navData.notification[props.headerMessageShownPage]
      : navData.notification?.default
  }
  else {
    notice = {
      ...navData,
      content: navData.notification,
    }
  }
  notice?.content?.forEach((con) => {
    if (con.isShow) {
      const start = con.startTime ? new Date(con.startTime.replace(/\-/g, '/')).getTime() : ''
      const end = con.endTime ? new Date(con.endTime.replace(/\-/g, '/')).getTime() : ''
      const now = new Date().getTime()
      con.link = con.url || ''
      if (start && end)
        con.isShow = start < now && now < end

      else if (start && !end)
        con.isShow = start < now

      else if (!start && end)
        con.isShow = now < end

      else
        con.isShow = true
    }
    if (con.isShow)
      noticeContent.push(con)
  })
  notification.value = { ...notification.value, ...notice, content: noticeContent }
}
const closeHeaderMessage = () => {
  isShow.value = false
  sessionStorage.setItem('isNeedHideHeaderMessage', 'true') // 设置true,隐藏header message
  emits('onChange', false)
}

watch(() => source.value, (val) => {
  const isNeedShow = sessionStorage.getItem('isNeedHideHeaderMessage')
  if (!isNeedShow)
    haddleNotice(val)
  else
    isShow.value = false
})

onMounted(async() => {
  const isNeedShow = sessionStorage.getItem('isNeedHideHeaderMessage')
  const headerMessageSession = sessionStorage.getItem('headerMessageSessionSPA')
  let resJSON: any = {}
  if (!isNeedShow) {
    if (headerMessageSession) {
      resJSON = JSON.parse(headerMessageSession)[lang]
    }
    else {
      const res: any = await cms.getDataSourceById(DS_HEADER_DATA_ID, 'zh', {
        'Accept-Language': 'zh',
      })
      if (res.isSuccess) {
        try {
          const parsedData = JSON.parse(res.data.content)
          resJSON = parsedData[lang]
        }
        catch (err) {}
        sessionStorage.setItem('headerMessageSessionSPA', res.data.content)
      }
    }
    if (isH5.value)
      source.value = resJSON?.h5 || {}
    else
      source.value = resJSON?.pc?.default || {}
  }

  if (!isNeedShow)
    haddleNotice(source.value)
  else
    isShow.value = false
})

</script>
<style lang="scss" scoped>
.pc-header-message {
  padding: 0 1rem;

  &:hover {
    .header-message__close {
      opacity: 1;
    }
  }

  .header-message-inner__wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    margin: auto;
    min-width: 800px;
    max-width: 1240px;
    position: relative;

    .app-promotion-container {
      left: 0;
      position: absolute;
      height: 100%;
      z-index: 1;
    }

    .language-switch-container {
      right: 0;
      position: absolute;
      height: 100%;
      z-index: 1;
    }

    .header-message-inner {
      // width: 100%;
      .ellipsis {
        max-width: 100%;
      }
    }
  }

  .header-message__close {
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.35s ease;
  }
}

.header-message {
  position: relative;

  &-inner__wrapper {
    // width: 100%;
    height: 0.4rem;
    position: relative;
    transition: margin-top 0.2s linear;
  }

  &__close {
    position: absolute;
    display: block;
    top: 50%;
    right: 0.1rem;
    width: 0.18rem;
    height: 0.18rem;
    transform: translateY(-50%);
    z-index: 10;

    &::before,
    &::after {
      position: absolute;
      top: 50%;
      right: 50%;
      content: '';
      background-color: currentColor;
      width: 1px;
      height: 0.11rem;
    }

    &::before {
      transform: translate(-50%, -50%) rotate(45deg);
    }

    &::after {
      transform: translate(-50%, -50%) rotate(-45deg);
    }
  }
}
</style>
