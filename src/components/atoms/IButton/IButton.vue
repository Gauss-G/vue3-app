<template>
  <component
    :is="href ? 'a' : 'button'"
    :type="!href && type"
    :role="href && 'button'"
    :disabled="disabled"
    :href="href"
    :class="[
      'btn',
      {
        'btn--expanding': expanding,
        'btn--fluid': fluid && !iconOnly,
        'btn--loading': loading,
        'btn--small': small,
        'btn--xsmall': iconOnly && xsmallIconOnly,
        [`${iconPosition}-icon`]: !iconOnly && icon,
        [`btn--${variant}-inverse`]: inverse && !icon,
        [`btn--${variant}`]: !inverse,
        [`btn--icon-${variant}`]: icon && iconOnly && !inverse,
        [`btn--icon-${variant}-inverse`]: icon && iconOnly && inverse
      }
    ]"
    @click="onClick"
  >
    <span class="btn__inner">
      <!-- <i-svg-icon v-if="icon" class="svg-icon btn__icon" :src="`/icons/${icon}.svg`" /> -->
      <i-icon v-if="icon" :component-name="icon" size=".25rem" />
      <span v-if="!iconOnly" class="btn__label">
        <slot />
      </span>

      <span v-if="loading" class="btn__loader">{{ loadingLabel }}</span>
    </span>
  </component>
</template>

<script setup>
// import ISvgIcon from 'atoms/ISvgIcon/SvgIcon.vue'
import IIcon from 'atoms/IIcon/IIcon.vue'
import { ref, defineProps, defineEmits, onMounted } from 'vue'
const INVERSE_TYPES = ['primary', 'emphasised', 'secondary', 'tertiary']
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },

  expanding: {
    type: Boolean,
    default: false,
  },

  fluid: {
    type: Boolean,
    default: false,
  },

  href: {
    type: String,
    default: null,
  },

  loading: {
    type: Boolean,
    default: false,
  },

  loadingLabel: {
    type: String,
    default: 'Loading...',
  },

  icon: {
    type: String,
    default: null,
  },

  iconOnly: {
    type: Boolean,
    default: false,
  },

  iconPosition: {
    type: String,
    default: 'leading',
    validator: value => ['leading', 'trailing'].includes(value),
  },

  inverse: {
    type: Boolean,
    default: false,
  },

  small: {
    type: Boolean,
    default: false,
  },

  type: {
    type: String,
    default: 'button',
    validator: value => ['button', 'submit', 'reset'].includes(value),
  },

  variant: {
    type: String,
    default: 'secondary',
    validator: value =>
      ['danger', 'emphasised', 'image-overlay', 'plain', 'primary', 'secondary', 'tertiary'].includes(value),
  },

  xsmallIconOnly: {
    type: Boolean,
    default: false,
  },
})
const emits = defineEmits(['click'])
const onClick = (event) => {
  emits('click', event)
}
onMounted(() => {
  if (props.inverse && !INVERSE_TYPES.includes(props.variant))
    throw new Error(`IButton: The "inverse" prop is not applicable with variant "${props.variant}"`)
})
</script>

<style scoped lang="scss">
@import 'node_modules/@ingka/button/mixins';
@import '../custom';

// fluid样式调整end
@include btn();
/* stylelint-disable */
.btn__inner {
  padding: 0 0.1rem;
  height: 0.48rem;
  white-space: nowrap;
}
.btn--image-overlay .btn__inner{
  background-color: #dfdfdf;
  color: #111;
}
</style>
