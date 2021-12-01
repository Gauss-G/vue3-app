<template>
  <div class="layout-item">
    <div v-if="title" class="layout-item-title">
      <span class="layout-item-title-text">{{ title }}</span>
      <span v-if="type==='del'" class="title-del" @click="handleDelClick">{{ t('cart.delete') }}</span>
    </div>
    <ul v-for="(item, index) in list" :key="index">
      <li class="layout-itemItem" @click="handleclick(item, index)">
        {{ item.text || item.name || '' }}
      </li>
    </ul>
  </div>
</template>
<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const props = defineProps({
  data: {
    type: Array,
    default: () => {
      return []
    },
  },
  type: {
    type: String,
    default: '',
  },
  searchType: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  postion: {
    type: [Number, String],
    default: 0,
  },
})
const emits = defineEmits(['click', 'delClick'])
const list = ref(props.data)
watch(() => props.data, () => {
  list.value = props.data
})
const handleclick = (item, index) => {
  // this.$gio.trackSearchSuccess({
  //   ifSearchResult: true,
  //   searchWord: key,
  //   searchType: this.searchType,
  //   modulePosition: this.postion,
  //   position: index
  // }) // 搜索结果点击
  emits('click', item, index)
}
const handleDelClick = () => {
  emits('delClick')
}
</script>
<style lang="scss" scoped>
.layout-item {
  position: relative;
}

.layout-item-title {
  margin-bottom: 30px;

  .layout-item-title-text {
    font-style: normal;
    white-space: nowrap;
    font-weight: 600;
    font-size: 14px;
    line-height: 21px;
    color: #111;
  }

  .title-del {
    font-size: 12px;
    line-height: 18px;
    margin-left: 5px;
    color: #484848;
  }

  .title-del:hover {
    text-decoration: underline;
    cursor: pointer;
  }
}

.layout-itemItem {
  margin-bottom: 20px;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 24px;
  color: #111;
}

.layout-itemItem:hover {
  text-decoration: underline;
  cursor: pointer;
}
</style>
