<template>
  <div
    :class="[
      'modal-footer',
      {
        'modal-footer--borderless': borderless,
        'modal-footer--compact': compact,
      },
    ]"
  >
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IModalFooter',
  props: {
    borderless: {
      type: Boolean,
      default: false,
    },
    compact: {
      type: Boolean,
      default: false,
    },
  },
})
</script>
