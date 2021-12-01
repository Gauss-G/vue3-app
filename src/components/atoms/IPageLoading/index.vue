<template>
  <div v-if="loading" class="loading-box">
    <div class="loading-box-pop" />
    <div class="loading-box-content">
      <div class="loading-box-text">
        {{ t('loading.loading_please_wait') }}
      </div>
      <div class="loading-box-line" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import base from 'composables/base'

const { t } = base()
const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
})
</script>

<style lang="scss" scoped>
.loading-box {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  text-align: center;
  z-index: 1005;

  .loading-box-pop {
    width: 100%;
    height: 100%;
    background: $colour-neutral-white;
    opacity: 0.7;
  }

  .loading-box-content {
    width: 100%;
    position: fixed;
    left: 0;
    top: 0;
    background: $colour-neutral-grey-100;
    font-style: normal;
    font-weight: 600;
    font-size: 0.12rem;
    line-height: 0.5rem;
    text-align: center;
    color: $colour-neutral-grey-900;

    .loading-box-content-text {
      font-style: normal;
      font-weight: 600;
      font-size: 0.12rem;
      line-height: 0.5rem;
      text-align: center;
      color: $colour-neutral-grey-900;
    }

    .loading-box-line {
      height: 5px;
      width: 500px;
      background: $colour-brand-blue;
      animation: img-rotate 3s infinite;
      animation-iteration-count: infinite;
      animation-timing-function: linear;
    }
  }
}

@keyframes img-rotate {
  0% {
    margin-left: 0;
  }

  100% {
    margin-left: 100%;
  }
}
</style>
