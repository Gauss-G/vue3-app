<template>
  <div ref="refScrollbar" class="i-scrollbar" @mouseenter.stop="handleMouseEnter" @mouseleave.stop="handleMouseLeave">
    <template v-if="arrow">
      <arrow :visible="showLeftArrow" :size="size" :variant="variant" @scroll="throttledArrowScroll" />
      <arrow
        :visible="showRightArrow"
        :size="size"
        :variant="variant"
        direction="Right"
        @scroll="throttledArrowScroll"
      />
    </template>
    <div
      ref="wrap"
      :class="[wrapClass, 'i-scrollbar__wrap', native ? '' : 'i-scrollbar__wrap--hidden-default']"
      :style="wrapStyle"
      @scroll="handleScroll"
    >
      <component :is="tag" ref="resize" :class="['i-scrollbar__view', viewClass]" :style="viewStyle">
        <slot></slot>
      </component>
    </div>
    <template v-if="!native">
      <bar v-show="showHorizontal && showBar" :move="moveX" :size="sizeWidth" :wrapper="wrapper" :scrollbar="scrollbar" />
      <bar
        v-show="showVertical && showBar"
        :vertical="true"
        :move="moveY"
        :size="sizeHeight"
        :wrapper="wrapper"
        :scrollbar="scrollbar"
      />
    </template>
  </div>
</template>

<script setup >
import { ref, defineProps, defineEmits, onMounted, computed, watch, nextTick } from 'vue'
import { throttle } from 'throttle-debounce'
import Bar from './bar.vue'
import Arrow from './arrow.vue'
const props = defineProps({
  syncScroll: {
    type: Boolean,
    default: false,
  },
  syncMove: {
    type: Object,
    default: () => ({
      moveX: 0,
      moveY: 0,
    }),
  },
  showScrollControl: {
    type: Boolean,
    default: true,
  },
  showScrollbar: {
    type: Boolean,
    default: true,
  },
  showArrow: {
    type: Boolean,
    default: true,
  },
  direction: {
    type: String,
    default: 'horizontal',
    validator(val) {
      return ['horizontal', 'vertical'].includes(val)
    },
  },
  arrow: {
    type: Boolean,
    default: true,
  },
  height: {
    type: [String, Number],
    default: '',
  },
  maxHeight: {
    type: [String, Number],
    default: '',
  },
  native: {
    type: Boolean,
    default: false,
  },
  wrapStyle: {
    type: [String, Array],
    default: '',
  },
  wrapClass: {
    type: [String, Array],
    default: '',
  },
  viewClass: {
    type: [String, Array],
    default: '',
  },
  viewStyle: {
    type: [String, Array],
    default: '',
  },
  noresize: Boolean, // 如果 container 尺寸不会发生变化，最好设置它可以优化性能
  nohover: {
    type: Boolean,
    default: false,
  },
  tag: {
    type: String,
    default: 'div',
  },
  size: {
    type: String,
    default: 'normal',
    validator(val) {
      return ['small', 'normal', 'large'].includes(val)
    },
  },
  variant: {
    type: String,
    default: 'primary',
    validator: value =>
      ['danger', 'emphasised', 'image-overlay', 'plain', 'primary', 'secondary', 'tertiary'].includes(value),
  },
  scrollStep: {
    type: Number,
    default: null,
  },
})
const emits = defineEmits(['scroll'])
const sizeWidth = ref('0')
const sizeHeight = ref('0')
const moveX = ref(0)
const moveY = ref(0)
const hover = ref(false)
const hasRightOffset = ref(false)
const hasLeftOffset = ref(false)

