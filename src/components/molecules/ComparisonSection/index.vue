<template>
  <div v-if="attribuite && products" class="comparison-section" :class="{ isInline }">
    <h3 v-if="title" class="comparison-section__title">
      <strong>{{ title }}</strong>
      <IIcon v-show="isIcon" size="0.3rem" component-name="ReviewStarIcon" />
    </h3>
    <div v-if="attribuite === 'dimension'" class="comparison-section__content">
      <AttributeGroup :attr-key="attribuite" :products="products" />
    </div>
    <div v-else class="comparison-section__content">
      <div
        v-for="(product, idx) in products"
        :key="idx + product.id"
        class="comparison-section__item"
      >
        <div v-if="product[attribuite]">
          <ProductFormatId
            v-if="attribuite === 'productFormatId'"
            :key="'productFormatId' + product.id"
            :format-id="product[attribuite]"
          />
          <ProductGallery
            v-else-if="attribuite === 'images'"
            :key="'gallery' + product.id"
            :product="product"
            @onShowMore="showTheatre"
          />
          <ProductCare
            v-else-if="attribuite === 'customerEnvironments'"
            :key="'customerEnvironments' + product.id"
            :data="product[attribuite]"
          />
          <EnvironmentsAndMaterial
            v-else-if="attribuite === 'customerMaterialList'"
            :key="'customerMaterialList' + product.id"
            :data="product[attribuite]"
          />
          <ProductStatus
            v-else-if="attribuite === 'designText'"
            :key="'designText' + product.id"
            :text="product[attribuite]"
          />
          <ProductPackageInfo
            v-else-if="attribuite === 'childProductDetailList'"
            :key="'childProductDetailList' + product.id"
            :product="product"
            only-show-first
            hide-demision
            show-more
            @onShowMore="onShowMore"
          />
          <div v-else-if="isTextList">
            <p v-for="text in product[attribuite]" :key="text" class="text">
              {{ text }}
            </p>
          </div>
          <div v-else>
            <p class="text">
              {{ product[attribuite] || '-' }}
            </p>
          </div>
        </div>
        <template v-else-if="attribuite === 'reviewsList'">
          <ReviewsPackage
            :key="idx + product.id"
            :product-id="product.id"
            @onLodin="onLodin"
          />
        </template>
        <span v-else>-</span>
      </div>
    </div>
  </div>
  <ITheatre
    v-model="theatreShow"
    :fullscreen="true"
  >
    <IGallery v-if="theatreShow" :items="galleryItems" />
  </ITheatre>
  <ILayer v-model:value="showPackageDrawer" type="right" :title="packageDrawerTitle">
    <ProductPackageInfo
      :product="selectedProduct"
      in-drawer
    />
  </ILayer>
  <ILayer v-model:value="showReviewsLayer" width="500" type="right" :title="packageDrawerTitle">
    <ReviewsPackageList
      :list="reviewsList"
    />
  </ILayer>
</template>

<script lang="ts" setup>
import { ref, defineProps, computed } from 'vue'
import ILayer from '@/components/atoms/ILayer/ILayer.vue'
import ITheatre from '@/components/atoms/ITheatre/index.vue'
import IGallery from '@/components/atoms/IGallery/index.vue'
import ProductFormatId from '@/components/molecules/Product/ProductFormatId/index.vue'
import ProductGallery from '@/components/molecules/Product/ProductGallery/index.vue'
import EnvironmentsAndMaterial from '@/components/molecules/Product/EnvironmentsAndMaterial/index.vue'
import ProductCare from '@/components/molecules/Product/ProductCare/index.vue'
import ProductStatus from '@/components/molecules/Product/ProductStatus/index.vue'
import AttributeGroup from '@/components/molecules/Product/AttributeGroup/index.vue'
import ReviewsPackage from '@/components/molecules/Product/ReviewsPackage/index.vue'
import ReviewsPackageList from '@/components/molecules/Product/ReviewsPackage/list.vue'
import IIcon from '@/components/atoms/IIcon/IIcon.vue'
import { IProductMedia } from '@/typings/product.ts'

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  attribuite: {
    type: String,
    default: '',
  },
  isInline: {
    type: Boolean,
    default: false,
  },
  isTextList: {
    type: Boolean,
    default: false,
  },
  isIcon: {
    type: Boolean,
    default: false,
  },
  products: {
    type: Array,
    default: () => ([]),
  },
})

const selectedProduct = ref<any>({})
const showPackageDrawer = ref<boolean>(false)
const showReviewsLayer = ref<boolean>(false)
const packageDrawerTitle = ref<string>('')
const theatreShow = ref(false)
const reviewsList = ref<Array<any>>([])
const galleryItems = ref<IProductMedia[]>([])

const onShowMore = (data: {
  product: any
  title: string
}) => {
  selectedProduct.value = data.product
  packageDrawerTitle.value = data.title
  showPackageDrawer.value = true
}

const showTheatre = (list: IProductMedia[]) => {
  theatreShow.value = true
  galleryItems.value = list
}
// 查看更多评论
const onLodin = (list: Array<any>) => {
  showReviewsLayer.value = true
  reviewsList.value = list
}
</script>

<style lang="scss" scoped>
.comparison-section {
  position: relative;
  display: inline-block;
  padding: 0 0 0.4rem;
  width: auto;
  min-width: 100%;

  &:first-child {
    .comparison-section__content {
      border-top: none;
    }
  }

  &.isInline {
    padding: 0 0 0.2rem;

    .comparison-section__content {
      padding: 0;
      border-top: none;
    }
  }
}

.comparison-section__title {
  position: sticky;
  left: 0;
  padding: 0 0 0.16rem;
  font-weight: $font-weight-bold;
  font-size: 0.24rem;
  line-height: 0.36rem;
  color: $colour-neutral-grey-900;
  text-align: left;
  display: flex;
  align-items: center;

  > strong {
    margin-right: 0.1rem;
  }
}

.comparison-section__content {
  position: relative;
  padding: 0.24rem 0 0;
  border-top: 1px solid $colour-neutral-grey-200;
  display: inline-flex;
  flex-wrap: nowrap;
  flex-direction: row;
  justify-content: flex-start;
  width: auto;
  min-width: 100%;
}

.comparison-section__item {
  position: relative;
  display: block;
  width: calc((100% - 1.4rem) / 5);
  min-width: 220px;
  margin: 0 0.35rem 0 0;
  font-size: 0.14rem;
  line-height: 0.21rem;
  color: $colour-neutral-grey-700;

  &:last-child {
    margin-right: 0;
  }

  .text {
    margin: 0 0 0.06rem;
  }
}

:deep(.control-content) {
  width: 5rem;
}
</style>
