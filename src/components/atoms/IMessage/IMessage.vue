<template>
  <div :class="['i-message', `i-message--${variant}`]">
    <slot v-if="$slots.icon" name="icon" />
    <span class="i-message__body">
      <slot />
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Message',
  props: {
    variant: {
      type: String,
      default: 'informative',
      validator: (value: string) => ['informative', 'positive', 'cautionary', 'negative'].includes(value),
    },
  },
})
</script>

<style scoped lang="scss">
.i-message {
  display: flex;
  border-radius: 6/100rem;
  padding: 7/100rem 7/100rem;

  &.i-message--informative {
    background: #0058a326;
  }

  &.i-message--positive {
    background: #ffd80026;
  }

  &.i-message--cautionary {
    background: #ffa52426;
  }

  &.i-message--negative {
    background: #e0075126;
  }

  .i-message__body {
    flex-grow: 1;
    padding-left: 0.05rem;
    font-size: 0.12em;
    line-height: 0.24rem;
  }
}
</style>
