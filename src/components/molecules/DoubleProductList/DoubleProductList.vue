<template>
  <div v-if="list.length > 0" id="content" class="result_list">
    <div span="12" class="left_col result_list-col">
      <ProductListItem
        v-for="(item, index) in listLeft"
        :key="index"
        :index="index"
        :item="item"
        :data-track-id="dataTrackId"
        :module-id="dataTrackId"
      />
    </div>
    <div span="12" class="right_col result_list-col">
      <ProductListItem
        v-for="(item, index) in listRight"
        :key="index"
        :index="index"
        :item="item"
        :data-track-id="dataTrackId"
        :module-id="dataTrackId"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, watchEffect, onMounted } from 'vue'
import ProductListItem from 'molecules/ProductListItem/ProductListItem.vue'
const props = defineProps({
  list: {
    type: Array,
    require: true,
    default: () => [],
  },
  dataTrackId: {
    type: String,
    default: '',
  },
})
const listLeft = ref([])
const listRight = ref([])

const defaultData = () => {
  const left = []
  const right = []
  props.list.forEach((element, index) => {
    if (index % 2 === 1)
      right.push(element)
    if (index % 2 === 0)
      left.push(element)
  })
  listLeft.value = left
  listRight.value = right

  // return arr
}
watchEffect(props.list, () => {
  defaultData()
})
onMounted(() => {
  defaultData()
})
</script>
<style lang="scss" scoped>
.result_list {
  padding: 0.1rem 0.1rem;
  position: relative;
  display: flex;
  justify-content: space-between;
  z-index: 9;
  overflow: hidden;
  background-color: #f5f5f5;

  .result_list-col {
    width: 50%;
    box-sizing: border-box;

    .PerProduct {
      margin-bottom: 0.1rem;
    }
  }

  .left_col {
    padding-right: 0.05rem;
  }

  .right_col {
    padding-left: 0.05rem;
  }
}
</style>
