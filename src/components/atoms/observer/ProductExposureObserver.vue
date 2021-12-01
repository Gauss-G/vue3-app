<template>
  <div
    :id="observedTargetId"
    ref="observedTarget"
    class="product-exposure-container"
  />
</template>

<script>
export default {
  name: 'ProductExposureObserver',
  props: {
    product: {
      type: Object,
      required: true,
    },
    extendedAttributes: {
      type: Object,
      default: () => {
        return {}
      },
    },
    targetId: {
      type: String,
      required: false,
      default: null,
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
      allowRepeatingTrigger: false,
      triggeredCount: 0,
    }
  },
  computed: {
    observedTargetId() {
      return this.targetId || `product-exposure-${this.product.id}-${this._uid}`
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
          if (this.allowRepeatingTrigger) {
            this.$gio.trackExposureProductEvent(this.product, this.extendedAttributes)
            this.triggeredCount++
          }
          else if (this.triggeredCount === 0) {
            this.$gio.trackExposureProductEvent(this.product, this.extendedAttributes)
            this.triggeredCount++
          }
        }
      })
    },
    resolveObserverTargetPosition(parentElement) {
      const actualHeight = parentElement.clientHeight
      const actualWidth = parentElement.clientWidth / 2
      this.height = `${actualHeight}px`
      this.width = `${actualWidth}px`
    },
  },
}
</script>

<style lang="scss" scoped>
.product-exposure-container {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  opacity: 1;
  pointer-events: none;
  width: 100%;
  height: 100%;
}
</style>
