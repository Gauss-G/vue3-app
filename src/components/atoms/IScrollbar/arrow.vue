<template>
  <transition name="i-scrollbar-fade">
    <div :class="['i-scrollbar__arrow', `is-${size}`, `is-${direction}`]">
      <i-button
        v-show="visible"
        :class="['i-scrollbar-arrow__button', `is-${variant}`]"
        type="button"
        :icon="`Chevron${direction}Icon`"
        :icon-only="true"
        :variant="variant"
        small
        @click.stop="handleClick"
      />
    </div>
  </transition>
</template>

<script>
import IButton from 'atoms/IButton/IButton.vue'
export default {
  name: 'Arrow',
  components: {
    IButton,
  },
  props: {
    direction: {
      type: String,
      default: 'Left',
      validator(val) {
        return ['Left', 'Right'].includes(val)
      },
    },
    size: {
      type: String,
      default: 'normal',
      validator(val) {
        return ['small', 'normal', 'large'].includes(val)
      },
    },
    variant: {
      type: String,
      default: 'primary',
      validator: value =>
        ['danger', 'emphasised', 'image-overlay', 'plain', 'primary', 'secondary', 'tertiary'].includes(value),
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['scroll'],
  data() {
    return {}
  },
  computed: {},
  methods: {
    handleClick(e) {
      e.stopPropagation()
      this.$emit('scroll', { direction: this.direction })
    },
  },
}
</script>

<style lang="scss" scoped>
.i-scrollbar__arrow {
  position: absolute;
  display: flex;
  bottom: 2px;
  z-index: 5;
  border-radius: 4px;
  background: inherit;
  transition: 300ms all;
  pointer-events: none;

  &.is-Left {
    top: 2px;
    left: -28px;
  }

  &.is-Right {
    top: 2px;
    right: -28px;
  }

  &.is-small {
    :deep(.btn__inner) {
      height: 32px;
      padding: 0 4px;
    }

    :deep(.svg-icon) {
      height: 0.2rem;
      width: 0.2rem;
    }

    &.is-Left {
      top: 2px;
      left: 5px;
    }

    &.is-Right {
      top: 2px;
      right: 5px;
    }
  }

  &.is-normal {
    &.is-Left {
      top: 2px;
      left: -20px;
    }

    &.is-Right {
      top: 2px;
      right: -20px;
    }
  }

  .i-scrollbar-arrow__button {
    margin: auto;
    pointer-events: auto;

    &.is-tertiary {
      background: #fff;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    }
  }
}

.i-scrollbar-fade-enter-active {
  -webkit-transition: opacity 340ms ease-out;
  transition: opacity 340ms ease-out;
}

.i-scrollbar-fade-leave-active {
  -webkit-transition: opacity 120ms ease-out;
  transition: opacity 120ms ease-out;
}

.i-scrollbar-fade-enter-from,
.i-scrollbar-fade-leave-active {
  opacity: 0;
}
</style>
