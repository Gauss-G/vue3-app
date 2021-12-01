<template>
  <div v-if="formatId" class="product-format-id">
    <span> {{ formatId }} </span>
  </div>
</template>

<script>
export default {
  name: 'ProductFormatId',
  props: {
    formatId: {
      type: String,
      default: '',
    },
  },
}
</script>

<style scoped lang="scss">
.product-format-id {
  position: relative;
  display: inline-block;
  margin: 0;
  padding: 0.04rem 0.12rem;
  background-color: $colour-neutral-grey-900;
  font-family: 'Noto IKEA Latin', 'Noto Sans', 'Roboto', 'Open Sans', -apple-system, sans-serif !important;
  font-size: 0.12rem;
  line-height: 0.14rem;
  color: $colour-neutral-white;
}
</style>
