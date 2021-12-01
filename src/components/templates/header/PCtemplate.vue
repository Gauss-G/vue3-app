<template>
  <div class="header-box">
    <div class="header_container">
      <!-- 头部左边 -->
      <div ref="container" class="header_container_top">
        <div class="header_container_top_content">
          <div class="header_container_left">
            <!-- 头部中间 -->
            <div class="header_container_center">
              <!-- logo图片 -->
              <div class="header_container_center_Logo" data-track-id="head-nav.0" @click="goUrl('/',true)">
                <img
                  :src="getImgUrlByPath('/images/headerImages/logo.svg')"
                  class="disable-event"
                  width="94px"
                  height="36px"
                  alt=""
                />
              </div>
              <ul
                class="header_container_center_ul"
              >
                <!--所有商品-->
                <li>
                  <span
                    data-track-id="head-nav.1"
                    @click="changeTab('category')"
                    @mouseenter="changeTab('category')"
                  >
                    {{ t('links.products') }}
                  </span>
                </li>
                <li v-for="(item, index) in navigationList" :key="item.title">
                  <span
                    :data-track-id="'head-nav.2.' + index"
                    :data-track-label="item.title"
                    @click="changeTab(index)"
                    @mouseenter="changeTab(index)"
                  >{{ item.title }}</span>
                </li>
              </ul>
            </div>
          </div>

          <div class="search-bar-container">
            <div class="search-input">
              <div class="s-header">
                <input
                  ref="searchInput"
                  v-model="searchValue"
                  class="s-input"
                  aria-label="search"
                  :placeholder="searchValue || t('links.what_are_you_looking_for')"
                  @click="showSearch"
                />
                <IIcon class="search-icon" component-name="MagnifyingGlassIcon" size="2.4rem" />
              </div>
            </div>
          </div>

          <!-- 头部右边 -->
          <div class="header_container_right">
            <div class="header_container_right_img">
              <ITooltip :content="t('links.search')" theme="light">
                <div class="hover searchIcon" data-track-id="head-nav.4" @click="showSearch">
                  <i-icon size=".24rem" component-name="MagnifyingGlassIcon" />
                </div>
              </ITooltip>
              <ITooltip :content="t('links.my_profile')" theme="light">
                <div class="hover" data-track-id="head-nav.5" @click="goUrl('/profile/myprofile')">
                  <i-icon size=".24rem" component-name="PersonIcon" />
                </div>
              </ITooltip>
              <ITooltip :content="t('links.my_collection')" theme="light">
                <div class="hover" data-track-id="head-nav.6" @click="goUrl('/profile/collection')">
                  <i-icon size=".24rem" component-name="HeartIcon" />
                </div>
              </ITooltip>
              <ITooltip :content="t('links.shopping_cart')" theme="light">
                <div class="hover cart-cus" data-track-id="head-nav.7" @click="goUrl('/pay/cart',true)">
                  <i-icon size=".24rem" component-name="ShoppingBagIcon" />
                  <div v-show="isLogin && cartQuantity" class="hover-num">
                    <span class="hover-num-text">{{ cartQuantity > 99 ? '99+' : cartQuantity }}</span>
                  </div>
                </div>
              </ITooltip>
            </div>
          </div>
        </div>
      </div>
      <categoryMenu v-show="currentTabIndex === 'category'" class="header-category" module="head-nav.1" @close="currentTabIndex = -1" />
      <!-- 将所有的内容全罗列出来 -->
      <headerCardList
        v-for="(item, index) in navigationList"
        v-show="currentTabIndex === index"
        :key="item.title"
        :list="item.set"
        :data-track-id="`head-nav.2.${index}`"
        :class="'header-card-list'+index"
        @close="currentTabIndex = -1"
      />
    </div>
    <div class="header_container_copy" />
    <searchBox
      v-model:show="isSearchShow"
      :key-word="searchValue"
      @handleConfirm="handleConfirm"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits, onMounted, computed, onUnmounted } from 'vue'
import base from 'composables/base'
// import MenuDraw from '~/components/MenuDraw'
// import searchDownBox from '~/components/searchDown/searchDownBox'
// import PublicDraw from '~/components/PublicDraw'
// import { getShoppingCart } from '~/api/shoppingCart'
// import HeaderMessage from '~/components/business/notificationheader/NotificationHeaderContainer'
// import HeaderMessage from '~/components/headerMessage'
// import { createMetadataAdapter } from '~/adapter/metadata'
import IIcon from 'atoms/IIcon/IIcon.vue'
import ITooltip from 'atoms/ITooltip/ITooltip.vue'
import searchBox from './components/searchBox.vue'
import headerCardList from './components/headerCardList.vue'
import categoryMenu from './components/categoryMenu.vue'
import { getImgUrlByPath } from '@/utils/helper'
import { cms } from '@/api/config'
import { generateLink } from '@/utils/index'

const { locale, t, $store, $route } = base()
const isLogin = computed(() => {
  return $store.getters['Common/hasLoggedIn']
})

