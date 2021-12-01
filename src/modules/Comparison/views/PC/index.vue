<template>
  <div>
    <div class="comparison-view pc-view clearfix">
      <div class="comparison-header">
        <h1 class="comparison-header__title">
          {{ t('comparison.title') }}
        </h1>
        <!--
        <div class="comparison-header__control">
          <IButton
            class="comparison__return-btn"
            variant="secondary"
            icon="ChevronLeftSmallIcon"
            @click="goBack"
          >
            <span>{{ t('comparison.goBack') }}</span>
          </IButton>
        </div>
        -->
      </div>
      <div v-if="ready" class="comparison-content">
        <div
          v-if="products && products.length > 0"
          ref="listRef"
          class="comparison__list"
          @mouseleave="onMouseOut"
          @mouseout="onMouseOut"
          @mouseenter="onMouseEnter"
          @mouseover="onMouseEnter"
        >
          <div ref="listHeadRef" class="comparison__list--head">
            <IScrollbar
              :show-scroll-control="showScrollControl"
              :show-arrow="showScrollControl"
              :sync-scroll="true"
              :sync-move="syncMove"
              @scroll="onScroll"
            >
              <div class="comparison__list--head__inner">
                <div
                  v-for="(product, idx) in products"
                  :key="idx + product.id"
                  class="comparison__product"
                >
                  <div class="comparison__product--close">
                    <IIcon class="close-icon" size="0.2rem" component-name="CrossIcon" @click="removeProduct(product, idx)" />
                  </div>
                  <ProductListItem
                    class="comparison__product-card"
                    :item="product"
                    :index="idx"
                    :data-track-id="`comparison-item.${idx}`"
                    :data-module-id="`comparison-item.${idx}`"
                    :is-show-out="true"
                    data-module-name="商品对比功能"
                    :bag-add-enable="true"
                    :compression="fixHeader"
                    @onAddToBag="onAddToBag"
                  />
                </div>
              </div>
            </IScrollbar>
          </div>
          <div class="comparison__list--content" :class="{ fixHeader }">
            <IScrollbar
              :show-scroll-control="false"
              :sync-scroll="true"
              :sync-move="syncMove"
              @scroll="onScroll"
            >
              <div class="comparison__list--content__inner">
                <ComparisonSection
                  v-for="(item, idx) in sectionMap"
                  :key="idx + item.attribuite"
                  :title="item.title"
                  :is-icon="item.isIcon"
                  :attribuite="item.attribuite"
                  :is-inline="item.isInline"
                  :is-text-list="item.isTextList"
                  :products="products"
                ></ComparisonSection>
              </div>
            </IScrollbar>
          </div>
        </div>
        <EmptyList
          v-else
          :img-url="getImgUrlByPath('/images/empty_box.png')"
          :title="t('comparison.empty.title')"
          :des="t('comparison.empty.des')"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { ref, defineProps, defineEmits, onMounted, onBeforeUnmount } from 'vue'
import base from '@/composables/base'
import { getImgUrlByPath, debounce } from '@/utils/helper'
import IButton from '@/components/atoms/IButton/IButton.vue'
import IIcon from '@/components/atoms/IIcon/IIcon.vue'
import IScrollbar from '@/components/atoms/IScrollbar/Scrollbar.vue'
import ProductListItem from '@/components/molecules/ProductListItem/ProductListItem.vue'
import ComparisonSection from '@/components/molecules/ComparisonSection/index.vue'
import EmptyList from '@/components/templates/emptyList/index.vue'

interface ISectionMapType {
  attribuite: string
  title: string
  isInline: boolean
  isIcon: boolean
  isTextList: boolean
}
const route = useRoute()
const emits = defineEmits(['onRemoveProduct', 'onAddToBag'])
const props = defineProps({
  ready: {
    type: Boolean,
    default: false,
  },
  products: {
    type: Array,
    default: () => ([]),
  },
  sectionMap: {
    type: Array,
    default: () => ([]),
  },
})

const sectionMap = props.sectionMap as Array<ISectionMapType>
const listRef = ref<any>(null)
const listHeadRef = ref<any>(null)
const showScrollControl = ref<boolean>(false)
const fixHeader = ref<boolean>(false)
const syncMove = ref<{
  moveX: number
  moveY: number
}>({
  moveX: 0,
  moveY: 0,
})

const { t } = base()
const query: { redirectUrl?: string } = route.query

const goBack = () => {
  if (query && query.redirectUrl)
    location.href = decodeURIComponent(query.redirectUrl)

  else
    history.back()
}

const onMouseEnter = () => {
  showScrollControl.value = true
}

const onMouseOut = () => {
  showScrollControl.value = false
}

const removeProduct = (item: any, index?: number) => {
  emits('onRemoveProduct', item)
}

const onAddToBag = (event: any) => {
  emits('onAddToBag', {
    target: event.target,
    item: event.item,
  })
}

const handleScroll = debounce(() => {
  const listEl = listRef.value
  const headEl = listHeadRef.value
  if (listEl && headEl) {
    const listElRects = listEl.getClientRects()
    if (listElRects.length > 0)
      fixHeader.value = listElRects[0].top <= 0
    else
      fixHeader.value = false
  }
}, 15)

const onScroll = (data: any) => {
  syncMove.value = data
}

onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})

</script>
<style lang="scss" scoped>
  @import './index.scss';
</style>
