<template>
  <div class="footer_container_bg">
    <div class="footer_box">
      <div class="footer_container">
        <!-- 底部的上边 -->
        <ul class="footer_container_top">
          <li class="footer_container_top1">
            <p class="title">
              {{ t('footer.join_club') }}
            </p>
            <p class="text">
              {{ t('footer.club_tips')
              }}<a data-track-id="join-ikea-family.0" :href="urlPath(footerUrl[footerUrlData.see_more])">{{
                t('footer.see_more')
              }}</a>
            </p>
            <a class="join-btn" data-track-id="join-ikea-family.1" @click="goAdd">
              {{ t('footer.opt_in') }}
            </a>
          </li>
          <li class="footer_container_top2">
            <ul>
              <li class="footer_container_topUl_li">
                <dl>
                  <dt>{{ usefulLinks.title }}</dt>
                  <dd v-for="(item, index) in usefulLinks.set" :key="index">
                    <a :data-track-id="'footer.0.' + index" :data-track-label="item.title" :href="urlPath(item.link)">{{
                      item.title
                    }}</a>
                  </dd>
                </dl>
              </li>
              <li class="footer_container_topUl_li">
                <dl>
                  <dt>{{ customerService.title }}</dt>
                  <dd v-for="(item, index) in customerService.set" :key="index">
                    <a :data-track-id="'footer.1.' + index" :data-track-label="item.title" :href="urlPath(item.link)">{{
                      item.title
                    }}</a>
                  </dd>
                </dl>
              </li>
              <li class="footer_container_topUl_li">
                <dl>
                  <dt>{{ aboutUs.title }}</dt>
                  <dd v-for="(item, index) in aboutUs.set" :key="index">
                    <a :data-track-id="'footer.2.' + index" :data-track-label="item.title" :href="urlPath(item.link)">{{
                      item.title
                    }}</a>
                  </dd>
                </dl>
              </li>
              <li class="footer_container_topUl_li">
                <dl>
                  <dt>{{ t('footer.ikea_news') }}</dt>
                  <dd v-for="(item, index) in IKEANews.set" :key="index">
                    <a :data-track-id="'footer.3.' + index" :data-track-label="item.title" :href="urlPath(item.link)">{{
                      item.title
                    }}</a>
                  </dd>
                </dl>
              </li>
            </ul>
          </li>
        </ul>
        <!-- 底部的下边 -->
        <div class="footer_container_bottom">
          <div class="footer_container_bottom_topImg">
            <a :href="urlPath(footerUrl[footerUrlData.wechatUrl])" target="_blank" class="hover">
              <img
                v-lazy="getImgUrlByPath('/images/footerImages/weChat.svg')"
                width="22px"
                height="22px"
                alt="wechat"
              />
            </a>
            <a class="hover" :href="urlPath(globalConsts.microBlogUrl)" rel="noopener" target="_blank" aria-label="weibo">
              <img
                v-lazy="getImgUrlByPath('/images/footerImages/sina.svg')"
                width="23px"
                height="18px"
                alt="sina"
              />
            </a>
            <a class="hover" :href="urlPath(globalConsts.youKuUrl)" rel="noopener" target="_blank" aria-label="youku">
              <img
                v-lazy="getImgUrlByPath('/images/footerImages/jiantou.svg')"
                width="20px"
                height="22px"
                alt="youku"
              />
            </a>
            <div class="lang-selector-container">
              <select
                ref="footLangSelecter"
                class="lang-selector"
                aria-label="langeuage-switch"
                @change="setLanguage"
              >
                <option value="zh" :selected="locale == 'zh'">
                  {{ t('links.chinese') }}
                </option>
                <option value="en" :selected="locale == 'en'">
                  {{ t('links.english') }}
                </option>
              </select>
              <span>></span>
            </div>
          </div>
          <div class="footer_container_bottom_topText">
            <p class="footer_container_bottom_topText_left">
              <!-- {{ t('footer.inter_ikea') }} -->
              {{ t('footer.inter_ikea') + ' 1999-' + new Date().getFullYear() }}
            </p>
            <p class="footer_container_bottom_topText_right">
              <template v-for="(item, index) in bottomList" :key="item.title">
                <a :href="urlPath(item.link)">{{ item.title }}</a>{{ bottomList.length - 1 > index ? ' | ' : '' }}
              </template>
              | <a @click="showCookiesSetting">{{ t('links.cookies_setting') }}</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// import { getCmsUrl } from '~/api/index'
