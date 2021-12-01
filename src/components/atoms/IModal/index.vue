<template>
  <div
    :class="[
      'modal-wrapper',
      {
        'modal-wrapper--close': !value,
        'modal-wrapper--open': value,
      },
    ]"
    @click.stop="handleCloseClick"
  >
    <div ref="modalWrapperRef" class="modal-wrapper__backdrop modal-wrapper__backdrop--dark" />
    <focus-trap
      :active="value"
      :escape-deactivates="!persistent"
      @deactivate="onClose"
    >
      <div tabindex="-1">
        <slot />
      </div>
    </focus-trap>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, watch, toRefs, onMounted, onBeforeUnmount } from 'vue'
import { FocusTrap } from 'focus-trap-vue'

export default defineComponent({
  name: 'IModal',
  components: {
    FocusTrap,
  },
  props: {
    enableScroll: {
      type: Boolean,
      default: false,
    },
    persistent: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const { value, enableScroll, persistent } = toRefs(props)
    const modalWrapperRef = ref()
    const onClose = () => {
      emit('input', false)
    }
    const handleCloseClick = (event: InputEvent) => {
      if (event.target === modalWrapperRef.value && !persistent.value) {
        console.log('close')
        onClose()
      }
    }

    watch(() => value.value, (val) => {
      document.documentElement.classList.toggle(
        'no-scroll',
        !enableScroll.value && val,
      )
    })

    onMounted(() => {
      if (!enableScroll.value)
        document.documentElement.classList.toggle('no-scroll', value.value)
    })

    onBeforeUnmount(() => {
      document.documentElement.classList.remove('no-scroll')
    })

    return {
      modalWrapperRef,
      onClose,
      handleCloseClick,
    }
  },
})
</script>

<style lang="scss">
@import 'node_modules/@ingka/modal/mixins';
@import '../custom';

@include modal();

/* Override scroll prevention behavior */
.no-scroll {
  overflow: hidden;
}

.modal-wrapper {
  opacity: 0;

  &.modal-wrapper--open {
    opacity: 1;
    transition: visibility cubic-bezier(0, 0, 1, 1) 200ms, opacity cubic-bezier(0, 0, 1, 1) 200ms;
  }

  &.modal-wrapper--close {
    opacity: 0;
    transition: visibility cubic-bezier(0, 0, 1, 1) 200ms, opacity 200ms linear 200ms;
  }
}
</style>
