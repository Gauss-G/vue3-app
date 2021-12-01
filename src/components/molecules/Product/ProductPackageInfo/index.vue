<template>
  <div v-if="packages.length > 0" class="product-package" :class="{ inDrawer }">
    <h2 class="product-package--quantity">
      {{ titleText }}
    </h2>
    <div v-if="onlyShowFirst">
      <PackageItem
        :item="firstPackage"
        :hide-demision="hideDemision"
        :in-drawer="inDrawer"
      />
    </div>
    <div v-else>
      <PackageItem
        v-for="(item, idx) in packages"
        :key="idx + item.productId + item.productFormatId"
        :item="item"
        :hide-demision="hideDemision"
        :in-drawer="inDrawer"
      />
    </div>
    <button v-if="showMore" class="product-package__more" @click="handleClickMore">
      {{ t('operation.view_more') }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, computed } from 'vue'
import base from 'composables/base'
import IButton from 'atoms/IButton/IButton.vue'
import PackageItem from '@/components/molecules/Product/ProductPackageInfo/packageItem.vue'

const { t } = base()
const props = defineProps({
  product: {
    type: Object,
    default: () => {},
  },
  onlyShowFirst: {
    type: Boolean,
    default: false,
  },
  hideDemision: {
    type: Boolean,
    default: false,
  },
  showMore: {
    type: Boolean,
    default: false,
  },
  inDrawer: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['onShowMore'])

const packages = computed(() => {
  let list: any[] = []
  if (props.product && props.product.packageDimensionList && props.product.packageDimensionList.length > 0) {
    list = [...list, {
      quantity: 1,
      name: props.product.name,
      productId: props.product.productId,
      type: props.product.type,
      productFormatId: props.product.productFormatId,
      childPackageDimensionListNew: [...props.product.packageDimensionList],
    }]
  }

  else if (props.product && props.product.childProductDetailList && props.product.childProductDetailList.length > 0) { list = [...list, ...props.product.childProductDetailList] }

  return list
})

const firstPackage = computed(() => {
  if (packages.value && packages.value.length > 0)
    return packages.value[0]

  return null
})

const quantity = computed(() => {
  let count = 0
  packages.value.forEach((item) => {
    if (item.childPackageDimensionListNew && item.childPackageDimensionListNew.length > 0) {
      item.childPackageDimensionListNew.forEach((element) => {
        count++
      })
    }
    else {
      count += parseInt(item.quantity)
    }
  })
  return count
})

const titleText = computed(() => {
  return t('product.total_packages').replace('[X]', quantity.value)
})

const handleClickMore = () => {
  emits('onShowMore', {
    product: props.product,
    title: titleText.value,
  })
}
</script>

<style scoped lang="scss">
.product-package {
  position: relative;
  display: block;
  margin: 0;
  padding: 0;
  width: 100%;
  font-size: 0.12rem;
  line-height: 0.14rem;
  color: $colour-neutral-grey-700;
  white-space: initial;
  word-break: break-all;

  &.inDrawer {
    padding: 0 0.5rem;

    .product-package--quantity {
      display: none;
    }
  }

  .product-package--quantity {
    position: relative;
    font-size: 0.14rem;
    font-weight: $font-weight-bold;
    line-height: 0.21rem;
    color: $colour-neutral-grey-700;
  }

  .product-package__more {
    position: relative;
    display: inline-block;
    padding: 0;
    margin: 0;
    font-size: 0.14rem;
    font-weight: $font-weight-bold;
    line-height: 0.21rem;
    color: $colour-neutral-grey-900;
    background-color: none;
    border: none;
  }
}
</style>
