<template>
  <div class="product">
    <div class="productTitle">
      {{ t('search.product') }}
    </div>
    <ul>
      <li v-for="(item, index) in productList" :key="index" class="productItem" @click="goDetail(item, index)">
        <div class="productItem-box">
          <img class="productItem-img" :src="item.mainImageUrl" alt="" />
          <div class="productItem-right">
            <div class="productItem-title">
              {{ item.name }}
            </div>
            <div class="productItem-commit">
              <span v-if="item.typeName">{{ item.typeName }}</span>
              <span v-if="item.itemMeasureReferenceText && item.typeName">
                <span v-if="$route.params.lang === 'zh'">，</span>
                <span v-else>, </span>
              </span>
              <span v-if="item.itemMeasureReferenceText">{{ item.itemMeasureReferenceText }}</span>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script setup>
import { defineProps, defineEmits } from 'vue'
import { useI18n } from 'vue-i18n'
import { cmsReplaceUrl } from '@/utils/index'
import gioHooks from '@/utils/hooks/gio'
const { gio } = gioHooks()
const { t, locale } = useI18n()
const props = defineProps({
  productList: {
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
const emits = defineEmits(['goDetail'])
const goDetail = (item, index) => {
  gio.trackSearchSuccess({
    ifSearchResult: true,
    searchWord: item.name,
    searchType: this.searchType,
    modulePosition: this.postion,
    position: index,
  }) // 搜索结果点击
  emits('goDetail', item)
}
</script>
<style lang="scss" scoped>
.product {
  .productTitle {
    font-weight: 600;
    font-size: 14px;
    line-height: 21px;
    color: #111;
    margin-bottom: 20px;
  }

  .productItem {
    cursor: pointer;
    margin-bottom: 20px;

    .productItem-box {
      max-width: 240px;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .productItem-img {
        width: 80px;
        height: 80px;
        margin-right: 13px;
      }

      .productItem-right {
        .productItem-title {
          font-weight: 600;
          font-size: 12px;
          line-height: 18px;
          color: #111;
          margin-bottom: 10px;
        }

        .productItem-commit {
          font-size: 12px;
          line-height: 18px;
          color: #484848;
        }
      }
    }
  }
}
</style>
