<template>
  <img
    v-if="src"
    :class="classes"
    :src="src"
    :alt="alt"
    :sizes="sizes"
    :srcset="srcset"
    :loading="loading"
    @error="onerror"
  />
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'
const props = defineProps({
  classes: {
    type: [String, Array],
    default: 'i-image',
  },
  alt: {
    type: String,
    default: '',
  },
  src: {
    type: String,
    default: '',
  },
  sizes: {
    type: [String, Number],
    default: 'default',
  },
  loading: {
    type: String,
    default: 'lazy',
  },
  onerror: {
    type: Function,
    default: (e) => {
      this.$emit('onerror', e)
    },
  },
})
const emits = defineEmits(['onerror'])
const srcset = computed(() => {
  const options = [
    `${props.src}?f=xxxl 1400w`,
    `${props.src}?f=xxl 950w`,
    `${props.src}?f=xl 800w`,
    `${props.src}?f=xl 750w`,
    `${props.src}?f=m 600w`,
    `${props.src}?f=s 500w`,
    `${props.src}?f=xs 400w`,
    `${props.src}?f=xxs 300w`,
    `${props.src}?f=xxxs 240w`,
  ]
  return options.join(',')
})
</script>

<style scoped lang="scss">
.i-image {
  width: 100%;
  height: 100%;
}
</style>
