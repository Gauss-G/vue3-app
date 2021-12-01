<template>
  <div
    :class="[prefixCls]"
    @mouseenter="handleShowPopper"
    @mouseleave="handleClosePopper"
  >
    <div ref="reference" :class="[prefixCls + '-rel']">
      <slot></slot>
    </div>
    <transition name="fade">
      <div
        ref="popper"
        :class="[
          prefixCls + '-popper',
          prefixCls + '-' + theme,
          { hide: !show },
        ]"
        :x-placement="placementVal"
        :style="dropStyles"
        @mouseenter="handleShowPopper"
        @mouseleave="handleClosePopper"
      >
        <div :class="[prefixCls + '-content']">
          <div :class="[prefixCls + '-arrow']"></div>
          <div :class="innerClasses" :style="innerStyles">
            <slot name="content">
              {{ content }}
            </slot>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script setup>
import { ref, defineProps, computed } from 'vue'
import { oneOf } from '@/utils/helper'
const prefixCls = 'itooltip'
const props = defineProps({
  placement: {
    validator(value) {
      return oneOf(value, ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end', 'right', 'right-start', 'right-end'])
    },
    default: 'bottom',
  },
  content: {
    type: [String, Number],
    default: '',
  },
  delay: {
    type: Number,
    default: 100,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  controlled: { // under this prop,Tooltip will not close when mouseleave
    type: Boolean,
    default: false,
  },
  always: {
    type: Boolean,
    default: false,
  },
  theme: {
    validator(value) {
      return oneOf(value, ['dark', 'light'])
    },
    default: 'dark',
  },
  maxWidth: {
    type: [String, Number],
    default: '',
  },
})
const visible = ref(false)
const placementVal = ref(props.placement)
const dropStyles = ref({})
const reference = ref(null)
const popper = ref(null)
let timeout = null
// 计算popper的位置
const initPlacement = () => {
  const referenceDome = reference.value.getBoundingClientRect()
  const popperDome = popper.value.getBoundingClientRect()
  const center = popperDome.width / 2 - referenceDome.width / 2
  dropStyles.value = {
    left: `${-center}px`,
  }
}

const show = computed(() => {
  const showValue = !props.disabled && (visible.value || props.always)
  if (showValue) initPlacement()
  return showValue
})
const innerStyles = computed(() => {
  const styles = {}
  if (props.maxWidth) styles['max-width'] = `${props.maxWidth}px`
  return styles
})
const innerClasses = computed(() => {
  return [
    `${prefixCls}-inner`,
    {
      [`${prefixCls}-inner-with-width`]: !!props.maxWidth,
    },
  ]
})
const handleShowPopper = (e) => {
  if (timeout) clearTimeout(timeout)
  timeout = setTimeout(() => {
    visible.value = true
  }, props.delay)
}
const handleClosePopper = () => {
  if (timeout) {
    clearTimeout(timeout)
    if (!props.controlled) {
      timeout = setTimeout(() => {
        visible.value = false
      }, 100)
    }
  }
}

</script>
<style scoped>
.hide {
  visibility: hidden;
  opacity: 0;
  z-index: -1 !important;
}

.itooltip {
  display: inline-block;
  position: relative;
}

.itooltip-rel {
  display: inline-block;
  position: relative;
  width: inherit;
}

.itooltip-popper {
  display: block;
  visibility: visible;
  font-size: 12px;
  line-height: 1.5;
  position: absolute;
  z-index: 1060;
}

.itooltip-popper[x-placement^="top"] {
  padding: 5px 0 8px 0;
}

.itooltip-popper[x-placement^="right"] {
  padding: 0 5px 0 8px;
}

.itooltip-popper[x-placement^="bottom"] {
  padding: 8px 0 5px 0;
}

.itooltip-popper[x-placement^="left"] {
  padding: 0 8px 0 5px;
}

.itooltip-popper[x-placement^="top"] .itooltip-arrow {
  bottom: 3px;
  border-width: 5px 5px 0;
  border-top-color: rgba(70, 76, 91, 0.9);
}

.itooltip-popper[x-placement="top"] .itooltip-arrow {
  left: 50%;
  margin-left: -5px;
}

.itooltip-popper[x-placement="top-start"] .itooltip-arrow {
  left: 16px;
}

.itooltip-popper[x-placement="top-end"] .itooltip-arrow {
  right: 16px;
}

.itooltip-popper[x-placement^="right"] .itooltip-arrow {
  left: 3px;
  border-width: 5px 5px 5px 0;
  border-right-color: rgba(70, 76, 91, 0.9);
}

.itooltip-popper[x-placement="right"] .itooltip-arrow {
  top: 50%;
  margin-top: -5px;
}

.itooltip-popper[x-placement="right-start"] .itooltip-arrow {
  top: 8px;
}

.itooltip-popper[x-placement="right-end"] .itooltip-arrow {
  bottom: 8px;
}

.itooltip-popper[x-placement^="left"] .itooltip-arrow {
  right: 3px;
  border-width: 5px 0 5px 5px;
  border-left-color: rgba(70, 76, 91, 0.9);
}

.itooltip-popper[x-placement="left"] .itooltip-arrow {
  top: 50%;
  margin-top: -5px;
}

.itooltip-popper[x-placement="left-start"] .itooltip-arrow {
  top: 8px;
}

.itooltip-popper[x-placement="left-end"] .itooltip-arrow {
  bottom: 8px;
}

.itooltip-popper[x-placement^="bottom"] .itooltip-arrow {
  top: 3px;
  border-width: 0 5px 5px;
  border-bottom-color: rgba(70, 76, 91, 0.9);
}

.itooltip-popper[x-placement="bottom"] .itooltip-arrow {
  left: 50%;
  margin-left: -5px;
}

.itooltip-popper[x-placement="bottom-start"] .itooltip-arrow {
  left: 16px;
}

.itooltip-popper[x-placement="bottom-end"] .itooltip-arrow {
  right: 16px;
}

.itooltip-light.itooltip-popper {
  display: block;
  visibility: visible;
  font-size: 12px;
  line-height: 1.5;
  position: absolute;
  z-index: 1060;
}

.itooltip-light.itooltip-popper[x-placement^="top"] {
  padding: 7px 0 10px 0;
}

.itooltip-light.itooltip-popper[x-placement^="right"] {
  padding: 0 7px 0 10px;
}

.itooltip-light.itooltip-popper[x-placement^="bottom"] {
  padding: 10px 0 7px 0;
}

.itooltip-light.itooltip-popper[x-placement^="left"] {
  padding: 0 10px 0 7px;
}

.itooltip-light.itooltip-popper[x-placement^="top"] .itooltip-arrow {
  bottom: 3px;
  border-width: 7px 7px 0;
  border-top-color: rgba(217, 217, 217, 0.5);
}

.itooltip-light.itooltip-popper[x-placement="top"] .itooltip-arrow {
  left: 50%;
  margin-left: -7px;
}

.itooltip-light.itooltip-popper[x-placement="top-start"] .itooltip-arrow {
  left: 16px;
}

.itooltip-light.itooltip-popper[x-placement="top-end"] .itooltip-arrow {
  right: 16px;
}

.itooltip-light.itooltip-popper[x-placement^="right"] .itooltip-arrow {
  left: 3px;
  border-width: 7px 7px 7px 0;
  border-right-color: rgba(217, 217, 217, 0.5);
}

.itooltip-light.itooltip-popper[x-placement="right"] .itooltip-arrow {
  top: 50%;
  margin-top: -7px;
}

.itooltip-light.itooltip-popper[x-placement="right-start"] .itooltip-arrow {
  top: 8px;
}

.itooltip-light.itooltip-popper[x-placement="right-end"] .itooltip-arrow {
  bottom: 8px;
}

.itooltip-light.itooltip-popper[x-placement^="left"] .itooltip-arrow {
  right: 3px;
  border-width: 7px 0 7px 7px;
  border-left-color: rgba(217, 217, 217, 0.5);
}

.itooltip-light.itooltip-popper[x-placement="left"] .itooltip-arrow {
  top: 50%;
  margin-top: -7px;
}

.itooltip-light.itooltip-popper[x-placement="left-start"] .itooltip-arrow {
  top: 8px;
}

.itooltip-light.itooltip-popper[x-placement="left-end"] .itooltip-arrow {
  bottom: 8px;
}

.itooltip-light.itooltip-popper[x-placement^="bottom"] .itooltip-arrow {
  top: 3px;
  border-width: 0 7px 7px;
  border-bottom-color: rgba(217, 217, 217, 0.5);
}

.itooltip-light.itooltip-popper[x-placement="bottom"] .itooltip-arrow {
  left: 50%;
  margin-left: -7px;
}

.itooltip-light.itooltip-popper[x-placement="bottom-start"] .itooltip-arrow {
  left: 16px;
}

.itooltip-light.itooltip-popper[x-placement="bottom-end"] .itooltip-arrow {
  right: 16px;
}

.itooltip-light.itooltip-popper[x-placement^="top"] .itooltip-arrow::after {
  content: " ";
  bottom: 1px;
  margin-left: -7px;
  border-bottom-width: 0;
  border-top-width: 7px;
  border-top-color: #fff;
}

.itooltip-light.itooltip-popper[x-placement^="right"] .itooltip-arrow::after {
  content: " ";
  left: 1px;
  bottom: -7px;
  border-left-width: 0;
  border-right-width: 7px;
  border-right-color: #fff;
}

.itooltip-light.itooltip-popper[x-placement^="bottom"] .itooltip-arrow::after {
  content: " ";
  top: 1px;
  margin-left: -7px;
  border-top-width: 0;
  border-bottom-width: 7px;
  border-bottom-color: #fff;
}

.itooltip-light.itooltip-popper[x-placement^="left"] .itooltip-arrow::after {
  content: " ";
  right: 1px;
  border-right-width: 0;
  border-left-width: 7px;
  border-left-color: #fff;
  bottom: -7px;
}

.itooltip-inner {
  max-width: 250px;
  min-height: 34px;
  padding: 8px 12px;
  color: #fff;
  text-align: left;
  text-decoration: none;
  background-color: rgba(70, 76, 91, 0.9);
  border-radius: 4px;
  -webkit-box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
  white-space: nowrap;
}

.itooltip-inner-with-width {
  white-space: pre-wrap;
  text-align: justify;
}

.itooltip-light .itooltip-inner {
  background-color: #fff;
  color: #515a6e;
}

.itooltip-arrow {
  position: absolute;
  width: 0;
  height: 0;
  border-color: transparent;
  border-style: solid;
}

.itooltip-light .itooltip-arrow {
  border-width: 8px;
}

.itooltip-light .itooltip-arrow::after {
  display: block;
  width: 0;
  height: 0;
  position: absolute;
  border-color: transparent;
  border-style: solid;
  content: "";
  border-width: 7px;
}
</style>
