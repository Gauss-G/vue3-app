<template>
  <div class="inline-text">
    <span>
      <slot />
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'IInlineText',
})
</script>

<style lang="scss">
@import 'node_modules/@ingka/inline-text/mixins';
@import '../custom';

@include inline-text();
</style>
