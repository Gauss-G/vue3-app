<!-- 弹框组件 -->
<template>
  <div v-if="!isRealTimeRander||show" class="ilayer">
    <teleport v-if="toBody" to="body">
      <component :is="type" v-model:value="show" v-bind="$props" :has-split-line="hasSplitLine" @close="close">
        <slot></slot>
      </component>
    </teleport>
    <template v-else>
      <component :is="type" v-model:value="show" v-bind="$props" :has-split-line="hasSplitLine" @close="close">
        <slot></slot>
      </component>
    </template>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import Bottom from './variants/Bottom.vue'
import Right from './variants/Right.vue'
export default defineComponent({
  components: {
    Bottom,
    Right,
  },
  props: {
    value: {
      type: Boolean,
    },
    /* 弹框类型
     * bottom-从下往上弹
     * right-从右边弹出
     */
    hasSplitLine: {
      type: Boolean,
      default: true,
    },
    type: {
      type: String,
      default: 'bottom',
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
    trackId: {
      type: String,
      default: null,
    },
    maxHeight: {
      type: String,
      default: '',
    },
    toBody: {
      type: Boolean,
      default: false,
    },
    extendedAttributes: {
      type: Object,
      default: () => {
        return {}
      },
    },
    variant: {
      type: String,
      default: 'plain',
      validator: value =>
        ['danger', 'emphasised', 'image-overlay', 'plain', 'primary', 'secondary', 'tertiary'].includes(value),
    },
    // 是否可以蒙层关闭
    maskClosable: {
      type: Boolean,
      default: true,
    },
    // 是否实时实例化
    isRealTimeRander: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['update:value', 'close'],
  data() {
    return {
      show: this.value,
      contentShow: false,
    }
  },
  watch: {
    value(newVal) {
      this.show = newVal
    },
    show(newVal) {
      if (newVal) {
        document.body.style.overflow = 'hidden'
        document.body.style.width = '100%'
        document.body.style.height = '100%'
      }
      else {
        document.body.style.overflow = ''
        document.body.style.width = ''
        document.body.style.height = ''
      }
      this.$emit('update:value', newVal)
    },
  },
  mounted() {},
  beforeUnmount() {
    if (document) {
      document.body.style.overflow = ''
      document.body.style.width = ''
      document.body.style.height = ''
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
  },
})
</script>

<style lang="scss" scoped>
.ilayer {
  position: fixed;
  z-index: 999;
}
</style>
