<template>
  <div v-if="text" class="product-status" :class="{ success: status === 'success' }">
    <IIcon class="status-icon" size="0.07rem" component-name="CircleFilledIcon" />
    <span> {{ text }} </span>
  </div>
</template>

<script>
import IIcon from 'atoms/IIcon/IIcon.vue'
export default {
  name: 'ProductStatus',
  components: { IIcon },
  props: {
    status: {
      type: String,
      default: '',
    },
    text: {
      type: String,
      default: '',
    },
  },
}
</script>

<style scoped lang="scss">
.product-status {
  position: relative;
  display: inline-block;
  margin: 0;
  padding: 0;
  font-size: 0.12rem;
  line-height: 0.14rem;
  color: $colour-neutral-grey-700;

  &:deep(.status-icon) {
    color: $colour-neutral-grey-700;
    margin: 0 0.06rem 0 0;
    vertical-align: middle;
  }
}
</style>
