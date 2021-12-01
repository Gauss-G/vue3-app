<template>
  <span
    :class="['loading', `loading--label-${labelPosition}`]"
    aria-live="polite"
  >
    <slot />
    <template v-if="label">
      <span class="loading__text loading__text--fade-in" aria-hidden>{{
        label
      }}</span>
      <span class="loading__sr-only-text">{{ label }}</span>
    </template>
  </span>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ISkapaLoading',
  props: {
    label: {
      type: String,
      default: 'Loading...',
    },

    labelPosition: {
      type: String,
      default: 'center',
    },
  },
})
</script>

<style lang="scss">
@import 'node_modules/@ingka/loading/mixins';
@import '../../../../custom';

@include loading();
</style>
