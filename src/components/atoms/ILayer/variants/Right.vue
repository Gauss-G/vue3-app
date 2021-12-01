<!-- 弹框组件 -->
<template>
  <div v-show="show">
    <!-- <module-exposure-observer
      v-if="trackId"
      :observed-target-id="`i-layer-right-${_uid}`"
      :track-id="trackId"
      :extended-attributes="extendedAttributes"
    /> -->
    <div class="control-mide" :class="{ 'cont-mide-show': contentShow }" @click="maskClose"></div>
    <div class="control-panel" :class="{ 'cont-show': contentShow }" :style="{ width: contentWidth }">
      <div v-if="headerShow" :class="['control-header', `is-${variant}`, { 'no-title': !title }]">
        <div class="control-header__top">
          <div v-if="showClose" class="control-header__close">
            <i-button
              :variant="variant === 'emphasised' ? 'primary' : 'tertiary'"
              icon="CrossSmallIcon"
              icon-only
              :inverse="variant === 'emphasised'"
              small
              @click="close"
            />
          </div>
        </div>
        <div v-if="title" class="control-header__title">
          <span :class="`is-${variant}`"> {{ title }} </span>
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
import { ref, defineProps, defineEmits, watch, computed, onMounted } from 'vue'
import IIcon from 'atoms/IIcon/IIcon.vue'
import IButton from 'atoms/IButton/IButton.vue'

const props = defineProps({
  value: {
    type: Boolean,
  },
  // 头部标题
  title: {
    type: String,
    default: '',
  },
  // 宽度
  width: {
    type: String,
    default: '',
  },
  // 是否显示头部
  headerShow: {
    type: Boolean,
    default: true,
  },
  // 是否可以蒙层关闭
  maskClosable: {
    type: Boolean,
    default: true,
  },
  // 是否显示关闭按钮
  showClose: {
    type: Boolean,
    default: true,
  },
  variant: {
    type: String,
    default: 'plain',
    validator: value =>
      ['danger', 'emphasised', 'image-overlay', 'plain', 'primary', 'secondary', 'tertiary'].includes(value),
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
})
const emits = defineEmits(['update:value', 'close'])
const show = ref(props.value)
const contentShow = ref(false)
const contentWidth = computed(() => {
  if (props.width) {
    if (props.width.includes('rem') || props.width.includes('px'))
      return props.width
    else
      return `${props.width}px`
  }
  return 'auto'
})
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
  emits('update:value', newVal)
  if (newVal) {
    setTimeout(() => {
      contentShow.value = newVal
    }, 100)
    document.body.style.marginRight = '17px'
    document.body.style.overflow = 'hidden'
  }
  else {
    document.body.style = ''
  }
})
const close = () => {
  if (props.maskClosable) {
    contentShow.value = false
    setTimeout(() => {
      emits('close')
      show.value = false
    }, 500)
  }
}
const maskClose = () => {
  if (props.maskClosable)
    close()
}
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
  right: 0;
  bottom: 0;
  max-width: 50%;
  min-width: 500px;
  height: 100%;
  background: #fff;
  transition: all 0.4s ease;
  transform: translateX(100%);
  z-index: 999;
  display: flex;
  flex-direction: column;

  .control-header {
    position: relative;
    display: block;
    color: #111;
    font-weight: bold;

    &.is-emphasised {
      background-color: #0058a3;
    }

    .control-header__title {
      display: block;
      padding: 0 0.5rem 0.1rem;
      text-align: left;
      color: #111;
      font-size: 0.24rem;
      font-weight: bold;
      line-height: 0.35rem;

      .is-emphasised {
        color: #fff;
      }
    }

    .control-header__top {
      position: relative;
      width: 100%;
      height: 0.8rem;
    }

    .control-header__close {
      position: absolute;
      margin: auto;
      right: 0.2rem;
      top: 50%;
      transform: translateY(-50%);
      display: block;
      cursor: pointer;
    }
  }

  .no-title {
    border: 0;
  }

  .control-content {
    flex: 1;
    overflow-y: auto;
  }
}

.cont-show {
  transform: translateX(0) !important;
}
</style>
