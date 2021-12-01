<template>
  <div class="searchLayout">
    <div v-show="searchKey" class="haveSearchKey">
      <div v-if="categoryList.length > 0 || completionList.length > 0" class="haveSearchKey-left">
        <!-- 联想词 -->
        <searchLayoutItem
          v-show="completionList.length > 0"
          search-type="联想词"
          :postion="1"
          :data="completionList"
          @handleSearch="handleSearch"
        />
        <!-- 商品分类 -->
        <searchLayoutItem
          v-show="categoryList.length > 0"
          class="searchBoxItem"
          search-type="商品分类"
          :title="t('search.commodityClassification')"
          :postion="2"
          :data="categoryList"
        />
      </div>
      <div v-if="productList.length > 0 || plannerList.length > 0" class="haveSearchKey-center">
        <!-- 产品 -->
        <layoutProduct
          v-show="productList.length > 0"
          search-type="产品分类"
          :postion="3"
          :product-list="productList"
          @goDetail="goDetail"
        />
        <!-- 设计工具 -->
        <designTool v-show="plannerList.length > 0" :planner-list="plannerList" search-type="设计工具" :postion="4" />
      </div>
      <div v-if="contentList.length > 0" class="haveSearchKey-right">
        <!-- 更多内容 -->
        <moreContent v-show="contentList.length > 0" search-type="更多内容" :postion="5" :content-list="contentList" />
      </div>
    </div>
    <div v-show="!searchKey" class="searchBox">
      <!-- 搜索历史 -->
      <searchLayoutItem
        v-show="searchHistory.length > 0"
        class="searchBoxItem"
        search-type="搜索历史"
        type="del"
        :title="t('search.your_search_history')"
        :postion="2"
        :data="searchHistory"
        @delClick="clearHistory"
        @click="hendleHistoryClick"
      />
      <!-- 热门搜索 -->
      <searchLayoutItem
        v-show="completionList.length > 0"
        class="searchBoxItem"
        search-type="热门搜索"
        :title="t('search.hot_search')"
        :postion="2"
        :data="completionList"
        @click="hendleHotClick"
      />
      <!-- 热门系列 -->
      <searchLayoutItem
        v-show="categoryList.length > 0"
        class="searchBoxItem"
        search-type="热门系列"
        :title="t('search.hotSeries')"
        :postion="3"
        :data="categoryList"
        :search-key="false"
        @click="hendleHotSeriesClick"
      />
      <!-- 热门分类 -->
      <HotCategoryPromotion class="searchBoxItem" search-type="热门分类" :postion="4" @goCat="hendleHotSeriesClick" />
    </div>
  </div>