const cartQuantity = computed(() => {
  return $store.getters['ShopCart/cartQuantity']
})

const props = defineProps({
  // 具体展示的页面：homepage,shoppingBag,default
  headerMessageShownPage: {
    type: String,
    default: 'default',
    required: true,
  },
  metadataId: {
    type: String,
    default: '',
  },
})
const currentTabIndex = ref(-1) // 当前hover的菜单索引

const isSearchShow = ref(false)
const searchValue = ref($route.query?.q || '')
const navigationList = ref([])

// let offsetWid = 1920 // 浏览器宽度
// let isToken = false // 判断是否登录
// let scrollTimeout = null
// let lastScrollTop = 0 // 记录上次的scroll
// let drawList = []
// let scrollTop = 0
// 显示搜索区域
const showSearch = () => {
  currentTabIndex.value = -1
  isSearchShow.value = true
}
// 切换hover的内容
const changeTab = (index) => {
  currentTabIndex.value = index
}
// 前往个人中心， 收藏 购物袋等
const goUrl = (url, notToken) => {
  if (notToken) {
    window.location.href = generateLink(url, locale.value)
    return
  }
  if (isLogin.value)
    window.location.href = generateLink(url, locale.value)
  else
    window.location.href = generateLink('/profile/login', locale.value)
}
// 处理滚动等行为
const userBehaviourTreats = () => {
  if (currentTabIndex.value >= 0 || currentTabIndex.value === 'category') {
    const header = document.querySelector('.header_container_top')
      ? document.querySelector('.header_container_top').getBoundingClientRect()
      : 0
    const cardListDome = currentTabIndex.value === 'category' ? document.querySelector('.header-category .navigate-wrapper').getBoundingClientRect() : document.querySelector(`.header-card-list${currentTabIndex.value} .cus_container`).getBoundingClientRect()
    if ((Math.abs(cardListDome.top) + header.height) >= cardListDome.height)
      currentTabIndex.value = -1
  }
}
onMounted(async() => {
  // 获取数据
  const dataSourceId = locale.value === 'zh' ? import.meta.env.VITE_META_NAVIGATION_ZH_ID : import.meta.env.VITE_META_NAVIGATION_EN_ID
  const res = await cms.getDataSourceById(dataSourceId, locale.value)
  if (res.isSuccess) {
    const resJSON = JSON.parse(res.data.content)
    navigationList.value = resJSON?.header
  }
  window.addEventListener('scroll', userBehaviourTreats)
  window.addEventListener('resize', userBehaviourTreats)
})
onUnmounted(() => {
  window.removeEventListener('scroll', userBehaviourTreats)
  window.removeEventListener('resize', userBehaviourTreats)
})
</script>

<style lang="scss" scoped>
// 全局的hover样式  start
.hover {
  display: inline-block;
  border-radius: 50%;
  background: #fff;
  vertical-align: middle;
  position: relative;

  //hover中的角标
  &:deep(.hover-num) {
    position: absolute;
    top: 0;
    left: 0.31rem;
    min-width: 0.2rem;
    text-align: center;
    background: #0051a3;
    border: 2px solid #fff;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-content: center;
    border-radius: 0.28rem;
    padding: 0.03rem;

    .hover-num-text {
      font-style: normal;
      font-weight: normal;
      margin: 0 1px;
      font-size: 0.12rem;
      line-height: 1;
      text-align: center;
      background: #0051a3;
      color: #fff;
      vertical-align: middle;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-content: center;
      border-radius: 0.28rem;
      // padding: 0 6/16rem;
    }
  }
}

.hover:hover {
  background: #ccc;
  cursor: pointer;
}

