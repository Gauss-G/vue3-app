<template>
  <div
    :id="observedTargetId"
    ref="observedTarget"
    class="module-exposure-container"
    :style="{ height: height, width: width }"
  />
</template>

<script>
export default {
  name: 'ModuleExposureObserver',
  props: {
    observedTargetId: {
      type: String,
      required: true,
    },
    /**
     * the meta information about module and position
     */
    trackId: {
      type: String,
      required: true,
    },
    extendedAttributes: {
      type: Object,
      default: () => {
        return {}
      },
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
    enableTracking: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      height: 0,
      width: 0,
      allowRepeatingTrigger: false,
      triggeredCount: 0,
    }
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
    try {
      this.__target = document.querySelector(`#${this.observedTargetId}`)
    }
    catch (e) {}
    if (!this.__target)
      this.__target = document.getElementById(this.observedTargetId)

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
          this.$emit('isIntersecting')
          if (this.allowRepeatingTrigger) {
            this.enableTracking && this.$gio.trackModuleExposureEvent(this.trackId, this.extendedAttributes)
            this.triggeredCount++
          }
          else if (this.triggeredCount === 0) {
            this.enableTracking && this.$gio.trackModuleExposureEvent(this.trackId, this.extendedAttributes)
            this.triggeredCount++
          }
        }
      })
    },
    resolveObserverTargetPosition(parentElement) {
      // const actualHeight = parentElement.clientHeight
      const actualWidth = parentElement.clientWidth
      this.height = '1px'
      this.width = `${actualWidth}px`
    },
  },
}
</script>

<style lang="scss" scoped>
.module-exposure-container {
  position: absolute;
  opacity: 1;
  pointer-events: none;
}
</style>
