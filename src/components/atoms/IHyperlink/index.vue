<template>
  <a
    :href="href"
    :class="[
      'link',
      `link--${color}`,
      {
        'link--xsmall': small,
        'leading-icon': iconPosition && iconPosition === 'left',
        'trailing-icon': iconPosition && iconPosition === 'right',
      },
    ]"
  >
    <slot name="icon" />
    <slot />
  </a>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'

const props = defineProps({
  href: {
    type: String,
    default: '#',
  },
  color: {
    type: String,
    default: 'grey',
    validator: (value: string) => ['grey', 'black', 'white'].includes(value),
  },
  small: {
    type: Boolean,
    default: false,
  },
  iconPosition: {
    type: [Boolean, String],
    default: false,
    validator: (value: string) =>
      typeof value === 'boolean' || ['left', 'right'].includes(value),
  },
})
</script>

<style scoped lang="scss">
@import 'node_modules/@ingka/hyperlink/mixins';

@include link();
</style>
