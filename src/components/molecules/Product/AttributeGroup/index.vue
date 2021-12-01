<template>
  <div v-if="attrKey" class="product-attribute-group">
    <div v-for="(sectionKey, idx) in attrKeys" :key="idx + sectionKey" class="product-attribute-group__section">
      <p class="product-attribute-group__section__title">
        {{ sectionKey }}
      </p>
      <div class="product-attribute-group__section__content">
        <div
          v-for="(product, productIdx) in products"
          :key="productIdx + product.id"
          class="product-attribute-group__section__item"
        >
          <span v-if="attrMap[sectionKey] && attrMap[sectionKey][product.id]">{{ attrMap[sectionKey][product.id] }}</span>
          <span v-else>-</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, computed } from 'vue'
const props = defineProps({
  attrKey: {
    type: String,
    default: '',
  },
  products: {
    type: Array,
    default: () => [],
  },
})

const grouping = () => {
  if (!props.attrKey) return {}
  const map = {}
  props.products.forEach((product: any) => {
    const attrs = product[props.attrKey]
    if (attrs) {
      attrs.forEach((item: {
        first: string
        second: string
      }) => {
        if (item.first) {
          if (!(item.first in map))
            map[item.first] = {}

          map[item.first][product.id] = item.second
        }
      })
    }
  })
  return map
}

const attrMap = computed(() => {
  return grouping()
})

const attrKeys = computed(() => {
  return Object.keys(attrMap.value)
})
</script>

<style scoped lang="scss">
.product-attribute-group {
  position: relative;
  display: inline-block;
  width: auto;
  min-width: 100%;

  .product-attribute-group__section {
    position: relative;
    display: inline-block;
    margin: 0 0 0.1rem;
    width: auto;
    min-width: 100%;
  }

  .product-attribute-group__section__title {
    position: sticky;
    display: inline-block;
    left: 0;
    margin: 0 0 0.1rem;
    font-size: 0.14rem;
    font-weight: $font-weight-bold;
    line-height: 0.21rem;
    color: $colour-neutral-grey-700;
    text-align: left;
  }

  .product-attribute-group__section__content {
    position: relative;
    display: inline-flex;
    flex-wrap: nowrap;
    flex-direction: row;
    justify-content: flex-start;
  }

  .product-attribute-group__section__item {
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
  }
}
</style>
