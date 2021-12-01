<template>
  <div class="product-package-item" :class="{ inDrawer }">
    <h5 v-if="item.name" class="package-name">
      {{ item.name }}
    </h5>
    <p v-if="item.type" class="package-type">
      {{ item.type }}
    </p>
    <div v-if="item.productFormatId" class="package-formatId">
      <p class="label">
        {{ t('product.article_no') }}
      </p>
      <div>
        <ProductFormatId :format-id="item.productFormatId" />
      </div>
    </div>
    <div v-if="!hideDemision" class="package-attr__group">
      <div v-for="(dimension, idx) in dimensionList" :key="idx" class="package-attr__item">
        <p v-if="dimension.packageNumber">
          {{ t('product.info.package_no') }}: {{ dimension.packageNumber }}
        </p>
        <p v-for="(attr, attrIdx) in dimension.attributes" :key="attrIdx">
          {{ attr.name }}: {{ attr.value }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, computed } from 'vue'
import base from 'composables/base'
import ProductFormatId from '@/components/molecules/Product/ProductFormatId/index.vue'

const { t } = base()
const props = defineProps({
  item: {
    type: Object,
    default: () => {},
  },
  hideDemision: {
    type: Boolean,
    default: false,
  },
  inDrawer: {
    type: Boolean,
    default: false,
  },
})

const dimensionList = computed(() => {
  const list = props.item.childPackageDimensionListNew || []
  if (list.length > 0)
    return list

  return []
})
</script>

<style scoped lang="scss">
.product-package-item {
  position: relative;
  display: block;
  padding: 0 0 0.2rem;
  margin: 0;
  width: 100%;
  font-size: 0.14rem;
  line-height: 0.21rem;
  color: $colour-neutral-grey-700;
  text-align: left;

  &.inDrawer {
    .package-name {
      font-size: 0.16rem;
      line-height: 0.23rem;
    }
  }

  .package-name {
    position: relative;
    margin: 0.2rem 0 0;
    font-weight: $font-weight-bold;
    font-size: 0.14rem;
    line-height: 0.21rem;
    color: $colour-neutral-grey-900;
  }

  .package-type {
    position: relative;
    margin: 0.04rem 0 0;
    font-size: 0.14rem;
    line-height: 0.21rem;
    color: $colour-neutral-grey-700;
  }

  .package-formatId {
    position: relative;
    margin: 0.2rem 0 0;
    font-size: 0.14rem;
    line-height: 0.21rem;
    color: $colour-neutral-grey-700;

    .label {
      margin: 0 0 0.06rem;
      font-size: 0.12rem;
      line-height: 0.18rem;
    }
  }

  .package-attr__group {
    position: relative;
    margin: 0.2rem 0;

    p {
      position: relative;
      margin: 0;
      font-size: 0.14rem;
      line-height: 0.21rem;
      color: $colour-neutral-grey-700;
    }
  }

  .package-attr__item {
    margin: 0 0 0.1rem;
  }
}
</style>
