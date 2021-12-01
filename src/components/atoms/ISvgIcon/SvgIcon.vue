<template>
  <InlineSvg
    :src="src"
    :class="['svg-icon', { clickable: clickable }]"
    :focusable="focusable"
    aria-hidden="true"
    @click="onClick"
  />
</template>

<script>
import { defineComponent } from 'vue'
import InlineSvg from 'vue-inline-svg'
export default defineComponent({
  name: 'ISvgIcon',

  components: {
    InlineSvg,
  },

  props: {
    error: {
      type: String,
      required: true,
      default: 'success',
    },
    src: {
      type: String,
      required: true,
    },
    focusable: {
      type: Boolean,
      default: false,
    },
    clickable: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['click'],
  methods: {
    onClick() {
      if (!this.clickable) return
      this.$emit('click')
    },
  },
})
</script>

<style scoped lang="scss">
@import 'node_modules/@ingka/svg-icon/mixins';

@function px2rem($value) {
  $retval: $value * 100;

  @return ($retval / 100) / 100 + rem;
}

@include svg-icon();

.clickable {
  cursor: pointer;
}
</style>
