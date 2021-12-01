<template>
  <teleport to="body">
    <div ref="icascader" class="icascader">
      <div v-if="show" class="icascader-search">
        <div class="control-mide" @click="close"></div>
        <div class="control-panel" :class="{ 'control-show': contentShow }">
          <div class="control-header">
            <div class="control-header-title">
              {{ t('address.select_address') }}
            </div>
            <!-- <img :src="utils.getImgUrlByPath('/images/cart/closeService.svg')" alt="" srcset="" @click="close" /> -->
            <i-icon component-name="CrossSmallIcon" size=".3rem" @click="close" />
          </div>
          <div class="control-content">
            <div class="icascader-panel">
              <!-- 已选择的列表 -->
              <div class="search-selected">
                <div class="selected-list">
                  <ul>
                    <li
                      v-for="(item, index) in selectedList"
                      :key="index"
                      :class="{ act: level === index }"
                      @click.stop="toggleLevel(index)"
                    >
                      {{ item.item.name }}
                    </li>
                  </ul>
                </div>
                <label v-if="list.length > 0 && activeIndex === -1">{{
                  point.levelPlaceholderList[level] || point.levelPlaceholder
                }}</label>
              </div>
              <!-- 热门选项 -->
              <div v-if="isHaveHot && hotList.length > 0" class="search-hot">
                <label>{{ point.hotTitle }}</label>
                <span v-for="(item, index) in hotList" :key="index" @click.stop="select(item)">{{ item.hotName }}</span>
              </div>
              <!-- 搜索列表 -->
              <div class="search-list">
                <ul>
                  <li
                    v-for="(item, index) in list"
                    :key="index"
                    :class="{ act: index === activeIndex }"
                    @click.stop="select(item, index)"
                  >
                    <label v-if="item.letter">
                      {{ index > 0 ? (list[index - 1].letter === item.letter ? '' : item.letter) : item.letter }}</label><span>{{ item.name }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, reactive, onMounted, watch, defineProps, defineEmits, nextTick, onUnmounted } from 'vue'
import IIcon from 'atoms/IIcon/IIcon.vue'
import ICascaderConter from './ICascader.ts'

const props = defineProps({
  value: {
    type: Boolean,
  },
  // 默认值
  text: {
    type: String,
    default: '',
  },
  // 选项数据
  data: {
    type: Array,
    default() {
      return []
    },
  },
  // 配置项对应point字段
  options: {
    type: Object,
    default() {
      return {}
    },
  },
  // 是否支持搜索功能
  isSearch: {
    type: Boolean,
    default: false,
  },
  // 是否开启热门选项
  isHaveHot: {
    type: Boolean,
    default: false,
  },
})
const emits = defineEmits(['close', 'change', 'update:text', 'update:value'])
const {
  t,
  selectText,
  show,
  keyword,
  selectedList,
  level,
  list,
  activeIndex,
  searchList,
  hotList,
  point,
  isInit,
  updateValue,
  syncPoint,
  setList,
  getSelectText,
  toggleLevel,
  setSelectListByValue,
  searchSelect,
  setSearchList,
  select,
} = ICascaderConter(props, emits)
watch(() => selectText.value, (newVal) => {
  updateValue.value = 1
  emits('update:text', newVal)
})
watch(() => props.options, () => {
  syncPoint()
})
watch(() => props.data, () => {
  setSearchList()
})
watch(() => props.isSearch, () => {
  setSearchList()
})