// import { getProfile } from '~/api/login.js'
// import globalConsts from '~/config/globalConsts'
// import { createMetadataAdapter } from '~/adapter/metadata'
// import { memberService } from '~/mixins/business/memberService'

import { ref, defineEmits, onMounted, computed, onUnmounted } from 'vue'
import base from 'composables/base'
import cmsConfig from '@/config/cmsConfig'
import { cms, content, ciam } from '@/api/config'
import globalConsts from '@/config/globalConsts'
import { getImgUrlByPath, debounce } from '@/utils/helper'
import { generateLink } from '@/utils/index'
import langHooks from '@/utils/hooks/lang'
import gioHooks from '@/utils/hooks/gio'
const { gio } = gioHooks()
const { handleSetLanguage } = langHooks()

const { locale, t, $store } = base()
const isLogin = computed(() => {
  return $store.getters['Common/hasLoggedIn']
})
const footerUrl = ref({})
const footerUrlData = ref({})
const usefulLinks = ref([])// 常用链接
const customerService = ref([]) // 客户服务
const aboutUs = ref([]) // 关于我们
const IKEANews = ref([]) // 宜家新闻
const bottomList = ref([])
// const globalConsts
let footerCookie = 0
let swedishFoodHouse = {}
let furnitureApp = {}
let joinLink = '/profile/login' // default login page

