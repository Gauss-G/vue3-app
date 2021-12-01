<template>
  <div
    :class="[
      'modal-header',
      {
        'modal-header--floating-header': floating,
      },
    ]"
  >
    <i-button
      class="modal-header__close"
      variant="primary"
      icon="CrossIcon"
      :aria-label="closeLabel"
      icon-only
      inverse
      small
      @click="onClose"
    />
    <div v-if="!floating" class="modal-header__title-wrapper">
      <span class="modal-header__title">
        {{ title }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import IButton from '../IButton'

export default defineComponent({
  name: 'IModalHeader',
  components: {
    IButton,
  },
  props: {
    closeLabel: {
      type: String,
      default: 'Close modal',
    },
    floating: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      required: true,
    },
  },
  setup(props, { emit }) {
    const onClose = () => {
      emit('input', false)
    }

    return {
      onClose,
    }
  },
})
</script>
