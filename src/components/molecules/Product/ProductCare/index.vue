<template>
  <div v-if="data && data.length > 0" class="product-care">
    <div v-for="(item, idx) in data" :key="idx + item.header" class="product-care__item">
      <h4 v-if="item.header" class="product-care__item--title">
        {{ item.header }}
      </h4>
      <div v-if="item.texts && item.texts.length > 0" class="product-care__item--content">
        <div v-for="(text, subIdx) in item.texts" :key="subIdx + text" class="subItem">
          <span class="text">
            {{ text }}
          </span>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <span>-</span>
  </div>
</template>

<script>
export default {
  name: 'ProductCare',
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

<style scoped lang="scss">
.product-care {
  position: relative;
  display: block;
}

.product-care__item {
  position: relative;
  display: block;
  margin: 0 0 0.16rem;

  .product-care__item--title {
    margin: 0 0 0.06rem;
    font-weight: $font-weight-bold;
    font-size: 0.16rem;
    line-height: 0.24rem;
  }

  .product-care__item--content {
    &:deep(.subItem) {
      position: relative;
      display: block;
      margin: 0;
    }
  }
}
</style>
