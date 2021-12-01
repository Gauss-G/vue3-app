<template>
  <div class="i-example">
    <slot /> 
  </div>
</template>

<script lang="ts">
import { 
  defineComponent,
  onMounted
} from 'vue'

export default defineComponent({
  name: 'IExample',

  props: {
    example: {
      type: String,
      required: true,
      default: ''
    }
  },

  setup (props) {
    onMounted (() => {
      console.log(props.example)
    })
  }
})
</script>

<style lang="scss">
.i-example {
  /**
   * DESC:
   * your style
   */
}
</style>
