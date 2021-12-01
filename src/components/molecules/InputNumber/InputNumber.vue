<template>
  <div class="inputNumber">
    <div class="number-box" @click.stop="1">
      <button class="quantity-btn quantity-decrease" @click.stop="number <= min || !disabled ? '' : reduceBtn()">
        <!-- <Icon
          type="md-remove"
          size="16"
          :class="{ colorDf: !disabled }"
          class="icon-btn"
          :style="{
            color: number <= min || !disabled ? '#dfdfdf' : '#111',
            fontWeight: number <= min || !disabled ? '400' : '700'
          }"
        /> -->
        <i-icon
          size="0.2rem"
          :class="{ colorDf: !disabled }"
          :style="{
            color: number <= min || !disabled ? '#dfdfdf' : '#111',
            fontWeight: number <= min || !disabled ? '400' : '700'
          }"
          component-name="MinusSmallIcon"
          class="icon-btn"
        />
      </button>
      <input
        v-model="number"
        class="amount-input"
        :maxlength="max"
        :minlength="min"
        type="tel"
        pattern="\d*"
        :disabled="!disabled"
        @click.stop="1"
        @input="quantityChange($event)"
        @focus="focusInput()"
        @blur="blursInput()"
      />
      <button class="quantity-btn quantity-increase" @click.stop="number >= max || !disabled ? '' : addBtn()">
        <!-- <Icon
          type="md-add"
          size="16"
          :style="{
            color: number >= max || !disabled ? '#dfdfdf' : '#111',
            fontWeight: number >= max || !disabled ? '400' : '700'
          }"
          :class="{ colorDf: !disabled }"
          class="icon-btn"
        /> -->
        <i-icon
          size="0.2rem"
          :class="{ colorDf: !disabled }"
          :style="{
            color: number >= max || !disabled ? '#dfdfdf' : '#111',
            fontWeight: number >= max || !disabled ? '400' : '700'
          }"
          component-name="PlusSmallIcon"
          class="icon-btn"
        />
      </button>
    </div>
  </div>
</template>

<script>
import IIcon from 'atoms/IIcon/IIcon.vue'
export default {
  name: 'InputNumber',
  components: {
    IIcon,
  },
  props: {
    value: {
      type: Number,
      default: 1,
    },
    disabled: {
      type: Boolean,
      default: true,
    },
    max: {
      type: Number,
      default: 99,
    },
    min: {
      type: Number,
      default: 1,
    },
  },
  emits: ['update:value', 'change'],
  data() {
    return {
      number: this.value,
    }
  },
  watch: {
    value(newVal) {
      this.number = newVal
    },
  },
  methods: {
    // 减的按钮
    reduceBtn() {
      this.number--
      if (this.number <= this.min)
        this.number = this.min

      this.change('reduce')
    },
    // 加的按钮
    addBtn() {
      this.number++
      if (this.number >= this.max)
        this.number = this.max
      this.change('add')
    },
    focusInput() {},
    blursInput() {
      if (!this.number)
        this.number = 1
    },
    // 输入框输入
    quantityChange(event) {
      this.number = event.target.value.replace(/[^0-9]/g, '')
      if (this.number.startsWith('0')) this.number = ''
      if (this.number) {
        this.number = Math.floor(this.number)
        if (this.number > this.max)
          this.number = this.max
      }
      this.change('input')
    },
    change(type) {
      this.$emit('update:value', this.number)
      this.$emit('change', { type, number: this.number })
    },
  },
}
</script>

<style lang="scss" scoped>
.inputNumber {
  display: inline-block;
  position: relative;
}

.number {
  font-style: normal;
  font-weight: normal;
  font-size: 0.12rem;
  line-height: 0.27rem;
  color: #666;
}

.number-box {
  max-width: 1.2rem;
  min-width: 0.84rem;
  // width: 0.84rem;
  height: 0.4rem;
  position: relative;
  display: flex;
  border: 0.01rem solid #dfdfdf;
  box-sizing: border-box;
  border-radius: 0.24rem;
  align-items: center;
  justify-content: space-between;
  // margin-bottom: 0.08rem;
  padding: 0.1rem;

  .quantity-btn {
    background: none;
    text-decoration: none;
    border: 0;
    display: flex;
    align-items: center;
    outline: none;
  }

  .amount-input {
    font-size: 0.12rem;
    line-height: 0.16rem;
    color: #111;
    height: 0.2rem;
    outline: 0;
    border: 0;
    margin: 0.02rem;
    width: 0.2rem;
    text-align: center;
  }
}

.selectDf {
  .number-box {
    width: 0.84rem;
    height: 0.32rem;
    position: relative;
    display: flex;
    border: 0.01rem solid #dfdfdf;
    box-sizing: border-box;
    border-radius: 0.24rem;
    align-items: center;
    justify-content: center;

    .quantity-btn {
      background: none;
      text-decoration: none;
      border: 0;
      display: flex;
      align-items: center;
    }

    .amount-input {
      font-size: 0.12rem;
      line-height: 0.16rem;
      color: #dfdfdf;
      width: 0.2rem;
      height: 0.2rem;
      outline: 0;
      border: 0;
      margin: 0.02rem 0.05rem;
      text-align: center;
    }

    .quantity-decrease {
      position: absolute;
      left: 0.4rem;
    }
  }
}
</style>
