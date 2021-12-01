import { ref } from 'vue'
import base from 'composables/base'
import { deepClone } from '@/utils/helper'

export default function ICascaderConter(props, emits) {
  const { t } = base()

  const selectText = ref('') // 显示的选中文案
  const show = ref(false) // 显示选择框
  const keyword = ref('') // 搜索关键字
  const selectedList = ref([]) // 选中的集合
  const level = ref(0) // 当前所看层级 0-代表最外层
  const list = ref([]) // 当前显示的列表数据
  const activeIndex = ref(-1) // 当前选中的索引值
  const searchList = ref([]) // 用于搜索用的数据列表 扁平化后的data数组
  const hotList = ref([]) // 热门选项展示集合
  const point = ref({
    placeholder: t('address.please_select'), // 默认文案 请选择
    levelPlaceholder: t('address.please_select'), // 默认文案 请选择
    levelPlaceholderList: [], // 多层时每层分配不同的选择文案
    hotTitle: t('address.hotCity'), // 默认文案 热门城市
  })
  const isInit = ref(false) // 是否初始化中
  const updateValue = ref(0)

  // 同步提示信息等
  const syncPoint = () => {
    point.value.placeholder = props.options.placeholder || point.value.placeholder
    point.value.hotTitle = props.options.hotTitle || point.value.hotTitle
  }

  // 设置可选项
  const setList = () => {
    if (selectedList.value.length <= 0) {
      level.value = 0
      list.value = props.data
    }
  }
  // 输出文案和当前选项结果
  const getSelectText = () => {
    const list = []
    selectText.value = selectedList.value
      .map((item) => {
        list.push(item.item)
        return item.item.name
      })
      .join('/')
    keyword.value = selectText.value
    if (isInit.value)
      return
    emits('change', { text: selectText.value, list })
  }
  // 切换上级选项 省/市/区
  const toggleLevel = (index) => {
    if (index === level.value) return
    level.value = index
    activeIndex.value = selectedList.value[index].index
    selectedList.value = selectedList.value.splice(0, index === 0 ? 1 : index)
    if (index === 0) {
      list.value = props.data
    }
    else {
      const i = index - 1 >= 0 ? index - 1 : 0
      list.value = selectedList.value[i].item.children
    }
  }

  // 设置默认选中值
  const setSelectListByValue = (value) => {
    const valuelist = value.split('/')
    const searchList = []
    const flatten = function(list, level) {
      list.forEach((item, i) => {
        if (item.name !== valuelist[level]) return
        const mo = {
          index: i,
          level,
          item,
        }
        searchList.push(mo)
        if (item.children.length > 0)
          flatten(item.children, level + 1)
      })
    }
    flatten(props.data, 0)
    level.value = searchList[searchList.length - 1]?.level
    activeIndex.value = searchList[searchList.length - 1]?.index
    let index = level.value - 1
    if (index < 0) index = 0
    list.value = searchList[index].item.children
    selectedList.value = searchList
    getSelectText()
  }
  // 提取父级
  const generateParentList = (item) => {
    const parentlist = []
    const flatten = function(parent) {
      if (!parent) return
      parentlist.push(parent)
      if (parent.parent)
        flatten(parent.parent)
    }
    flatten(item.parent)
    parentlist.reverse()
    return parentlist
  }
  // 搜索结果选中
  const searchSelect = (item) => {
    const parentlist = generateParentList(item)
    const selectList = []
    // 通过索引查询data数据中的位置并组装selectList
    parentlist.forEach((x) => {
      let itemdata = props.data
      for (let i = 0; i <= x.level; i++) {
        itemdata = itemdata[parentlist[i].index]
        if (i !== x.level)
          itemdata = itemdata.children
      }
      selectList.push({
        index: x.index,
        level: x.level,
        item: itemdata,
      })
      level.value = x.level
    })
    selectedList.value = selectList
    let nowItem = {}
    if (item.level > 0)
      nowItem = selectedList.value[item.level - 1]?.item.children[item.index]

    else
      nowItem = props.data[item.index]

    selectedList.value.push({
      index: item.index,
      level: item.level,
      item: nowItem,
    })
    if (nowItem.children && nowItem.children.length > 0) {
      level.value = item.level + 1
      activeIndex.value = -1
      list.value = nowItem.children
    }
    else {
      level.value = item.level
      activeIndex.value = item.index
      list.value = selectedList.value[selectedList.value.length - 2]?.item.children
      show.value = false
      isInit.value = false
    }
    getSelectText()
  }

  // 设置搜索的数据列表和字段为hot的数据
  const setSearchList = () => {
    if ((props.isSearch || props.isHaveHot) && props.data.length > 0) {
      const search = []
      const hot = []
      // 扁平化数组
      const flatten = function(list, level, parent) {
        list.forEach((item, i) => {
          const mo = {
            parent,
            name: item.name,
            letter: item.letter,
            hotName: item.hotName,
            level,
            isSearch: true, // 代表是搜索结果的元素
            index: i,
          }
          if (item.ishot) {
            if (hot.findIndex(hot => hot.name === mo.name) < 0) {
            // 去除重复的热门选项
              hot.push(mo)
            }
          }
          search.push(mo)
          if (item.children.length > 0)
            flatten(item.children, level + 1, mo)
        })
      }
      flatten(deepClone(props.data), 0)
      searchList.value = search
      hotList.value = hot
    }
  }
  // 选中
  const select = (item, index) => {
    if (item.isSearch) {
    // 代表是从搜索结果的点击
      searchSelect(item)
      return
    }
    activeIndex.value = index
    // 设置选中后的数据到selectedList中,保存索引和当前层级
    if (selectedList.value[level.value]) {
      selectedList.value[level.value] = {
        index,
        level: level.value,
        item,
      }
    }
    else {
      selectedList.value.push({
        index,
        level: level.value,
        item,
      })
    }
    if (item.children && item.children.length > 0) {
    // 还有子集继续选择
      level.value += 1
      list.value = item.children
      activeIndex.value = -1
    }
    else {
    // 选到最后一层关闭选项框
      show.value = false
      isInit.value = false
    }
    getSelectText()
  }
  return {
    t,
    props,
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
  }
}
