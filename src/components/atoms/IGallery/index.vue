<template>
  <div ref="bodyRef" class="iGallery">
    <swiper
      class="iGallery__scroll"
      :modules="modules"
      :slides-per-view="perView"
      :space-between="spaceBetween"
      :loop="loop"
      navigation
      :scrollbar="{ draggable }"
      @slideChange="onSlideChange"
    >
      <swiper-slide v-for="(item, idx) in items" :key="`gallery-item-${idx}`">
        <div class="iGallery__item">
          <IVideo v-if="item.type === 'VIDEO'" :is-show="idx === currentShowIdx" :item="item" class="iGallery__source" />
          <img v-else v-lazy="item.fullUrl || item.url" class="iGallery__source" />
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Scrollbar } from 'swiper'
import IVideo from '@/components/atoms/IVideo/index.vue'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/scrollbar'

const props = defineProps({
  items: {
    type: Array,
    default: () => ([]),
  },
  perView: {
    type: Number,
    default: 1,
  },
  spaceBetween: {
    type: Number,
    default: 0,
  },
  loop: {
    type: Boolean,
    default: false,
  },
  draggable: {
    type: Boolean,
    default: true,
  },
})
const ready = ref<boolean>(false)
const bodyRef = ref<any>(null)
const containerHeight = ref<number>(100)
const containerWidth = ref<number>(100)
const modules = ref<any[]>([Navigation, Scrollbar])
const currentShowIdx = ref<any>(0)

const onSlideChange = (val) => {
  currentShowIdx.value = val.activeIndex
}
</script>

<style scoped lang="scss">
.iGallery {
  position: relative;
  display: block;

  .iGallery__scroll {
    position: relative;
    padding: 0 0 0.2rem;
  }

  .iGallery__item {
    position: relative;
    display: block;
    padding: 0 0.1rem;

    &::before {
      position: relative;
      display: block;
      content: "";
      width: 100%;
      padding-top: 50%;
    }
  }

  .iGallery__source {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
  }

  &:deep(.swiper-button-prev),
  &:deep(.swiper-button-next) {
    background-color: $colour-neutral-grey-900;
    border-radius: 50%;
    width: 0.4rem;
    height: 0.4rem;
    z-index: 5;

    &::after {
      font-size: 0.14rem;
      color: $colour-neutral-white;
    }

    &.swiper-button-disabled {
      display: none !important;
    }
  }

  &:deep(.swiper-button-prev) {
    left: 0;
  }

  &:deep(.swiper-button-next) {
    right: 0;
  }

  &:deep(.swiper-scrollbar) {
    height: 2px;
    border-radius: 4px;
    background: $colour-neutral-grey-200;
    cursor: pointer;
    transition: height 0.2s ease;

    .swiper-scrollbar-drag {
      background: $colour-neutral-grey-900;
    }

    &:hover {
      height: 4px;
    }
  }
}
</style>
