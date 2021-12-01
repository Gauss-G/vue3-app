<template>
  <i class="iicon" :style="{ fontSize: size }">
    <component :is="componentName" />
  </i>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import EllipsesHorizontalIcon from '@turboui/icons/dist/vue/esm/components/EllipsesHorizontalIcon.vue'
import DrillIcon from '@turboui/icons/dist/vue/esm/components/DrillIcon.vue'
import ChevronRightSmallIcon from '@turboui/icons/dist/vue/esm/components/ChevronRightSmallIcon.vue'
import PlusSmallIcon from '@turboui/icons/dist/vue/esm/components/PlusSmallIcon.vue'
import MinusSmallIcon from '@turboui/icons/dist/vue/esm/components/MinusSmallIcon.vue'
import CheckmarkIcon from '@turboui/icons/dist/vue/esm/components/CheckmarkIcon.vue'
import CrossSmallIcon from '@turboui/icons/dist/vue/esm/components/CrossSmallIcon.vue'
import TrashCanIcon from '@turboui/icons/dist/vue/esm/components/TrashCanIcon.vue'
import HeartFilledIcon from '@turboui/icons/dist/vue/esm/components/HeartFilledIcon.vue'
import HeartIcon from '@turboui/icons/dist/vue/esm/components/HeartIcon.vue'
import NoticeCircleIcon from '@turboui/icons/dist/vue/esm/components/NoticeCircleIcon.vue'
import CrossIcon from '@turboui/icons/dist/vue/esm/components/CrossIcon.vue'
import ShoppingBagAddIcon from '@turboui/icons/dist/vue/esm/components/ShoppingBagAddIcon.vue'
import ChevronRightIcon from '@turboui/icons/dist/vue/esm/components/ChevronRightIcon.vue'
import ChevronLeftIcon from '@turboui/icons/dist/vue/esm/components/ChevronLeftIcon.vue'
import ChevronLeftSmallIcon from '@turboui/icons/dist/vue/esm/components/ChevronLeftSmallIcon.vue'
import ArrowRightIcon from '@turboui/icons/dist/vue/esm/components/ArrowRightIcon.vue'
import HomeIcon from '@turboui/icons/dist/vue/esm/components/HomeIcon.vue'
import SquareGridIcon from '@turboui/icons/dist/vue/esm/components/SquareGridIcon.vue'
import MapIcon from '@turboui/icons/dist/vue/esm/components/MapIcon.vue'
import ShoppingBagIcon from '@turboui/icons/dist/vue/esm/components/ShoppingBagIcon.vue'
import PersonIcon from '@turboui/icons/dist/vue/esm/components/PersonIcon.vue'
import MagnifyingGlassIcon from '@turboui/icons/dist/vue/esm/components/MagnifyingGlassIcon.vue'
import InformationCircleIcon from '@turboui/icons/dist/vue/esm/components/InformationCircleIcon.vue'
import ScanQrCodeIcon from '@turboui/icons/dist/vue/esm/components/ScanQrCodeIcon.vue'
import CircleFilledIcon from '@turboui/icons/dist/vue/esm/components/CircleFilledIcon.vue'
import ReviewStarIcon from '@turboui/icons/dist/vue/esm/components/ReviewStarIcon.vue'
import PlayIcon from '@turboui/icons/dist/vue/esm/components/PlayIcon.vue'
import PauseIcon from '@turboui/icons/dist/vue/esm/components/PauseIcon.vue'
// const components = import.meta.glob('./node_modules/@turboui/icons/dist/vue/esm/components/*.vue')
export default defineComponent({
  name: 'IIcon',
  components: {
    ScanQrCodeIcon,
    MagnifyingGlassIcon,
    PersonIcon,
    ShoppingBagIcon,
    SquareGridIcon,
    HomeIcon,
    MapIcon,
    ArrowRightIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    EllipsesHorizontalIcon,
    DrillIcon,
    ChevronRightSmallIcon,
    ChevronLeftSmallIcon,
    PlusSmallIcon,
    CheckmarkIcon,
    MinusSmallIcon,
    CrossSmallIcon,
    HeartFilledIcon,
    HeartIcon,
    TrashCanIcon,
    NoticeCircleIcon,
    CrossIcon,
    ShoppingBagAddIcon,
    InformationCircleIcon,
    CircleFilledIcon,
    ReviewStarIcon,
    PlayIcon,
    PauseIcon,
  },
  props: {
    componentName: {
      type: String,
      required: true,
      default: '',
    },
    size: {
      type: String,
      default: 'inherit',
    },
    color: {
      type: String,
      default: 'inherit',
    },
    type: {
      type: String, // 'svg' | 'iconfont' | 'lazySvg'
      default: 'svg',
    },
  },
})
</script>

<style scoped lang="scss">
.iicon {
  display: inline-flex;
  line-height: 1;
}
</style>
