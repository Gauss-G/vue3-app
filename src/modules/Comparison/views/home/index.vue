<template>
  <!-- <div class="flex flex-col items-center justify-center"> -->
  <div>
    let‘ do it ～
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  reactive,
  computed,
  onMounted,
} from 'vue'
import base from '@/composables/base'

const {
  t,
  isH5,
  $store,
} = base()

const hideNavi = computed(() => {
  return $store.getters['Common/hideNavigation']
})
document.title = t('comparison.title')

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
