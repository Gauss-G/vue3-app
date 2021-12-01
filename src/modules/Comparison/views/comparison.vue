<template>
  <!-- <div class="flex flex-col items-center justify-center"> -->
  <div :class="{'comparison-page':isH5}">
    <div v-if="!hideNavi" class="comparison-header">
      <ikeaHeader />
    </div>
    <div class="comparison-box">
      <H5index v-if="isH5" v-model:products="displayProducts" v-model:ready="ready" :section-map="sectionMap" @onAddToBag="addToBag" />
      <PCindex
        v-else
        v-model:products="displayProducts"
        v-model:ready="ready"
        :section-map="sectionMap"
        @onRemoveProduct="removeProduct"
        @onAddToBag="addToBag"
      />
    </div>
    <div v-if="!hideNavi" class="comparison-footer">
      <ikeaFotter />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  reactive,
  computed,
  onMounted,
} from 'vue'
import base from 'composables/base'
import ikeaFotter from 'templates/footer/index.vue'
import ikeaHeader from 'templates/header/index.vue'
import comparisonControl from './index.ts'

import H5index from '@/modules/Comparison/views/H5/index.vue'
import PCindex from '@/modules/Comparison/views/PC/index.vue'
import locales from '@/locales'

const {
  t,
  isH5,
  $store,
} = base()

const hideNavi = computed(() => {
  return $store.getters['Common/hideNavigation']
})
document.title = t('comparison.title')

const { ready, requesting, productIds, categoryId, products, displayProducts, removeProduct, addToBag } = comparisonControl()

interface ISectionMap {
  title: string
  attribuite: string
  isInline?: boolean
  isTextList?: boolean
  isIcon?: boolean
}

const sectionMap = ref<Array<ISectionMap>>([
  {
    title: '',
    attribuite: 'images',
  },
  {
    title: '',
    attribuite: 'benefitSummary',
  },
  {
    title: '',
    attribuite: 'productFormatId',
    isInline: true,
  },
  {
    title: '',
    attribuite: 'designText',
  },
  {
    title: t('product.info.dimension'),
    attribuite: 'dimension',
  },
  // {
  //   title: t('product.info.description'),
  //   attribuite: 'benefits',
  //   isTextList: true,
  // },
  {
    title: t('product.info.description'),
    attribuite: 'goodToKnows',
    // isInline: true,
    isTextList: true,
  },
  // {
  //   title: t('product.info.environments'),
  //   attribuite: 'customerMaterialList',
  // },
  {
    title: t('product.info.care'),
    attribuite: 'customerEnvironments',
  },
  {
    title: t('product.info.package_dimension'),
    attribuite: 'childProductDetailList',
  },
])

// 初始化对比列表
onMounted(() => {
  if (locales.global.locale.value === 'zh') {
    sectionMap.value.push({
      title: t('product.info.reviews'),
      isIcon: true,
      attribuite: 'reviewsList',
    })
  }
  else {
    // 保险起见 , 过滤掉评论选项
    sectionMap.value = sectionMap.value.filter(item => item.attribuite !== 'reviewsList')
  }
})
</script>
<style lang="scss">
.comparison-page {
  position: absolute;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;

  .comparison-box {
    flex: 1;
    overflow-y: auto;
    position: relative;
  }
}
</style>