const foodUrl = computed(() => {
  let url
  if (locale.value === 'zh')
    url = '/cn/zh/cat/rui-dian-mei-shi-wu-fb001/'
  else if (locale.value === 'en')
    url = '/cn/en/cat/food-beverages-fb001/'
  return generateLink(url)
})
const urlPath = (url) => {
  if (!url?.includes('http'))
    return generateLink(url, locale.value)
  else
    return url
}
const showCookiesSetting = () => {
  gio.trackCookieSettingClickEvent({ position: 'footer' })
  // window.$CookieConsent && window.$CookieConsent.showSettings()
}
const goAdd = async() => {
  const isFAM = localStorage.getItem('isFAM')
  let url = generateLink('/ikea-family', locale.value)
  if (isLogin.value) {
    if (isFAM !== 1 && isFAM !== '1') {
      // 由于CIAM返回的token解析后的familyId为null，无法判断是否为会员，需要获取会员信息来判断是否会员isFAM
      try {
        const userProfile = await ciam.getProfile()
        if (userProfile.data?.customer?.familyProfile) {
          localStorage.setItem('isFAM', 1)
        }
        else {
          localStorage.setItem('isFAM', 0)
          // this.goMemberRegisterPage()
          sessionStorage.setItem('source_page_member_register', '/pay/cat')
          url = generateLink('/profile/new-member-quick-step/', locale.value)
        }
      }
      catch (e) {
      }
    }
  }
  else {
    url = generateLink('/profile/login', locale.value)
  }
  window.location.href = url
}
const getFooterUrl = async() => {
  const footerUrlConfig = cmsConfig.FOOTER_URL_CONFIG[locale.value]
  const footerArr = Object.keys(footerUrlConfig)
  const ids = []
  footerArr.forEach((item) => {
    ids.push(footerUrlConfig[item])
  })
  const res = await content.getCmsUrl(ids, locale)
  const urlJSON = res.data || {}
  Object.keys(urlJSON).forEach((item) => {
    urlJSON[item] = urlJSON[item].replace(globalConsts.IkeaHost, '')
  })
  footerUrl.value = urlJSON
}
const closeCookie = () => {
  localStorage.setItem('footerCookie', 0)
  footerCookie = 0
}
const handleClickEvent = (event) => {
  const isFootCookieContainer = (parentNode) => {
    if (!parentNode) return false

    if (parentNode.id === 'footer-cookie')
      return true

    else
      return isFootCookieContainer(parentNode.parentNode)
  }

  if (!isFootCookieContainer(event.target.parentNode))
    closeCookie()
}
const scrollCloseCookie = debounce(() => {
  const fullHeight = document.documentElement.clientHeight || document.body.clientHeight
  const scrollScreenCount = 3 // 向下滚动屏幕数量为三屏
  if (window.scrollY > scrollScreenCount * fullHeight) {
    closeCookie()
    window.removeEventListener('scroll', scrollCloseCookie)
  }
}, 500)
const setLanguage = (e) => {
  handleSetLanguage(e.target.value)
}
onMounted(async() => {
  const dataSourceId = locale.value === 'zh' ? import.meta.env.VITE_META_NAVIGATION_ZH_ID : import.meta.env.VITE_META_NAVIGATION_EN_ID
  const res = await cms.getDataSourceById(dataSourceId, locale.value)
  let navigationConfig = {}
  if (res.isSuccess)
    navigationConfig = res.data?.content ? JSON.parse(res.data.content) : {}

  const footerList = navigationConfig?.footer
  if (footerList && footerList.length > 0) {
    usefulLinks.value = footerList[0]
    customerService.value = footerList.length > 1 ? footerList[1] : []
    aboutUs.value = footerList.length > 2 ? footerList[2] : []
    IKEANews.value = footerList.length > 3 ? footerList[3] : []
  }
  bottomList.value = navigationConfig?.websiteInfo
  window.addEventListener('scroll', scrollCloseCookie) // 监听滑动事件，用于移除cookie弹窗
  window.addEventListener('click', handleClickEvent) // 监听点击事件，用于移除cookie弹窗
  const isFAM = localStorage.getItem('isFAM')
  if (isLogin.value) {
    if (isFAM === 1 || isFAM === '1')
      joinLink = `/cn/${locale.value}/ikea-family`
    else
      joinLink = `/cn/${locale.value}/profile/new-member-quick-step/`
  }
  else {
    joinLink = `/cn/${locale.value}/profile/login`
  }
  /* loading footer list */
  if (!localStorage.getItem('footerCookie'))
    footerCookie = 1
  footerUrlData.value = cmsConfig.FOOTER_URL_CONFIG[locale.value]
  getFooterUrl()
  swedishFoodHouse = cmsConfig.FRAGMENT_URL_CONFIG[locale.value]
  furnitureApp = cmsConfig.FRAGMENT_URL_CONFIG[locale.value]
})
onUnmounted(() => {
  window.removeEventListener('scroll', scrollCloseCookie)
  window.removeEventListener('click', handleClickEvent)
})
</script>
<style lang="scss" scoped>
.footer_container_bg {
  width: 100%;
  min-width: 1100px;
  background: #f5f5f5;
  box-sizing: border-box;

  .footer_box {
    max-width: 1440px;
    min-width: 1000px;
    padding: 0.8rem 1rem 0 1rem;
    margin: auto;
    overflow: hidden;

    .footer_container {
      width: 100%;
      max-width: 1440px;
      margin: auto;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .footer_container_top {
        list-style: none;
        width: 100%;
        display: flex;
        padding-left: 0;
        justify-content: space-between;

        .footer_container_top1 {
          min-width: 25%;
          padding-right: 0.25rem;

          .join-btn {
            display: inline-block;
            cursor: pointer;
            width: 1.6rem;
            text-align: center;
            height: 0.4rem;
            border: none;
            margin-top: 0.42rem;
            background: #111;
            border-radius: 0.28rem;
            font-style: normal;
            font-weight: bold;
            font-size: 0.14rem;
            line-height: 0.42rem;
            color: #fff;

            /*  padding: 0 56px; */
          }

          .title {
            margin: 0;
            font-style: normal;
            font-weight: bold;
            font-size: 0.22rem;
            line-height: 0.32rem;
            color: #111;
            margin-bottom: 0.1rem;
          }

          .text {
            min-height: 0.54rem;
            font-style: normal;
            font-weight: normal;
            font-size: 0.14rem;
            line-height: 0.28rem;
            color: #484848;

            a {
              color: #484848;
              text-decoration: underline;
            }
          }

          button {
            width: 1.6rem;
            height: 0.42rem;
            border: none;
            margin-top: 0.42rem;
            background: #111;
            border-radius: 0.3rem;
            font-style: normal;
            font-weight: bold;
            font-size: 0.14rem;
            line-height: 0.42rem;
            color: #fff;
          }

          button:focus {
            outline: none;
          }
        }

        .footer_container_top2 {
          // width: 66%;
          flex: 1;

          ul {
            width: 100%;
            display: flex;
            padding-left: 0;
            justify-content: space-around;
            list-style: none;

            .footer_container_topUl_li {
              flex: 0 0 25%;

              dl {
                margin: 0;

                dt {
                  font-style: normal;
                  font-weight: bold;
                  white-space: nowrap;
                  font-size: 0.14rem;
                  line-height: 0.2rem;
                  color: #111;
                  margin-bottom: 0.2rem;
                }

                dd {
                  width: 2rem;
                  font-style: normal;
                  font-weight: normal;
                  font-size: 0.14rem;
                  line-height: 0.24rem;
                  margin-left: 0;
                  color: #484848;
                  margin-bottom: 0.2rem;

                  a {
                    color: #484848;
                    text-decoration: none;
                    word-break: break-word;
                  }

                  a:hover {
                    color: #484848;
                    text-decoration: underline;
                  }
                }
              }
            }
          }
        }

        .footer_container_top3 {
          display: none;
        }
      }

      .footer_container_bottom {
        margin-top: 0.25rem;

        .footer_container_bottom_topImg {
          padding: 0.18rem 0;
          border-bottom: 1px solid #dfdfdf;
          display: flex;

          .hover {
            width: 0.42rem;
            height: 0.42rem;
            display: inline-block;
            border-radius: 50%;
            line-height: 0.32rem;
            text-align: center;
            margin-right: 0.24rem;
            border: 1px solid #dfdfdf;
            position: relative;

            img {
              width: 0.26rem;
              height: 0.26rem;
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              vertical-align: middle;
            }
          }

          .hover:hover {
            background: #ccc;
            cursor: pointer;
          }

          .lang-selector-container {
            position: relative;

            &:hover {
              cursor: pointer;
            }

            .lang-selector {
              padding: 0.1rem 0.4rem 0.1rem 0.3rem;
              display: block;
              -webkit-appearance: none;
              -moz-appearance: none;
              appearance: none;
              width: 1rem;
              height: 0.4rem;
              margin: 0;
              outline: 0;
              text-align: left;
              -moz-text-align-last: left;
              text-align-last: left;
              border-radius: 64px;
              text-indent: 0;
              background: #f5f5f5;
              border: 1px solid #dfdfdf;
              font-weight: 400;
              font-size: 0.12rem;
              line-height: 1.5;
              color: #111;
              box-sizing: border-box;

              &:hover {
                background: #fff;
                cursor: pointer;
              }
            }

            span {
              position: absolute;
              font-size: 0.16rem;
              top: 0.1rem;
              right: 0.2rem;
              font-weight: 900;
              transform: scale(1.8, 1) rotate(90deg);
              pointer-events: none;
            }
          }
        }

        .footer_container_bottom_topText {
          margin-top: 0.05rem;
          margin-bottom: 0.3rem;
          width: 100%;
          display: flex;
          justify-content: space-between;

          .footer_container_bottom_topText_left {
            font-style: normal;
            font-weight: normal;
            font-size: 0.12rem;
            line-height: 0.18rem;
            color: #484848;
            white-space: nowrap;
          }

          .footer_container_bottom_topText_right {
            font-style: normal;
            font-weight: normal;
            font-size: 0.12rem;
            line-height: 0.18rem;
            text-align: left;
            margin-left: 0.3rem;

            a {
              color: #484848;
              text-decoration: none;
            }

            a:hover {
              color: #484848;
              text-decoration: underline;
            }
          }
        }
      }
    }
  }
}

.cookie-bottom {
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 1);
  padding: 0.34rem 0.16rem 0.36rem 0.16rem;
  justify-content: space-between;
  align-items: center;
  display: flex;
  z-index: 1000000;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);

  .cookie-left {
    > div {
      font-weight: normal;
      font-size: 0.14rem;
      line-height: 0.21rem;
      color: #000;

      span:nth-child(2) {
        color: #0058a3;
        text-decoration: underline;
        cursor: pointer;
      }
    }

    div:nth-child(2) {
      margin-top: 0.1rem;
    }
  }

  .cookie-right {
    background: #f5f5f5;
    width: 1.08rem;
    height: 0.4rem;
    color: #111;
    border-radius: 0.2rem;
    text-align: center;
    cursor: pointer;
    line-height: 0.4rem;
    font-weight: bold;
    font-size: 0.12rem;
  }
}
</style>
