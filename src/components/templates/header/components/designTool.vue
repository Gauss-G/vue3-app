<template>
  <div class="designTool">
    <div class="designTool-title">
      {{ t('search.designTool') }}
    </div>
    <div class="designTool-content">
      <div v-for="(item, index) in plannerList" :key="index" class="designTool-content-item">
        <a :href="cmsReplaceUrl(item.url, locale)" @click="handleClick(item, index)">
          <div class="designToolBox">
            <img class="designTool-img" :src="item.imageUrl" alt="" />
          </div>
          <div class="designTool-text">
            {{ item.title }}
          </div>
        </a>
      </div>
    </div>
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
  plannerList: {
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
  gio.trackSearchSuccess({
    ifSearchResult: true,
    searchWord: item.title,
    searchType: this.searchType,
    modulePosition: this.postion,
    position: index,
  }) // 搜索结果点击
}

</script>
<style lang="scss" scoped>
.designToolBox {
  width: 110px;
  height: 78px;
  margin-bottom: 13px;
  position: relative;
  overflow: hidden;
}

.designTool-img {
  position: absolute;
  height: 78px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%)
  // width:110px;
  // height: 110px;
  // margin-bottom: 13px;
}

.designTool-text {
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 18px;
  color: #484848;
}

.designTool {
  .designTool-title {
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 21px;
    color: #111;
    margin-bottom: 14px;
  }
}

.designTool-content {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;
  min-width: 240px;

  .designTool-content-item {
    width: 110px;
    cursor: pointer;
    margin-bottom: 20px;
  }
}
</style>
