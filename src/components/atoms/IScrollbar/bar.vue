<template>
  <transition name="i-scrollbar-fade">
    <div ref="instance" :class="['i-scrollbar__bar', 'is-' + barConfig.key]" @mousedown="clickTrackHandler">
      <div
        ref="thumb"
        :class="['i-scrollbar__thumb', 'is-' + barConfig.key, { 'is-active': cursorDown }]"
        :style="thumbStyle"
        @mousedown="clickThumbHandler"
      ></div>
    </div>
  </transition>
</template>

<script>
const BAR_CONFIG = {
  vertical: {
    offset: 'offsetHeight',
    scroll: 'scrollTop',
    scrollSize: 'scrollHeight',
    size: 'height',
    key: 'vertical',
    axis: 'Y',
    client: 'clientY',
    direction: 'top',
  },
  horizontal: {
    offset: 'offsetWidth',
    scroll: 'scrollLeft',
    scrollSize: 'scrollWidth',
    size: 'width',
    key: 'horizontal',
    axis: 'X',
    client: 'clientX',
    direction: 'left',
  },
}

const renderThumbStyle = ({ move, size, bar }) => {
  const style = {}
  const translate = `translate${bar.axis}(${move}%)`

  style[bar.size] = size
  style.transform = translate
  style.msTransform = translate
  style.webkitTransform = translate

  return style
}

export default {
  name: 'Bar',
  props: {
    vertical: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: '',
    },
    move: {
      type: Number,
      default: 0,
    },
    wrapper: {
      type: Object,
      default() {
        return {}
      },
    },
    scrollbar: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      isActive: false,
      /**
       * 默认false, 用户鼠标点击时设置为true
       */
      cursorDown: false,
      cursorLeave: false,
      thumbPositionPercentage: 0,
      /**
       * 维护Bar的实时状态
       */
      barState: {},
      // wrapper: this.$parent.wrapper,
      // scrollbar: this.$parent.scrollbar,
    }
  },
  computed: {
    // wrapper() {
    //   return this.$parent.wrapper
    // },
    // scrollbar() {
    //   return this.$parent.scrollbar
    // },
    barConfig() {
      return BAR_CONFIG[this.vertical ? 'vertical' : 'horizontal']
    },
    thumbStyle() {
      return renderThumbStyle({
        size: this.size,
        move: this.move,
        bar: this.barConfig,
      })
    },
  },
  unmounted() {
    document?.removeEventListener('mouseup', this.mouseUpDocumentHandler)
  },
  methods: {
    /**
     * 支持用户鼠标点击触发scroll滚动
     */
    clickThumbHandler(e) {
      // prevent click event of middle and right button
      e.stopPropagation()
      if (e.ctrlKey || [1, 2].includes(e.button))
        return

      this.startDrag(e)
      this.barState[this.barConfig.axis]
        = e.currentTarget[this.barConfig.offset]
        - (e[this.barConfig.client] - e.currentTarget.getBoundingClientRect()[this.barConfig.direction])
    },
    clickTrackHandler(e) {
      const thumb = this.$refs.thumb
      const instance = this.$refs.instance
      if (!thumb || !instance) return

      const offset = Math.abs(e.target.getBoundingClientRect()[this.barConfig.direction] - e[this.barConfig.client])
      const thumbHalf = thumb[this.barConfig.offset] / 2
      const thumbPositionPercentage = ((offset - thumbHalf) * 100) / instance[this.barConfig.offset]
      // eslint-disable-next-line vue/no-mutating-props
      this.wrapper[this.barConfig.scroll] = (thumbPositionPercentage * this.wrapper[this.barConfig.scrollSize]) / 100
    },
    /**
     * 鼠标点击事件释放后，重置bar的移动距离为0
     */
    mouseUpDocumentHandler() {
      this.cursorDown = false
      this.barState[this.barConfig.axis] = 0
      // 注销鼠标移动事件监听
      document?.removeEventListener('mousemove', this.mouseMoveDocumentHandler)

      // document.onselectstart = onselectstartStore
      if (this.cursorLeave)
        this.visible = false
    },
    /**
     * 响应鼠标的移动事件，触发wrapper的scroll
     */
    mouseMoveDocumentHandler(e) {
      if (!this.cursorDown) return

      const thumb = this.$refs.thumb
      const instance = this.$refs.instance
      if (!thumb || !instance) return

      const prevPage = this.barState[this.barConfig.axis]

      if (!prevPage) return

      const offset = (instance.getBoundingClientRect()[this.barConfig.direction] - e[this.barConfig.client]) * -1
      const thumbClickPosition = thumb[this.barConfig.offset] - prevPage
      const thumbPositionPercentage = ((offset - thumbClickPosition) * 100) / instance[this.barConfig.offset]

      // eslint-disable-next-line vue/no-mutating-props
      this.wrapper[this.barConfig.scroll] = (thumbPositionPercentage * this.wrapper[this.barConfig.scrollSize]) / 100
    },
    startDrag(e) {
      e.stopImmediatePropagation()
      this.cursorDown = true
      document?.addEventListener('mousemove', this.mouseMoveDocumentHandler)
      document?.addEventListener('mouseup', this.mouseUpDocumentHandler)

      document.onselectstart = () => false
    },
  },
}
</script>

<style lang="scss" scoped>
.i-scrollbar__bar {
  position: absolute;
  display: flex;
  right: 2px;
  bottom: 2px;
  z-index: 1;
  border-radius: 4px;
  background: inherit;
  transition: 300ms all;

  .i-scrollbar__thumb {
    position: relative;
    display: block;
    margin: auto 0;
    width: 0;
    height: 0;
    cursor: pointer;
    border-radius: inherit;
    background-color: #111;
    -webkit-transition: 0.3s background-color;
    transition: 0.3s all;

    &.is-vertical {
      width: 2px;
      top: 2px;
      margin: 0;
    }

    &.is-horizontal {
      height: 2px;
      left: 2px;

      &.is-active {
        height: 8px;
      }

      &::after {
        content: '';
        width: 100%;
      }
    }

    &.is-horizontal:hover {
      height: 4px;

      &.is-active {
        height: 8px;
      }
    }
  }
}

.i-scrollbar__bar.is-vertical {
  width: 12px;
  height: 100%;
}

.i-scrollbar__bar.is-horizontal {
  height: 12px;
  width: 100%;

  &::after {
    position: absolute;
    content: '';
    width: 100%;
    height: 2px;
    transform: translateX(0%);
    top: 5px;
    background: #dfdfdf;
    z-index: -1;
  }
}

.i-scrollbar-fade-enter-active {
  -webkit-transition: opacity 340ms ease-out;
  transition: opacity 340ms ease-out;
}

.i-scrollbar-fade-leave-active {
  -webkit-transition: opacity 120ms ease-out;
  transition: opacity 120ms ease-out;
}

.i-scrollbar-fade-enter-from,
.i-scrollbar-fade-leave-active {
  opacity: 0;
}
</style>