</template>
<script setup>
import { ref, defineProps, defineEmits, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import HotCategoryPromotion from 'molecules/realtimePromotion/HotCategoryPromotion.vue'
import searchLayoutItem from './searchLayoutItem.vue'
import moreContent from './moreContent.vue'
import designTool from './designTool.vue'
import layoutProduct from './product.vue'
import { cmsReplaceUrl, generateLink } from '@/utils/index'
import { product } from '@/api/config'

const { t, locale } = useI18n()
const props = defineProps({
  /**
     * searchKey  搜索词
     * searchBoxList   接口返回的数组
     * searchHistory   搜索历史 数组
     */
  searchKey: {
    type: String,
    default: () => {
      return ''
    },
  },
  searchBoxList: {
    type: Array,
    default: () => {
      return []
    },
  },
  searchHistory: {
    type: Array,
    default: () => {
      return []
    },
  },
})
const emits = defineEmits(['clearHistory', 'handleSearch', 'close'])
const completionList = ref([]) // 联想词 && 热门搜索
const categoryList = ref([]) //  分类系列
const productList = ref([]) // 产品的列表
const plannerList = ref([]) // 设计工具
const contentList = ref([]) // 更多内容
const categoryPromotionList = ref([]) // 热门分类（推送）
const SikProductList = []
const asyncProductinfo = async() => {
  const ids = SikProductList.map(product => product.id)
  if (ids.length > 0) {
    const res = await product.getProductsByIdList({ ids: ids.join(','), lang: locale.value })
    if (res.isSuccess) {
      const dlist = SikProductList.filter((x) => {
        return res.data.findIndex(y => y.id === x.id) < 0
      })
      completionList.value.forEach((x, index) => {
        if (dlist.findIndex(y => y.id === x.text) >= 0)
          completionList.value.splice(index, 1)
      })
      SikProductList.forEach((x) => {
        const have = res.data.filter(y => y.id === x.id || `s${y.id}` === x.id)
        if (have.length > 0) have[0].id = x.id
        x = {
          ...x,
          ...have[0],
        }
        if (have.length > 0)
          productList.value.push(x)
      })
    }
  }
}
const initList = () => {
  const listarr = props.searchBoxList
  completionList.value = []
  categoryList.value = []
  productList.value = []
  plannerList.value = []
  contentList.value = []
  listarr.forEach((item) => {
    if (item.completion)
      completionList.value.push(item.completion)
    if (item.category)
      categoryList.value.push(item.category)

    if (item.product)
      SikProductList.push(item.product)

    if (item.planner)
      plannerList.value.push(item.planner)

    if (item.content)
      contentList.value.push(item.content)
  })
  // plannerList.value = [
  //   {
  //     imageUrl: 'https://www.ikea.cn/images/pax-pa4-ke4-si1-9404d09fd878ef0205e130ad9fe1b68e.jpg',
  //     title: 'PAX 帕克思设计工具',
  //     url: 'https://www.ikea.cn/cn/zh/planners/pax-planner-pub6679c8eb',
  //   },
  // ]
  // SikProductList = [
  //   {
  //     id: 's09396252',
  //     name: 'PAX 帕克思',
  //     mainImageUrl:
  //             'https://www.ikea.cn/cn/zh/images/products/pax-pa-ke-si-yi-ju-zu-he-bai-se__0937318_pe793638_s5.jpg',
  //     typeName: '衣柜组合',
  //     itemMeasureReferenceText: '250x58x236 厘米',
  //   },
  // ]
  asyncProductinfo()
}
// 删除历史记录
const clearHistory = () => {
  emits('clearHistory')
}
// 历史记录点击
const hendleHistoryClick = (item, index) => {
  emits('handleSearch', item?.text, index, 'history')
}
// 热门搜索点击
const hendleHotClick = (item, index) => {
  emits('handleSearch', item?.text, index, 'hot')
}
const hendleHotSeriesClick = (item, index) => {
  if (item)
    window.location.href = cmsReplaceUrl(item?.url || item.linkUrl, locale.value)
  emits('close')
}
const goDetail = (item) => {
  if (item?.url)
    window.location.href = cmsReplaceUrl(item.url, locale.value)
  else if (item.id)
    window.location.href = generateLink(`/p/${item.id}`, locale.value)
  emits('close')
}
watch(() => props.searchBoxList, () => {
  initList()
})
onMounted(() => {
  initList()
})
</script>
<style lang="scss" scoped>
.searchLayout::-webkit-scrollbar {
  display: none;
}

.searchLayout {
  min-height: 300px;
  max-height: 400px;
  overflow-y: scroll;
  // height: 58px;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 125px;
  scrollbar-width: none; //兼容火狐不显示滚动条
  -ms-overflow-style: none; // 兼容IE10+ 不显示滚动条
}

.searchBox {
  display: flex;
  justify-content: flex-start;

  .searchBoxItem {
    flex: 1;
    padding: 0 20px;
    margin: 0;
    border-right: 1px solid #dfdfdf;

    &:last-child {
      padding-right: 0;
      border-right: none;
    }
  }
}

.haveSearchKey {
  display: flex;
  justify-content: flex-start;

  .haveSearchKey-left {
    min-width: 23%;
    max-width: 23%;
    padding-right: 5%;
    border-right: 1px solid #dfdfdf;
    margin-right: 6%;
  }

  .haveSearchKey-center {
    max-width: 26%;
    min-width: 280px;
    padding-right: 5%;
    border-right: 1px solid #dfdfdf;
    margin-right: 6%;
  }

  .haveSearchKey-right {
    // max-width: 33%;
    flex: 1;
  }
}
</style>
