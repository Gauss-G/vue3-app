<template>
  <div>
    <div class="outer-box" :class="{'pc_outer-box':!isH5}">
      <div v-if="!isLogin" class="desc-title">
        {{ t('public.sign_in') }}<span class="span-entry"> {{ t('public.ikea') }} </span>{{ t('public.account') }}
      </div>
      <div v-if="isLogin" class="desc-title">
        {{ t('public.your_shopping_cart_is_empty') }}
      </div>
      <div class="desc-tips">
        {{ isLogin?t('public.you_can_add'):t('public.view_items_in_shopping_cart') }}
      </div>
      <div class="cart-box-wrap">
        <button v-if="!isLogin" class="cart-login-btn" @click="goLogin">
          {{ isH5?t('public.go_ahead_and_log_in'):t('public.sign_in') }}
        </button>
        <button v-if="isLogin&&isH5" class="cart-login-btn" @click="goShopping">
          {{ t('public.go_shopping') }}
        </button>
      </div>
      <div v-if="!isH5" class="outer-img">
        <img
          :src="getImgUrlByPath('/images/search/alien1.svg')"
        />
      </div>

      <div v-if="searchList.length > 0" class="search-title">
        {{ t('public.hotSearch') }}
      </div>
      <div v-if="searchList.length > 0" class="hot-search-box">
        <HotSearch :search-list="searchList" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, defineProps, onMounted } from 'vue'
import base from 'composables/base'
// import HotSearch from 'molecules/HotSearch/HotSearch.vue'
import { search } from '@/api/config'
import { generateLink } from '@/utils'
import { getImgUrlByPath } from '@/utils/helper'
const { t, locale, isH5 } = base()
const props = defineProps({
  havCartList: {
    type: Boolean,
    default: false,
  },
  isLogin: {
    type: Boolean,
    default: false,
  },
})
const goLogin = () => {
  const link = generateLink('/profile/login', locale.value)
  window.location.href = link
}
const goShopping = () => {
  const link = generateLink('/', locale.value)
  window.location.href = link
}
const searchList = ref([])
onMounted(async() => {
  const result = await search.getSearchBox('', locale.value)
  if (!result.isSuccess) return
  const { data } = result || {}
  if (data && data.searchBox && data.searchBox.universal) {
    data.searchBox.universal.forEach((item) => {
      if (item.completion)
        searchList.value.push(item.completion)
    })
  }
})
</script>
<style lang='scss' scoped>
.outer-box {
  padding: 0.1rem;
}

.desc-title {
  font-weight: bold;
  font-size: 0.2rem;
  line-height: 0.3rem;
  color: #111;
  margin-top: 0.62rem;
  padding-left: 0.17rem;

  .span-entry {
    color: #0058a3;
    cursor: pointer;
  }
}

.desc-tips {
  font-size: 0.12rem;
  line-height: 0.2rem;
  color: #111;
  margin-top: 0.2rem;
  padding-left: 0.17rem;
}

.cart-box-wrap {
  margin-top: 0.5rem;
  padding-left: 0.13rem;

  .cart-login-btn {
    width: 2.02rem;
    height: 0.55rem;
    background: #0058a3;
    border-radius: 0.27rem;
    font-size: 0.14rem;
    line-height: 0.22rem;
    color: #fff;
    outline: 0;
    border: 0;
  }
}

.search-title {
  height: 0.7rem;
  padding: 0 0.18rem;
  font-weight: bold;
  font-size: 0.14rem;
  line-height: 0.2rem;
  color: #111;
  display: flex;
  align-items: center;
  margin-top: 0.8rem;
  white-space: nowrap;
}

.hot-search-box {
  padding-left: 0.09rem;
  padding-right: 0.09rem;
}

.pc_outer-box {
  text-align: center;

  .desc-title {
    font-size: 0.38rem;

    span {
      margin: 0 0.1rem;
      display: inline-block;
    }
  }

  .desc-tips {
    font-size: 0.16rem;
    margin: 0.4rem 0;
  }

  .outer-img {
    padding-top: 0.5rem;
    text-align: center;

    img {
      margin: 0 auto;
    }
  }

  .cart-box-wrap {
    .cart-login-btn {
      width: 1.35rem;
      height: 0.4rem;
      color: #fff;
      background-color: #111;
    }
  }

  .search-title {
    font-size: 0.38rem;
    color: #111;
    font-weight: 100;
  }

  .hot-search-box {
    margin-top: 0.4rem;
    font-size: 0.14rem;
    text-align: left;

    :deep(.keyItem) {
      width: 0.9rem;
      height: 0.4rem;
      padding: 0;

      a {
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>
