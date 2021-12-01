<template>
  <div>
    <div v-for="(item, index) in searchList" :key="index" class="keyItem" @click="goSearch(item)">
      <a><span>{{ item.text }}</span></a>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps } from 'vue'
import base from 'composables/base'
import { generateLink } from '@/utils'
const { locale } = base()
const props = defineProps({
  searchList: {
    type: Array,
    default: () => {
      return []
    },
  },
})
const goSearch = (item) => {
  const searchValue = item.text
  if (searchValue) {
    // 保存搜索的词到Storage
    sessionStorage.setItem('keyWord', searchValue)
    sessionStorage.setItem(
      'keyWordFilter',
      JSON.stringify({
        q: searchValue,
      }),
    )
    sessionStorage.removeItem('keyWordTop')
    sessionStorage.removeItem('keyWordisRightFilterDeter')
    sessionStorage.removeItem('keyWordSort')
    sessionStorage.removeItem('keyWordLeftList')
    sessionStorage.removeItem('keyWordRightList')
    sessionStorage.removeItem('keyWordProductCount')
    sessionStorage.removeItem('didYouMeanValue')
    sessionStorage.removeItem('didYouMean')
    const historyWords = JSON.parse(localStorage.getItem(`historyWords${locale.value}`)) || []
    // historyWords = JSON.parse(historyWords);
    historyWords.unshift(searchValue)
    const storageList = historyWords.filter((item, index, arr) => {
      return arr.indexOf(item) === index
    })
    localStorage.setItem(`historyWords${locale.value}`, JSON.stringify(storageList))
    window.location.href = generateLink(`/search/products/?q=${decodeURIComponent(searchValue)}`, locale.value)
    // this.utils.navigateTo({
    //   path: `/cn/${locale.value}/search/products`,
    //   query: {
    //     q: decodeURIComponent(searchValue),
    //   },
    // })
  }
}
</script>

<style lang="scss" scoped>
.keyItem {
  height: 30px;
  font-size: 12px;
  color: #111;
  background: #f5f5f5;
  border-radius: 24px;
  display: inline-block;
  line-height: 30px;
  padding-left: 0.14rem;
  padding-right: 0.14rem;
  margin-right: 0.1rem;
  margin-bottom: 0.1rem;

  a:link {
    text-decoration: none;
  }

  a {
    color: #111;
  }
}
</style>
