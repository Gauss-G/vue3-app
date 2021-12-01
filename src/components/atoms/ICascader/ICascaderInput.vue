<template>
  <div ref="icascader" class="icascader">
    <div class="icascader-from">
      <div class="icascader-from-input" @click="toggleSelect">
        <label :class="{ 'label-top': selectText || (isSearch && show) }">{{ point.placeholder }}</label>
        <input
          v-if="isSearch"
          ref="searchInput"
          v-model="keyword"
          type="text"
          @click.stop="toggleSelect"
          @input="search"
        />
        <p v-else>
          {{ selectText }}
        </p>
      </div>
      <i :class="{ upicon: show }"></i>
    </div>
    <div v-if="show" class="icascader-search">
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
</template>

<script setup lang='ts'>
import { ref, reactive, onMounted, watch, defineProps, defineEmits, nextTick, onUnmounted } from 'vue'
import ICascaderConter from './ICascader.ts'
import { debounce } from '@/utils/helper'
const props = defineProps({
  value: {
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
const emits = defineEmits(['close', 'change', 'update:value'])

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
const toggleSelect = () => {
  if (show.value) {
    show.value = false
    // if (props.isSearch)
    // $refs.searchInput.blur()
  }
  else {
    // if (props.isSearch)
    // $refs.searchInput.focus()
    setList()
    show.value = true
  }
}

// 搜索
const search = debounce(() => {
  if (!keyword.value) {
    setList()
    return
  }
  show.value = true
  const text = keyword.value.toLocaleUpperCase()
  selectedList.value = []
  level.value = 0
  activeIndex.value = -1
  list.value = searchList.value.filter(x => x.letter.includes(text) || x.name.includes(keyword.value))
}, 500)
watch(() => props.value, (newVal) => {
  const text = newVal?._value ? newVal?._value : newVal
  // 防止通过勾选已有地址选择数据，不更新搜索框数据
  if (updateValue.value && text === keyword.value) {
    updateValue.value = 0
    return
  }
  isInit.value = true
  selectText.value = text

  if (!text) {
    selectedList.value = []
    selectText.value = ''
    keyword.value = ''
    activeIndex.value = -1
    level.value = 0
    return
  }
  setSelectListByValue(text)
})
watch(() => selectText.value, (newVal) => {
  updateValue.value = 1
  emits('update:value', newVal)
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
const icascader = ref(null)
const handleBodyClick = (event) => {
  if (!show.value) return
  if (icascader.value && !icascader.value.contains(event.target))
    show.value = false
}
onMounted(() => {
  setSearchList()
  if (props.value && !selectText.value) {
    selectText.value = props.value
    setSelectListByValue(props.value)
  }
  nextTick(() => {
    document.addEventListener('click', handleBodyClick)
  })
  syncPoint()
})
onUnmounted(() => {
  document.removeEventListener('click', handleBodyClick)
})
</script>

<style scoped lang="scss">
.icascader-search {
  position: absolute;
  top: 100%;
  width: 100%;
  background-color: white;
  left: 0;
  border: 1px solid #dfdfdf;
  border-top: 0;
  padding: 0.16rem 0.1rem;
  z-index: 999;
  // max-height: 0;
  // transition: max-height 300ms;
  // overflow: hidden;
  .search-selected {
    position: relative;
    margin: 0 0 0.04rem;
    font-size: 0.14rem;
    line-height: 0.22rem;
    min-height: 30px;
    color: #111;

    label {
      color: #0058a3;
      font-weight: bold;
    }

    .selected-list {
      li {
        display: inline-block;
        margin-right: 0.16rem;
        cursor: pointer;

        &:last-child {
          margin-right: 0;
        }
      }

      .act {
        color: #0058a3;
      }
    }
  }

  .search-list {
    min-height: 2rem;
    max-height: 3rem;
    overflow-y: auto;

    &::-webkit-scrollbar {
      /* 滚动条整体样式 */
      width: 0.08rem;

      /* 高宽分别对应横竖滚动条的尺寸 */
      background: #fff;
    }

    &::-webkit-scrollbar-thumb {
      /* 滚动条里面小方块 */
      border-radius: 0.05rem;
      background: #d8d8d8;
    }

    &::-webkit-scrollbar-track {
      /* 滚动条里面轨道 */
      background: #fff;
    }

    li {
      cursor: pointer;
      font-size: 0.14rem;
      line-height: 0.37rem;
      height: 0.37rem;
      color: #111;

      label {
        width: 0.16rem;
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

  .search-hot {
    position: relative;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    line-height: 0.3rem;

    label {
      color: #959595;
      display: inline-block;
      text-align: center;
      padding: 0 0.15rem 0 0;
      line-height: 0.3rem;
      margin-bottom: 0.04rem;
    }

    span {
      background: #f5f5f5;
      border-radius: 100px;
      height: 0.3rem;
      min-width: 0.52rem;
      display: inline-block;
      text-align: center;
      padding: 0 0.1rem;
      cursor: pointer;
      margin-bottom: 0.04rem;
      margin-right: 0.1rem;

      &:last-child {
        margin: 0;
      }
    }
  }
}
// .icascader-search-show{
//   max-height: 400/16rem;
// }
.icascader {
  position: relative;

  .icascader-from {
    font-size: 0.16rem;
    line-height: 0.26rem;
    color: #48484848;

    .icascader-from-input {
      border-bottom: 1px solid #000;
      padding: 0.05rem 0;
      cursor: pointer;
      padding-right: 17px;
    }

    label {
      transition: all 300ms;
      transform: translateY(20px);
      position: relative;
      display: block;
      height: 25px;
      color: #484848;
      cursor: pointer;
    }

    .label-top {
      font-size: 0.12rem;
      line-height: 0.18rem;
      transform: translateY(0);
    }

    input,
    p {
      border: 0;
      display: block;
      outline: none;
      font-size: 0.16rem;
      line-height: 1;
      width: 100%;
      color: #111;
      min-height: 16px;
      cursor: pointer;
    }

    i {
      position: absolute;
      right: 2px;
      margin-top: -5px;
      width: 10px;
      height: 10px;
      border-top: 3px solid #111;
      border-right: 3px solid #111;
      z-index: 1;
      transform: rotateZ(135deg);
      bottom: 13px;
      transition: all 300ms;
    }

    .upicon {
      transform: rotateZ(-45deg);
    }
  }
}
</style>
