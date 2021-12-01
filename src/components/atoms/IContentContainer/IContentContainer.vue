<template>
  <div class="content-container" :class="{'pc-content-container':!isH5}">
    <div v-if="$slots.header" class="content-container__header">
      <slot name="header">
      </slot>
    </div>

    <div class="content-container__content">
      <div v-if="$slots.content">
        <slot name="content" />
      </div>
      <ModuleExposureObserver
        :track-id="`content-container.0`"
        :observed-target-id="`content-container-${_uid}`"
        :enable-tracking="false"
        @isIntersecting="handlePullDownRefresh"
      />

      <div v-if="loading" class="content-container__loading">
        <i-loading color="#111">
          <span :class="['loading__ball', `loading__ball--small`, `loading__ball--primary`]" aria-hidden="true" />
        </i-loading>
      </div>
    </div>

    <div v-if="$slots.footer" class="content-container__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
import ModuleExposureObserver from 'atoms/observer/MutationObserver.vue'
import ILoading from 'atoms/ILoading/ILoading'
import { defineProps, defineEmits } from 'vue'
import base from 'composables/base'
const { isH5 } = base()
const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
})
const emits = defineEmits(['pullDownRefresh', 'pullRefresh'])
const handlePullDownRefresh = () => {
  emits('pullDownRefresh')
}
const handlePullRefresh = () => {
  emits('pullRefresh')
}
</script>

<style scoped lang="scss">
.content-container {
  display: flex;

  .content-container__content {
    position: relative;

    .content-container__loading {
      padding: 0.2rem;
      text-align: center;
    }
  }
}

.pc-content-container {
  .content-container__content {
    padding: 0.3rem 0.5rem;
  }
}
</style>