const contentShow = ref(false)
watch(() => props.value, (newVal) => {
  show.value = props.value
  if (show.value) {
    document.body.style.cssText = 'overflow: hidden;width:100%;height:100%;'
    if (props.text && selectedList.length <= 0) {
      isInit.value = true
      setSelectListByValue(props.text)
      isInit.value = false
    }
    else {
      setList()
    }
  }
  else {
    document.body.style.cssText = ''
  }
  if (newVal) {
    setTimeout(() => {
      contentShow.value = newVal
    }, 100)
  }
})
watch(() => props.text, (newVal) => {
  if (updateValue.value) {
    updateValue.value = 0
    return
  }
  selectText.value = newVal
  if (!newVal) {
    selectedList.value = []
    selectText.value = ''
    keyword.value = ''
    activeIndex.value = -1
    level.value = 0
    return
  }
  setSelectListByValue(newVal)
})
onMounted(() => {
  isInit.value = true
  setSearchList()
  if (props.text)
    setSelectListByValue(props.text)

  syncPoint()
  isInit.value = false
  if (props.value) {
    document.body.style.cssText = 'overflow: hidden;width:100%;height:100%;'
    setList()
    show.value = true
    contentShow.value = true
  }
  else {
    document.body.style.cssText = ''
  }
})
const close = () => {
  contentShow.value = false
  document.body.style.cssText = ''
  emits('close')
  setTimeout(() => {
    show.value = false
  }, 500)
}
watch(() => show.value, () => {
  if (!show.value)close()
  emits('update:value', show.value)
})
</script>

<style scoped lang="scss">
.icascader-search {
  .icascader-panel {
    // padding: 0.2rem 0;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .search-hot {
    // height: 0.36rem;
    padding: 0.2rem 0.2rem 0.15rem 0.2rem;
    font-size: 0.12rem;

    label {
      color: #959595;
      display: block;
      padding: 0 0 0.15rem 0;
      text-align: left;
    }

    span {
      background: #f5f5f5;
      border-radius: 100px;
      height: 0.36rem;
      line-height: 0.36rem;
      min-width: 0.6rem;
      display: inline-block;
      text-align: center;
      padding: 0 0.1rem;
      cursor: pointer;
      margin-right: 0.1rem;

      &:last-child {
        margin: 0;
      }
    }
  }

  .search-list {
    padding: 0.2rem;
    flex: 1;
    overflow-y: auto;
    // &::-webkit-scrollbar {
    //   /*滚动条整体样式*/
    //   width: 8/16rem;
    //   /*高宽分别对应横竖滚动条的尺寸*/
    //   background: #ffffff;
    // }
    // &::-webkit-scrollbar-thumb {
    //   /*滚动条里面小方块*/
    //   border-radius: 5/16rem;
    //   background: #d8d8d8;
    // }
    // &::-webkit-scrollbar-track {
    //   /*滚动条里面轨道*/
    //   background: #ffffff;
    // }
    li {
      cursor: pointer;
      font-size: 0.14rem;
      min-height: 0.22rem;
      padding: 0.1rem 0;
      color: #111;
      display: flex;
      align-items: center;
      white-space: nowrap;

      label {
        width: 0.2rem;
        display: inline-block;
        color: #959595;
      }

      &:hover {
        background: #f5f5f5;
      }
    }

    .act {
      color: #0058a3;
    }
  }

  .search-selected {
    font-size: 0.14rem;
    height: 0.6rem;
    display: flex;
    align-items: center;
    white-space: nowrap;
    color: #111;
    // border-top: 1px solid #f2f2f2;
    padding: 0 0.2rem;
    border-bottom: 1px solid #f2f2f2;

    label {
      color: #0058a3;
      font-weight: bold;
    }

    .selected-list {
      li {
        display: inline-block;
        margin-right: 0.1rem;
        cursor: pointer;
      }

      .act {
        color: #0058a3;
      }
    }
  }
}

.control-mide {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(17, 17, 17, 0.3);
  z-index: 998;
}

.control-panel {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background: #fff;
  transition: all 0.3s ease;
  transform: translateY(100%);
  z-index: 999;
  height: 80%;
  overflow-y: auto;
  border-radius: 0.1rem 0.1rem 0 0;
  padding-top: 0.48rem;

  .control-header {
    height: 0.48rem;
    text-align: center;
    line-height: 0.48rem;
    color: #111;
    font-weight: bold;
    border-bottom: 0.01rem solid #f2f2f2;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    img {
      position: absolute;
      top: 0.08rem;
      right: 0.09rem;
      font-size: 0.3rem;
      z-index: 102;
    }
  }

  .control-content {
    height: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
}

.control-show {
  transform: translateY(0) !important;
}

.control-panel .control-header i {
  position: absolute;
  top: 0.08rem;
  right: 0.09rem;
  font-size: 0.3rem;
  z-index: 102;
}
</style>
