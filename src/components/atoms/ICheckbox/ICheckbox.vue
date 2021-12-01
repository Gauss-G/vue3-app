<template>
  <div :class="['checkbox', { 'checkbox--subtle': subtle }]">
    <input
      :id="uuid"
      :value="inputValue"
      :checked="isChecked"
      :disabled="disabled"
      :indeterminate.prop="indeterminate"
      v-bind="$attrs"
      type="checkbox"
      @change="onChange"
    />
    <span
      :class="[
        'checkbox__symbol',
        {
          'circle-style': circleStyle,
          'black-color': blackColor && isChecked
        }
      ]"
    />
    <span v-if="$slots.label || label" class="checkbox__label">
      <label :for="uuid">
        <span v-if="!$slots.label">{{ label }}</span>
        <slot v-if="!label" name="label" />
      </label>
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'ICheckbox',

  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      type: [Array, Boolean],
      default: false,
    },

    label: {
      type: String,
      default: null,
    },

    indeterminate: {
      type: Boolean,
      default: false,
    },

    inputValue: {
      type: String,
      default: null,
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    subtle: {
      type: Boolean,
      default: false,
    },

    circleStyle: {
      type: Boolean,
      default: false,
    },

    blackColor: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['change'],
  data() {
    return {
      uuid: Math.random().toString(36).slice(4),
    }
  },

  computed: {
    isChecked(): boolean {
      return Array.isArray(this.value) ? this.value.includes(this.inputValue) : this.value
    },
  },

  methods: {
    onChange(event: InputEvent) {
      const target = event.target as HTMLInputElement

      if (Array.isArray(this.value)) {
        this.$emit(
          'change',
          target.checked ? [...this.value, this.inputValue] : this.value.filter(value => value !== this.inputValue),
        )
      }
      else {
        this.$emit('change', !this.value)
      }
    },
  },
})
</script>

<style scoped lang="scss">
@import 'node_modules/@ingka/forms/mixins';
@import '../custom';

@include checkbox();

.circle-style {
  border-radius: 0.16rem;
}

.black-color {
  background: #111 !important;
}
</style>
