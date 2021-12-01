<template>
  <div v-if="isH5" class="addressItem" :class="{ selected: item.check }" @click="check">
    <div class="addressItem-name">
      {{ item.name }} + {{ item.mobile }}
    </div>
    <div class="addressItem-detail">
      {{ item.province }} {{ item.city }} {{ item.district }} {{ item.detailAddress }}
    </div>
  </div>
  <div v-else class="addressItem pc-addressItem" @click="check">
    <div class="addressItem-name">
      {{ item.name }}
    </div>
    <div class="addressItem-tel">
      {{ item.mobile }}
    </div>
    <div class="addressItem-detail">
      {{ item.province }} {{ item.city }} {{ item.district }} {{ item.detailAddress }}
    </div>
    <div class="check" :class="{ checked: item.check }"></div>
    <div class="edit" @click.stop="edit"></div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import base from 'composables/base'
const { isH5 } = base()
const props = defineProps({
  item: {
    type: Object,
    default() {
      return {
        check: false,
      }
    },
  },
  // 是否可选
  isCheck: {
    type: Boolean,
    default: false,
  },
  // 是否有编辑功能
  isEdit: {
    type: Boolean,
    default: false,
  },
})
const emits = defineEmits(['check', 'edit'])
const check = () => {
  if (!props.isCheck) return
  // this.item?.check = true
  emits('check', props.item)
}
const edit = () => {
  emits('edit', props.item)
}
</script>

<style scoped lang="scss">
.addressItem {
  cursor: pointer;
  padding: 0.2rem;
  // border-bottom: 1px solid #dfdfdf;
  position: relative;
  border: 1px solid #e7e7e7;
  box-sizing: border-box;
  border-radius: 5px;
  font-size: 0.14rem;
  line-height: 0.22rem;

  &.selected {
    border: 2px solid #0058a3;
  }

  .addressItem-name {
    font-style: normal;
    font-weight: 700;
    color: #000;
  }

  .addressItem-detail {
    color: #666;
  }
}

.pc-addressItem {
  border: 0;
  border-bottom: 1px solid #dfdfdf;
  border-radius: 0;
  padding: 0.2rem 0;

  .addressItem-name {
    margin-bottom: 0.2rem;
  }

  .check {
    width: 0.24rem;
    height: 0.24rem;
    border-radius: 0.24rem;
    border: 1px solid #484848;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1;

    &::before {
      content: '';
      width: 0.48rem;
      height: 0.48rem;
      position: absolute;
      left: -0.12rem;
      top: -0.12rem;
      z-index: 1;
    }
  }

  .checked {
    border: 1px solid #111;

    &::after {
      content: '';
      position: absolute;
      left: 3px;
      top: 3px;
      right: 3px;
      bottom: 3px;
      background-color: #111;
      border-radius: 100px;
    }
  }
}
</style>
