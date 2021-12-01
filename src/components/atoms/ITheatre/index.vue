<template>
  <i-modal
    :value="modelValue"
    :persistent="persistent"
    :enable-scroll="enableScroll"
    @input="onClose"
  >
    <div
      :class="[
        'theatre',
        {
          'theatre--close': !modelValue,
          'theatre--enter': modelValue,
          'fullscreen': fullscreen
        },
      ]"
      aria-modal="true"
      role="dialog"
      tabindex="-1"
    >
      <div class="theatre__content-wrapper">
        <i-modal-header
          :floating="floatingHeader"
          :title="title"
          @input="onClose"
        />
        <i-modal-body v-if="$slots.default">
          <slot />
        </i-modal-body>
      </div>
    </div>
  </i-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import IModal from '../IModal/index.vue'
import IModalBody from '../IModalBody/index.vue'
import IModalHeader from '../IModalHeader/index.vue'

export default defineComponent({
  name: 'ITheatre',
  components: {
    IModal,
    IModalBody,
    IModalHeader,
  },
  props: {
    fullscreen: {
      type: Boolean,
      default: false,
    },
    enableScroll: {
      type: Boolean,
      default: false,
    },
    floatingHeader: {
      type: Boolean,
      default: false,
    },
    persistent: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      required: true,
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const onClose = () => {
      emit('update:modelValue', false)
    }

    return {
      onClose,
    }
  },
})
</script>

<style lang="scss">
.theatre {
  &.fullscreen {
    width: 100vw !important;
    height: 100vh !important;
    top: 0 !important;
    left: 0 !important;
    border-radius: 0 !important;

    .modal-body {
      min-height: calc(100vh - 0.88rem);
    }
  }
}
</style>
