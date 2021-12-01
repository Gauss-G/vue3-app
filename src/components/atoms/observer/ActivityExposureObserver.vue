<template>
  <div
    :id="observedTargetId"
    ref="observedTarget"
    :style="{ height: height, width: width }"
    :class="{
      'activity-exposure-container': true,
      insert: type === 'insert'
    }"
  />
</template>

<script>
export default {
  name: 'ActivityExposureObserver',
  props: {
    id: {
      type: String,
      required: false,
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
    type: {
      type: String, // 'cover': 覆盖指定元素，'insert': 插入元素之间
      default: 'cover',
    },
    limited: Boolean,
  },
  data() {
    return {
      top: 0,
      left: 0,
      height: 0,
      width: 0,
      hasExposed: false,
    }
  },
  computed: {
    observedTargetId() {
      return `activity-exposure-${this.id}`
    },
    styleObject() {
      return { top: this.top, left: this.left, height: this.height, width: this.width }
    },
  },
  mounted() {
    const parentElement = this.$refs.observedTarget.parentElement
    if (this.type === 'cover')
      this.resolveObserverTargetPosition(parentElement)

    const options = {
      root: this.rootId ? document.querySelector(`#${this.rootId}`) : null,
      rootMargin: this.rootMargin,
      threshold: this.threshold,
    }

    const observer = new IntersectionObserver(this.intersectionObserverProcessor, options)
    const target = document.querySelector(`#${this.observedTargetId}`)

    this.$nextTick(() => {
      if (target)
        observer.observe(target)
    })
  },
  methods: {
    intersectionObserverProcessor(entries) {
      if (this.limited && this.hasExposed) return
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.$emit('exposureEvent')
          this.hasExposed = true
        }
      })
    },
    resolveObserverTargetPosition(parentElement) {
      const actualHeight = parentElement.clientHeight
      const actualWidth = parentElement.clientWidth
      this.height = `${actualHeight}px`
      this.width = `${actualWidth}px`
    },
  },
}
</script>

<style lang="scss" scoped>
.activity-exposure-container {
  position: absolute;
  opacity: 1;
  pointer-events: none;

  &.insert {
    position: relative;
  }
}
</style>
