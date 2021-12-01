<template>
  <i-skapa-loading :label="label" :label-position="labelPosition">
    <span
      :class="[
        'loading__ball',
        `loading__ball--${size}`,
        `loading__ball--${variant}`,
      ]"
      aria-hidden="true"
      :style="styles"
    />
  </i-skapa-loading>
</template>

<script>
import { defineComponent } from 'vue'
import ISkapaLoading from '../SkapaLoading/index.vue'

export default defineComponent({
  name: 'ISkapaLoadingBall',
  components: { ISkapaLoading },
  props: {
    label: {
      type: String,
      default: null, // ['center', 'leading']
    },
    labelPosition: {
      type: String,
      default: 'center',
    },
    size: {
      type: String,
      default: 'medium', // ['small', 'medium', 'large']
    },
    type: {
      type: String,
      default: 'primary', // primary, emphasised, secondary
    },
    // 动画元素颜色值
    color: {
      type: String,
      default: '',
    },
  },
  computed: {
    styles() {
      let style = {}
      if (this.color) {
        style = {
          ...style,
          backgroundColor: this.color,
        }
      }
      return style
    },
    sizeLowerCase() {
      return this.size.toLowerCase()
    },
  },
})
</script>
