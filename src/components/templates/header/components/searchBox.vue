<template>
  <div v-if="show" class="searchDown">
    <div class="mask" @click="close" />
    <div class="box">
      <div class="searchBoxHeader" />
      <div class="searchBoxContent">
        <searchInput
          :key-word="searchKey"
          @changeValue="changeValue"
          @close="close"
          @handleSearch="handleSearch"
        />
        <search-layout
          v-show="searchBoxList.length > 0"
          :search-key="searchKey"
          :search-box-list="searchBoxList"
          :search-history="searchHistory"
          @close="close"
          @clearHistory="clearHistory"
          @handleSearch="handleSearch"
        />
      </div>
      <div class="searchBoxFooter" />
    </div>
  </div>
</template>
<script setup>
import { ref, defineProps, defineEmits, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import searchInput from './searchInput.vue'
import searchLayout from './searchLayout.vue'
import { search } from '@/api/config'
import { debounce, _local } from '@/utils/helper'
import { generateLink } from '@/utils/index'

const { t, locale } = useI18n()
const props = defineProps({
  // 控制显示
  show: {
    type: Boolean,
    default: false,
  },
  // 传入的关键词
  keyWord: {
    type: String,
    default: '',
  },
})
const emits = defineEmits(['update:show'])
const close = () => {
  emits('update:show', false)
}
const searchHistory = ref([]) // 搜索历史
const addHistoryList = (text) => { // 添加搜索历史
  if (!text) return
  let textList = searchHistory.value.map(item => item.text) || []
  textList.push(text)
  textList = [...new Set(textList)]
  searchHistory.value = textList.map((text) => {
    return {
      text,
    }
  })
  _local.set(`searchWord${locale.value}`, textList)
}
// 清除搜索历史
const clearHistory = () => {
  searchHistory.value = []
  _local.set(`searchWord${locale.value}`, '')
}
const setHistoryList = () => { // 设置搜索历史
  const historyList = _local.get(`searchWord${locale.value}`)
  if (historyList) {
    searchHistory.value = historyList.map((text) => {
      return {
        text,
      }
    })
  }
}
const searchBoxList = ref([]) // 搜索词相关信息
const searchKey = ref(props.keyWord || '')
const searchKeyWord = async(key) => {
  const result = await search.getSearchBox(key || '', locale.value)
  if (!result.isSuccess) return
  const { data } = result || {}
  if (data && data.searchBox)
    searchBoxList.value = data?.searchBox?.universal || []
}
// 搜索词发送改变
const changeValue = debounce((key) => {
  searchKey.value = key
  searchKeyWord(key)
}, 500)
const handleSearch = (key, index, from) => {
  if (key.replace(/\s+/g, '') === '') return
  addHistoryList(key)
  close()
  window.location.href = generateLink(`/search/products?q=${encodeURI(key)}`, locale.value)
}

watch(() => props.show, () => {
  if (props.show)
    searchKeyWord(props.keyWord || '')
})
onMounted(() => {
  if (props.show)
    searchKeyWord(props.keyWord || '')
  setHistoryList()
})
</script>
<style lang="scss" scoped>
.searchDown {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 99;
}

.mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: $popup-bg;
  z-index: 1001;
  overflow: hidden;
}

.box {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  max-height: 5.6rem;
  background: #fff;
  z-index: 1003;
  overflow: hidden;

  .searchBoxHeader {
    height: 0.6rem;
  }
  // .searchBoxContent::-webkit-scrollbar {
  //   display: none;
  // }
  .searchBoxContent {
    min-height: 4rem;
    max-height: 4.8rem;
    // overflow-y: scroll;
    // height: 58/16rem;
    max-width: 1440px;
    margin: 0 auto;
    padding: 0;
  }

  .searchBoxFooter {
    height: 0.6rem;
  }
}
</style>
