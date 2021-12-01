<template>
  <i-modal
    :value="modelValue"
    :persistent="persistent"
    :enable-scroll="enableScroll"
    @input="onClose"
  >
    <div
      :class="[
        'prompt',
        {
          'prompt--close': !modelValue,
          'prompt--enter': modelValue,
        },
      ]"
      aria-modal="true"
      role="dialog"
      tabindex="-1"
    >
      <div class="prompt__content-wrapper">
        <div class="prompt__content">
          <h2 v-if="title" class="prompt__heading">
            {{ title }}
          </h2>
          <slot />
        </div>
        <i-modal-footer
          v-if="slots.actions"
          :compact="compactFooter"
          borderless
        >
          <slot name="actions" />
        </i-modal-footer>
      </div>
    </div>
  </i-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import IModal from '../IModal/index.vue'
import IModalFooter from '../IModalFooter/index.vue'

export default defineComponent({
  name: 'IPrompt',
  components: {
    IModal,
    IModalFooter,
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
    persistent: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: null,
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
