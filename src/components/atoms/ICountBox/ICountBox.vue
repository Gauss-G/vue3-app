<template>
  <div class="countbox">
    <span class="countbox-icon__click countbox-icon-left" @click.stop="!disabled ? onDecrease() : ''">
      <IIcon
        component-name="MinusSmallIcon"
        size="0.2rem"
        :class="disabled || value <= min ? `countbox-icon__disable` : ''"
      />
    </span>
    <input
      :id="$data.__uuid"
      :value="value"
      class="countbox-inputbox"
      type="number"
      pattern="\d*"
      :max="max"
      :min="min"
      :step="step"
      :disabled="disabled"
      v-bind="$attrs"
      @change="onChange"
      @keyup="onChange"
      @blur="onChange"
    />
    <span class="countbox-icon__click countbox-icon-right" @click.stop="!disabled ? onIncrease() : ''">
      <IIcon
        component-name="PlusSmallIcon"
        size="0.2rem"
        :class="disabled || value >= max ? `countbox-icon__disable` : ''"
      />
    </span>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import IIcon from 'atoms/IIcon/IIcon.vue'

export default defineComponent({
  name: 'ICountBox',

  components: {
    IIcon,
  },

  model: {
    prop: 'value',
    event: 'change',
  },

  props: {
    value: {
      type: Number,
      default: 1,
    },

    label: {
      type: String,
      default: null,
    },

    max: {
      type: Number,
      default: 99,
    },

    min: {
      type: Number,
      default: 1,
    },

    step: {
      type: Number,
      default: 1,
    },

    inputValue: {
      type: Number,
      default: 1,
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['change'],

  methods: {
    onIncrease() {
      this.value < this.max
        && this.$emit('change', {
          value: this.value + this.step,
        })
    },
    onDecrease() {
      this.value > this.min
        && this.$emit('change', {
          value: this.value - this.step,
        })
    },
    onChange(event: InputEvent) {
      const target = event.target as HTMLInputElement

      this.$emit('change', { value: Number(target.value) })

      if (Number(target.value) > this.max)
        target.value = String(this.max)

      if (Number(target.value) < this.min)
        target.value = String(this.min)
    },
  },
})
</script>

<style scoped lang="scss">
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
  margin: 0;
}

/* 火狐 */
input[type='number'] {
  -moz-appearance: textfield;
}

.countbox {
  width: 0.86rem;
  height: 0.32rem;
  position: relative;

  .countbox-inputbox {
    width: 100%;
    height: auto;
    text-align: center;
    font-size: 0.12rem;
    line-height: 0.3rem;
    border: 1px solid #dfdfdf;
    padding-right: 0.3rem;
    padding-left: 0.3rem;
    border-radius: 0.16rem;
    outline: none;
    color: #111;
  }

  .countbox-inputbox:focus {
    border: 1px solid #959595;
  }

  .countbox-icon__click {
    position: absolute;
    top: 0.04rem;
    cursor: pointer;
    color: #000;
    font-size: 0.25rem;
    font-weight: 600;
    width: 0.25rem;
    height: 0.25rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .countbox-icon-left {
    left: 0.08rem;
  }

  .countbox-icon-right {
    right: 0.08rem;
  }

  .countbox-icon__disable {
    color: #dfdfdf;
  }
}
</style>
