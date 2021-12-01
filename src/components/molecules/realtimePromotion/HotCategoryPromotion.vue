<template>
  <div
    v-if="hotCategories && hotCategories.length > 0"
    class="hotCategoryPromotion"
    :class="{ inSearchPage: type === 'searchPage' }"
  >
    <div class="hotCategoryPromotion__title" title="test">
      <span class="hotCategoryPromotion__title__text">
        {{ t('search.hotCategory') }}
      </span>
    </div>
    <ul class="hotCategoryPromotion__list">
      <li v-for="(item, index) in hotCategories" :key="item.id" class="hotCategoryPromotion__item__wrapper">
        <a
          class="hotCategoryPromotion__item"
          :class="{ hideInSmallScreen: index > 3, hideInBigScreen: index > 5 }"
          :style="{ backgroundImage: `url(${item.imageUrl})` }"
          :href="getUrl(item)"
          :title="item.name"
          @click.prevent="hendleClick(item, index)"
        >
          <p class="hotCategoryPromotion__item__name">{{ item.name }}</p>
        </a>
      </li>
    </ul>
  </div>
</template>
<script setup>
import { ref, defineProps, defineEmits, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { category } from '@/api/config'
import { cmsReplaceUrl } from '@/utils/index'
import gioHooks from '@/utils/hooks/gio'
const { gio } = gioHooks()

const { t, locale } = useI18n()
const props = defineProps({
  type: {
    type: String,
    default: '',
  },
  searchType: {
    type: String,
    default: '',
  },
  postion: {
    type: [Number, String],
    default: 0,
  },
})
const emits = defineEmits(['goCat'])
const hotCategories = ref([])
const getHotCategories = async() => {
  const res = await category.getHotCatalog()
  if (res.isSuccess)
    hotCategories.value = res.data
}
const getUrl = (item) => {
  return cmsReplaceUrl(item?.url || item.linkUrl, locale.value)
  // return `/cat/${item.id}`
}
const hendleClick = (item, index) => {
  // const url = getUrl(item)
  gio.trackSearchSuccess({
    ifSearchResult: true,
    searchWord: item.name,
    searchType: props.searchType,
    modulePosition: props.postion,
    position: index,
  }) // 搜索结果点击

  // emits('goCat', {
  //   ...item,
  //   url,
  //   key: item.id,
  // })
  // this.$router.replace(url)
}
onMounted(() => {
  getHotCategories()
})
</script>
<style lang="scss" scoped>
.hotCategoryPromotion {
  position: relative;
  flex: 1;
  max-width: 260px;
  min-width: 260px;
}

.hotCategoryPromotion__title {
  position: relative;
  margin-bottom: 8px;

  .hotCategoryPromotion__title__text {
    font-style: normal;
    // white-space: nowrap;
    font-weight: 600;
    font-size: 14px;
    line-height: 21px;
    color: #111;
  }
}

.hotCategoryPromotion__list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-items: flex-start;
  width: 100%;
}

.hotCategoryPromotion__item__wrapper {
  position: relative;
  display: inline-block;
}

.hotCategoryPromotion__item {
  position: relative;
  display: block;
  margin: 0 16px 14px 0;
  width: 100px;
  height: 100px;
  border-radius: 4px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;

  &__name {
    position: absolute;
    display: block;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    font-size: 14px;
    line-height: 16px;
    color: #111;
    text-align: center;
    background-color: rgba(255, 255, 255, 0.9);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    z-index: 1;
  }

  &:hover {
    .hotCategoryPromotion__item__name {
      text-decoration: underline;
    }
  }

  &.hideInSmallScreen {
    display: none;
  }
}

.hotCategoryPromotion.inSearchPage {
  margin: 0 0 80px;
  width: 100%;
  max-width: none !important;

  .hotCategoryPromotion__item.hideInSmallScreen,
  .hotCategoryPromotion__item.hideInBigScreen {
    display: inline-block !important;
  }

  .hotCategoryPromotion__title {
    margin: 0 0 40px;

    .hotCategoryPromotion__title__text {
      font-size: 36px;
      font-weight: bold;
      line-height: 53px;
      text-align: center;
      color: #111;
    }
  }

  .hotCategoryPromotion__item {
    margin: 0 30px 62px 0;
    width: 120px;
    height: 120px;
  }

  .hotCategoryPromotion__item__name {
    font-weight: bold;
    font-size: 18px;
    line-height: 27px;
  }
}

@media screen and (min-width: 1201px) {
  .hotCategoryPromotion.inSearchPage {
    min-width: none !important;
    max-width: none !important;
  }

  .hotCategoryPromotion {
    min-width: 420px !important;
    max-width: 420px !important;
  }

  .hotCategoryPromotion__item.hideInSmallScreen {
    display: inline-block;
  }

  .hotCategoryPromotion__item.hideInBigScreen {
    display: none;
  }
}
</style>