// refs const
const wrap = ref(null)
const refScrollbar = ref(null)
const resize = ref(null)
const showLeftArrow = computed(() => {
  return (hover.value || props.nohover || props.showArrow) && hasLeftOffset.value && props.showScrollControl
})
const showRightArrow = computed(() => {
  return (hover.value || props.nohover || props.showArrow) && hasRightOffset.value && props.showScrollControl
})
const showHorizontal = computed(() => {
  return props.direction === 'horizontal' && props.showScrollControl
})
const showVertical = computed(() => {
  return props.direction === 'vertical' && props.showScrollControl
})
const wrapper = computed(() => {
  return wrap.value
})
const scrollbar = computed(() => {
  return refScrollbar.value
})
const showBar = computed(() => {
  if (!wrap.value)
    return false

  return props.direction === 'horizontal'
    ? wrap.value.clientWidth < wrap.value.scrollWidth
    : wrap.value.clientHeight < wrap.value.scrollHeight
})

const handleMouseEnter = () => {
  hover.value = true
}
const handleMouseLeave = () => {
  hover.value = false
}
const handleArrowScroll = (payload) => {
  const timeInterval = 10
  const scrollOffset
        = payload.direction === 'Right'
          ? props.scrollStep || wrap.value.clientWidth
          : (props.scrollStep || wrap.value.clientWidth) * -1
  const scrollStep = +(scrollOffset / 30).toFixed(0)

  let stepIndex = 0
  const smoothScroll = () => {
    wrap.value.scrollLeft += scrollStep
    stepIndex++

    if (stepIndex < 30)
      setTimeout(smoothScroll, timeInterval)
  }

  setTimeout(smoothScroll, timeInterval)
}
const handleScroll = () => {
  const partwrap = wrap.value
  if (!partwrap) return

  moveY.value = (partwrap.scrollTop * 100) / partwrap.clientHeight
  moveX.value = (partwrap.scrollLeft * 100) / partwrap.clientWidth

  hasRightOffset.value
        = props.direction === 'horizontal'
      ? partwrap.clientWidth + partwrap.scrollLeft < partwrap.scrollWidth
      : partwrap.clientHeight + partwrap.scrollHeight < partwrap.scrollHeight
  hasLeftOffset.value = partwrap.scrollLeft > 0

  emits('scroll', { moveX: moveX.value, moveY: moveY.value })
}

const update = () => {
  const partwrap = wrap.value
  if (!partwrap) return

  const heightPercentage = (partwrap.clientHeight * 100) / partwrap.scrollHeight
  const widthPercentage = (partwrap.clientWidth * 100) / partwrap.scrollWidth

  sizeHeight.value = heightPercentage < 100 ? `${heightPercentage}%` : ''
  sizeWidth.value = widthPercentage < 100 ? `${widthPercentage}%` : ''

  hasRightOffset.value
        = props.direction === 'horizontal'
      ? partwrap.clientWidth + partwrap.scrollLeft < partwrap.scrollWidth
      : partwrap.clientHeight + partwrap.scrollHeight < partwrap.scrollHeight
  hasLeftOffset.value = partwrap.scrollLeft > 0
}

const throttledArrowScroll = throttle(300, true, (payload) => {
  handleArrowScroll(payload)
})

const handleSyncMoveChanged = () => {
  const partwrap = wrap.value
  if (!partwrap) return

  partwrap.scrollTop = props.syncMove.moveY * partwrap.clientHeight / 100
  partwrap.scrollLeft = props.syncMove.moveX * partwrap.clientWidth / 100
}

watch(() => props.syncMove, () => {
  if (props.syncScroll)
    handleSyncMoveChanged()
})

onMounted(() => {
  if (props.native) return
  nextTick(update)
  if (!props.noresize) {
    resize.value.__ro__ = new ResizeObserver(update)
    resize.value.__ro__.observe(resize.value)
  }
})
</script>

<style scoped>
.i-scrollbar {
  position: relative;
  height: 100%;
}

.i-scrollbar__wrap {
  overflow: auto;
  height: 100%;
}

.i-scrollbar__wrap--hidden-default {
  scrollbar-width: none;
}

.i-scrollbar__wrap--hidden-default::-webkit-scrollbar {
  display: none;
}
</style>