// 全局的hover样式  end
.header_container {
  &.header--fixed {
    position: fixed;
    left: 0;
    top: -60px;
    z-index: 10;
    transition: transform 300ms;

    &.header--scroll-up {
      pointer-events: all;
      transform: translateY(100%);
    }
  }

  width: 100%;
  background: #fff;
  // max-width: 1440px;//缩放造成header很小，所以去掉
  min-width: 1000px;
  margin: auto;
  height: 60px;
  box-sizing: border-box;

  .header_container_top {
    position: relative;
    display: flex;
    justify-content: space-between;
    // height: 70/16rem;
    height: 0.6rem;
    // padding-top: 10px;
    padding: 0  1rem 0  1rem;
    width: 100%;
    max-width: 1440px;
    margin: 0 auto;
    background: #fff;

    .header_container_top_content {
      width: 100%;
      // padding: 1.25rem 0 1.375rem 0;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .header_container_left {
        display: inline-block;

        img {
          vertical-align: middle;
        }

        .header_container_center {
          display: inline-flex;

          .header_container_center_Logo {
            width: 0.94rem;
            height: 0.36rem;
            position: relative;
            display: inline-block;
            vertical-align: middle;
            cursor: pointer;

            img {
              width: 100%;
              height: 100%;
            }
          }

          .header_container_center_ul {
            list-style: none;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            vertical-align: middle;
            margin-left: 0.1rem;
            padding: 0;
            margin-bottom: 0 !important;

            li {
              float: left;
              white-space: nowrap;
              margin-left: 0.4rem;
              font-style: normal;
              font-weight: bold;
              font-size: 0.14rem;
              line-height: 0.24rem;
              color: #111;

              span {
                text-decoration: none;
                color: #111;
                cursor: pointer;
                position: relative;
                text-transform: capitalize;
                margin-left: -7px;

                &::before {
                  content: '';
                  height: 3px;
                  background: #0058a3;
                  position: absolute;
                  bottom: -9px;
                  left: -2px;
                  right: -2px;
                  transition: all 0.4s ease-in 0s;
                  transform: scale(0, 1);
                }

                &.active {
                  &::before {
                    content: '';
                    height: 3px;
                    background: #0058a3;
                    position: absolute;
                    bottom: -9px;
                    left: -2px;
                    right: -2px;
                  }

                  &::after {
                    content: '';
                    height: 14px;
                    background: transparent;
                    position: absolute;
                    bottom: -9px;
                    left: -2px;
                    right: -2px;
                  }
                }
              }

              span:hover {
                &::before {
                  transform: scale(1, 1);
                }
              }
            }

            .search-item {
              margin: -0.11rem 0 0 0.5rem;
              min-width: 2rem;
            }

            a {
              // color: @text-normal;
            }
          }
        }
      }

      .search-bar-container {
        flex-grow: 0.8;
        margin-top: -12px;
        margin-left: 0.3rem;
      }

      .header_container_right {
        display: inline-block;
        white-space: nowrap;

        .header_container_right_img {
          display: inline-block;

          .hover {
            // display: inline-block;
            border-radius: 50%;
            background: #fff;
            width: 0.48rem;
            height: 0.48rem;
            vertical-align: middle;
            display: flex;
            // border-radius: 50% !important;
            // background: #fff;
            // width: 32/16rem !important;
            // height: 32/16rem !important;
            // vertical-align: middle;
            align-items: center;
            justify-content: center;

            // img {
            //   width: 1.06rem;
            //   height: 1rem;
            //   margin: 1rem;
            //   vertical-align: middle;
            // }
          }

          .hover:hover {
            background: #ccc;
            cursor: pointer;
          }
        }
      }
    }
  }
}

.header-box {
  .floating-layer {
    width: 100%;
    height: 0.6rem;
    background: #000;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
    position: relative;

    .floating-layer-item:nth-child(2) {
      margin: 0 0.9rem;
    }

    .floating-layer-item {
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;

      &:hover {
        span {
          text-decoration: underline;
        }
      }

      span {
        font-weight: bold;
        font-size: 0.14rem;
        line-height: 0.21rem;
        color: #fff;
      }
    }

    .close-button {
      position: absolute;
      right: 0;
      top: 6px;
      cursor: pointer;
    }
  }
}

/**
购物车抖动
*/
.shake {
  // animation: shakeCart 0.4s ease-in-out forwards;
}

@keyframes shakeCart {
  25% {
    transform: translateX(6px);
  }

  50% {
    transform: translateX(-4px);
  }

  75% {
    transform: translateX(2px);
  }

  100% {
    transform: translateX(0);
  }
}

.boxShadow {
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
}

.mgl0 {
  margin-left: 0 !important;
}

// /deep/ .ivu-tooltip-inner {
//   color: #484848 !important;
// }

.search-input {
  margin: 0 auto;
  box-sizing: border-box;
}

.s-header {
  width: 100%;
  margin-top: 10px;
  position: relative;

  input {
    border: none;
    height: 40px;
    background: #f5f5f5;
    border-radius: 20px;
    text-overflow: ellipsis;
  }

  input:focus {
    outline: none;
    box-shadow: none;
    height: 40px;
    background: #f5f5f5;
    border-radius: 20px;
  }

  .s-input:focus {
    outline: none;
    box-shadow: none;
    height: 40px;
    background: #f5f5f5;
  }

  .s-input {
    width: 100%;
    // height: 52.49px;
    background: #f5f5f5;
    border: 1px solid #f5f5f5;
    border-radius: 0.24rem;
    padding-left: 0.6rem;
    padding-right: 0.05rem;
    font-weight: 700;
    font-size: 13px;
    line-height: 21px;
    outline: none;
  }

  .search-icon {
    position: absolute;
    background-position: -60px 0;
    pointer-events: none;
    top: 50%;
    left: 0.24rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    transform: translateY(-50%);
  }

  .s-input::placeholder {
    color: #111;
  }

  .s-input:-ms-input-placeholder {
    color: #111 !important;
  }
}

.searchIcon {
  display: none !important;
}

@media screen and (max-width: 1180px) {
  .search-bar-container {
    display: none;
  }

  .searchIcon {
    display: flex !important;
  }
}
</style>
