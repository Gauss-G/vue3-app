<template>
  <div
    :id="observedTargetId"
    ref="observedTarget"
    :style="{ height: height, width: width }"
    class="section-exposure-container"
  />
</template>

<script>
export default {
  name: 'SectionExposureObserver',
  props: {
    observedTargetId: {
      type: String,
      required: false,
      default: null,
    },
    observedFunction: {
      type: Function,
      required: false,
      default: () => {},
    },
    meta: {
      type: Object,
      required: true,
    },
    rootId: {
      type: String,
      required: false,
      default: null,
    },
    rootMargin: {
      type: String,
      required: false,
      default: '0px',
    },
    threshold: {
      type: Number,
      default: 1.0,
    },
  },
  data() {
    return {
      top: 0,
      left: 0,
      height: 0,
      width: 0,
    }
  },
  computed: {
    styleObject() {
      return { top: this.top, left: this.left, height: this.height, width: this.width }
    },
  },
  mounted() {
    const parentElement = this.$refs.observedTarget.parentElement
    this.resolveObserverTargetPosition(parentElement)

    const options = {
      root: this.rootId ? document.querySelector(`#${this.rootId}`) : null,
      rootMargin: this.rootMargin,
      threshold: this.threshold,
    }

    this.__observer = new IntersectionObserver(this.intersectionObserverProcessor, options)
    this.__target = document.querySelector(`#${this.observedTargetId}`)

    this.$nextTick(() => {
      if (this.__target)
        this.__observer.observe(this.__target)
    })
  },
  beforeUnmount() {
    if (this.__observer && this.__target)
      this.__observer.unobserve(this.__target)
  },
  methods: {
    /**
     * Each entry describes an intersection change for one observed
     * boundingClientRect
     * intersectionRatio
     * intersectionRect
     * isIntersecting
     * isVisible
     * rootBounds
     * target
     */
    intersectionObserverProcessor(entries) {
      entries.forEach((entry) => {
        // Check if the target is visible in root viewpoint
        if (entry.isIntersecting) {
          if (typeof this.observedFunction === 'function')
            this.observedFunction(this.meta)
        }
      })
    },
    resolveObserverTargetPosition(parentElement) {
      const actualHeight = parentElement.clientHeight + 132
      const actualWidth = parentElement.clientWidth
      this.height = `${actualHeight}px`
      this.width = `${actualWidth}px`
    },
  },
}
</script>

<style lang="scss" scoped>
.section-exposure-container {
  position: absolute;
  opacity: 1;
  pointer-events: none;
}
</style>
