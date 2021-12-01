<template>
  <div class="moreContent">
    <div class="moreContent-title">
      {{ t('search.inspiration_tab') }}
    </div>
    <ul class="moreContentBox">
      <li v-for="(item, index) in contentList" :key="index" class="moreContentItem">
        <a :href="cmsReplaceUrl(item.url, locale)" @click="handleClick(item, index)">
          <div v-if="item.imageUrl" class="moreContent-img">
            <img class="img" :src="item.imageUrl" alt="" />
          </div>
          <div class="moreContent-text">{{ item.title }}</div>
        </a>
      </li>
    </ul>
  </div>
</template>
<script setup>
import { defineProps } from 'vue'
import { useI18n } from 'vue-i18n'
import { cmsReplaceUrl } from '@/utils/index'
import gioHooks from '@/utils/hooks/gio'
const { gio } = gioHooks()

const { t, locale } = useI18n()
const props = defineProps({
  contentList: {
    type: Array,
    default: () => {
      return []
    },
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
const handleClick = (item, index) => {
  this.$gio.trackSearchSuccess({
    ifSearchResult: true,
    searchWord: item.title,
    searchType: this.searchType,
    modulePosition: this.postion,
    position: index,
  }) // 搜索结果点击
}

</script>
<style lang="scss" scoped>
.moreContent-text {
  color: #484848;
}

.moreContent-img {
  width: 180px;
  height: 100px;
  position: relative;
  overflow: hidden;
  margin-bottom: 20px;

  .img {
    // position: absolute;
    // left: 50%;
    // top: 50%;
    // transform: translate(-50%, -50%)
    width: 100%;
    height: auto;
    vertical-align: middle;
  }
}

.moreContentBox {
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  .moreContentItem {
    width: 180px;
    cursor: pointer;
  }
}

.moreContent-title {
  font-weight: 600;
  font-size: 14px;
  line-height: 21px;
  color: #111;
  margin-bottom: 20px;
}
</style>
