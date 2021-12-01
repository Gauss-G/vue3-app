<template>
  <div
    ref="observedTarget"
    class="top-header-container"
    :style="{ opacity: opacityVal, display: opacityVal != 0 ? 'flex' : 'none' }"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: 'TopHeaderObserver',
  props: {
    observedTargetId: {
      type: String,
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
      type: Array,
      default: () => {
        return [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
      },
    },
  },
  data() {
    return {
      opacityVal: 0,
    }
  },
  mounted() {
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
     * https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
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
        this.opacityVal = 1 - entry.intersectionRatio
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.top-header-container {
  position: fixed;
  display: flex;
  background: #fff;
  height: 50/100rem;
  padding: 0 20/100rem;
  width: 100vw;
  opacity: 1;
  pointer-events: none;
  z-index: 9999;
}
</style>
