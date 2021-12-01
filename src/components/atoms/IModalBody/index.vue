<template>
  <div class="modal-body">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IModalBody',
})
</script>
