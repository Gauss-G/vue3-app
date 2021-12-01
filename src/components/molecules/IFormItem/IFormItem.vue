<template>
  <a-form-item class="i-form-item" :validate-status="error">
    <slot />
  </a-form-item>
  <div v-if="error === 'error'">
    <slot name="error" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IFormItem',

  props: {
    error: {
      type: String,
      required: true,
      default: 'success',
    },
  },
})
</script>

<style lang="scss">
.i-form-item {
  position: relative;
}
</style>
