<template>
  <div class="divider" role="separator" />
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'IDivider',
})
</script>

<style scoped lang="scss">
@import 'node_modules/@ingka/variables/style';
@import '../custom';

.divider {
  border-top: 1px solid $colour-neutral-grey-200;
}
</style>
