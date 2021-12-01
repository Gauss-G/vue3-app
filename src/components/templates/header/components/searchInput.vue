<template>
  <div class="searchInput">
    <div class="searchInputBox">
      <div class="leftCloseBox" @click="close">
        <img class="leftClose" :src="getImgUrlByPath('/images/close_11.svg')" alt="" />
      </div>
      <div class="rightContent">
        <input
          ref="searchInput"
          v-model="searchKey"
          maxlength="36"
          class="inputSearch"
          :class="showBorder ? 'borderBottom' : ''"
          type="text"
          @keydown="searchDown"
          @focus="focusInput()"
          @blur="showBorder = false"
        />
        <div class="controlBox">
          <div v-if="searchKey" class="closeRightBox" @click="searchKey = ''">
            <img class="closeRight" :src="getImgUrlByPath('/images/close_48.svg')" alt="" />
          </div>
          <div class="searchRightBox" @click="searchKeyFunction">
            <img class="searchRight" :src="getImgUrlByPath('/images/arrow_right.svg')" alt="" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, defineProps, defineEmits, onMounted, watch } from 'vue'
import { getImgUrlByPath } from '@/utils/helper'
const props = defineProps({
  keyWord: {
    type: String,
    default: () => {
      return ''
    },
  },
})
const emits = defineEmits(['changeValue', 'handleSearch', 'close'])
const searchKey = ref(props.keyWord)
const showBorder = ref(false)
watch(() => searchKey.value, () => {
  emits('changeValue', searchKey.value)
})
const focusInput = () => {
  showBorder.value = true
}
const searchKeyFunction = () => {
  emits('handleSearch', searchKey.value)
}
const searchDown = (e) => {
  if (e.keyCode === 13)
    emits('handleSearch', searchKey.value)
}
const close = () => {
  emits('close')
}
// onMounted(()=>{
//    if (this.$refs.searchInput) {
//       this.$refs.searchInput.focus()
//       emits('changeValue', searchKey.value)
//     }
// })
</script>
<style lang="scss" scoped>
.searchInput {
  height: 58px;
  max-width: 1440px;
  margin: 0 auto;
  padding-right: 125px;
  // padding-left: 6.25rem;
  // padding-right: 6.25rem;
  margin-bottom: 34px;

  .searchInputBox {
    position: relative;
  }
}

.leftCloseBox {
  width: 36px;
  height: 36px;
  position: absolute;
  left: 42px;
  top: 8px;
  border-radius: 50%;
  // background: #F5F5F5;
  display: flex;
  justify-content: center;
  align-items: center;
}

.leftCloseBox:hover {
  background: #f5f5f5;
  cursor: pointer;
  transition: all 0.3s;
}
// .leftClose {
//   position: absolute;
//   left: 42px;
//   top: 8px;
// }
.rightContent {
  width: 90%;
  position: absolute;
  left: 125px;
  top: 4px;
  border-bottom: 1px solid #e5e5e5;
  // padding-right: 35px;

  .inputSearch {
    padding-bottom: 26px;
    padding-top: 10px;
    border: none;
    outline: none;
    width: 100%;
    font-size: 16px;
  }

  .borderBottom {
    border-bottom: 1px solid #0058a3 !important;
  }

  .controlBox {
    position: absolute;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    right: 10px;
    top: 10px;
  }

  .closeRightBox {
    position: relative;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin-left: 10px;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    line-height: 27px;
  }

  .closeRightBox:hover {
    background: #c4c4c4;
    cursor: pointer;
    transition: all 0.3s;
  }

  .searchRightBox {
    position: relative;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin-left: 10px;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    line-height: 27px;
  }

  .searchRightBox:hover {
    background: #c4c4c4;
    cursor: pointer;
    transition: all 0.3s;
  }
}
</style>
