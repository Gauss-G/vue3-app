<template>
  <div :class="['card-view', { 'card--subtle': subtle }]">
    <div v-if="showHeader" class="card-header">
      <slot name="header-icon" class="card-header__icon" />
      <i-inline-text :class="['card-header__text', { 'has-header-icon': $slots[`header-icon`] }]">
        {{ title }}
      </i-inline-text>
      <!-- <i-svg-icon v-if="closeable" :clickable="closeable" :src="`/icons/close-small.svg`" @click="onClose" /> -->
      <IIcon v-if="closeable" :clickable="closeable" size="0.2rem" component-name="ChevronRightSmallIcon" @click="onClose" />

      <slot name="header-link" class="card-header__link" />
    </div>
    <i-divider v-if="showDivider" />
    <div class="card-body">
      <slot name="body" />
    </div>
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue'
import ISvgIcon from 'atoms/ISvgIcon/SvgIcon.vue'
import IInlineText from 'atoms/IInlineText/IInlineText.vue'
import IDivider from 'atoms/IDivider/IDivider.vue'
import IIcon from 'atoms/IIcon/IIcon.vue'
const props = defineProps({
  title: {
    type: String,
    default: null,
  },

  subtle: {
    type: Boolean,
    default: false,
  },

  closeable: {
    type: Boolean,
    default: true,
  },

  showHeader: {
    type: Boolean,
    default: true,
  },

  showDivider: {
    type: Boolean,
    default: false,
  },
})
const emits = defineEmits(['close'])
const onClose = () => {
  emits('close')
}
</script>

<style scoped lang="scss">
.card-view {
  width: inherit;

  .card-header {
    display: flex;
    align-items: center;
    padding: 0.08rem 0.16rem;

    .card-header__text {
      flex: 1;
    }

    .has-header-icon {
      padding-left: 0.08rem;
    }

    :deep(.svg-icon) {
      color: #484848;
    }
  }

  .divider {
    color: #f5f5f5;
  }

  .card-body {
    display: flex;
    align-items: flex-start;
    padding: 0.1rem 0.16rem;
  }

  .card-footer {
    display: flex;
    align-items: flex-end;
    padding: 0.08rem 0.16rem;
  }
}
</style>
