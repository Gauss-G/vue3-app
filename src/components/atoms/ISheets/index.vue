<template>
  <i-modal
    :value="modelValue"
    :persistent="persistent"
    :enable-scroll="enableScroll"
    @input="onClose"
  >
    <div
      :class="[
        'sheets',
        `sheets--${size}`,
        {
          'sheets--mirrored': mirrored,
          'sheets--close': !modelValue,
          'sheets--enter': modelValue,
        },
      ]"
      aria-modal="true"
      role="dialog"
      tabindex="-1"
    >
      <i-modal-header
        :title="title"
        :value="modelValue"
        :floating="floatingHeader"
        @input="onClose"
      />
      <div class="sheets__content-wrapper">
        <div>
          <slot name="top" />
          <i-modal-body v-if="$slots.default">
            <slot />
          </i-modal-body>
        </div>
      </div>
      <i-modal-footer v-if="$slots.actions" :compact="compactFooter">
        <slot name="actions" />
      </i-modal-footer>
    </div>
  </i-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import IModal from '../IModal/index.vue'
import IModalBody from '../IModalBody/index.vue'
import IModalFooter from '../IModalFooter/index.vue'
import IModalHeader from '../IModalHeader/index.vue'

export default defineComponent({
  name: 'ISheets',
  components: {
    IModal,
    IModalBody,
    IModalFooter,
    IModalHeader,
  },
  props: {
    compactFooter: {
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
    mirrored: {
      type: Boolean,
      default: false,
    },
    persistent: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: 'small', // 'small', 'medium', 'large'
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
  setup(props, { emit, slots }) {
    const onClose = () => {
      emit('update:modelValue', false)
    }

    return {
      slots,
      onClose,
    }
  },
})
</script>
