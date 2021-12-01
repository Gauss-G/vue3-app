<!-- 弹框组件 -->
<template>
  <div v-if="show">
    <!--   <module-exposure-observer
      :observed-target-id="`i-layer-bottom-${_uid}`"
      :track-id="trackId || `i-layer-bottom-${_uid}`"
      :extended-attributes="extendedAttributes"
    /> -->
    <div class="control-mide" :class="{ 'cont-mide-show': contentShow }" @click="close"></div>
    <div class="control-panel" :class="{ 'cont-show': contentShow }" :style="{maxHeight:maxHeight?maxHeight:''}">
      <div v-if="headerShow" :class="['control-header', hasSplitLine ? 'show' : '']">
        <div v-if="title" class="service-header-title">
          {{ title }}
        </div>
        <!-- <i-button
          class="close-button"
          icon="close-small"
          variant="tertiary"
          icon-only
          small
          xsmall-icon-only
          @click="close"
        /> -->
        <div class="close-button" @click="close">
          <IIcon size="0.28rem" component-name="CrossSmallIcon" />
        </div>
      </div>
      <div class="control-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
// import ModuleExposureObserver from '@/components/observer/ModuleExposureObserver'
import { ref, defineProps, defineEmits, watch, onMounted } from 'vue'
import IIcon from 'atoms/IIcon/IIcon.vue'
const props = defineProps({
  value: {
    type: Boolean,
  },
  hasSplitLine: {
    type: Boolean,
    default: true,
  },
  // 头部标题
  title: {
    type: String,
    default: '',
  },
  // 是否显示头部
  headerShow: {
    type: Boolean,
    default: true,
  },
  maxHeight: {
    type: String,
    default: '',
  },
  trackId: {
    type: String,
    default: null,
  },
  extendedAttributes: {
    type: Object,
    default: () => {
      return {}
    },
  },
  // 是否可以蒙层关闭
  maskClosable: {
    type: Boolean,
    default: true,
  },
})
const emit = defineEmits(['update:value', 'close'])
const show = ref(props.value)
const contentShow = ref(false)
const close = () => {
  if (props.maskClosable) {
    contentShow.value = false
    setTimeout(() => {
      emit('close')
      show.value = false
    }, 500)
  }
}
watch(() => props.value, (newVal) => {
  if (contentShow.value && !newVal) {
    contentShow.value = false
    setTimeout(() => {
      show.value = false
    }, 500)
  }
  else {
    show.value = newVal
  }
})
watch(show, (newVal) => {
  emit('update:value', newVal)
  if (newVal) {
    setTimeout(() => {
      contentShow.value = newVal
    }, 100)
  }
})
onMounted(() => {
  if (props.value) {
    setTimeout(() => {
      contentShow.value = true
    }, 100)
  }
})
</script>

<style lang="scss" scoped>
.control-mide {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(17, 17, 17, 0.3);
  -webkit-transition: opacity 0.5s ease, visibility 0.5s ease;
  transition: opacity 0.5s ease, visibility 0.5s ease;
  visibility: hidden;
  opacity: 0;
  z-index: 998;
}

.cont-mide-show {
  opacity: 1;
  visibility: visible;
}

.control-panel {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  max-height: 90%;
  background: #fff;
  transition: all 0.5s ease;
  transform: translateY(100%);
  z-index: 999;
  border-radius: 0.1rem 0.1rem 0 0;
  display: flex;
  flex-direction: column;

  .control-header {
    height: 0.48rem;
    text-align: center;
    line-height: 0.48rem;
    position: relative;
    color: #111;
    font-weight: bold;

    &.show {
      border-bottom: 0.01rem solid #f2f2f2;
    }

    .close-button {
      position: absolute;
      top: 0.1rem;
      right: 0.1rem;
      z-index: 102;
    }
  }

  .control-content {
    flex: 1;
    overflow-y: auto;
  }
}

.cont-show {
  transform: translateY(0) !important;
}
</style>
