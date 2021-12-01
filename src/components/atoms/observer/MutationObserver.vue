<template>
  <!--
  observerDom:监听dom节点
  observerActions: 回调事件
  https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver
  https://www.zhangxinxu.com/wordpress/2019/08/js-dom-mutation-observer/
 -->
  <div />
</template>

<script lang="ts" setup>
import { ref, defineProps, computed, defineEmits, onMounted, onBeforeUnmount } from 'vue'

const emit = defineEmits(['observerAction'])
const props = defineProps({
  // 监听的dom节点
  observerDom: {
    type: Array,
    require: true,
    default: () => [],
  },
  // 监听配置
  observeOption: {
    type: Object,
    require: false,
    default: () => {
      return {
        childList: true,
        attributes: true,
        subtree: true,
        characterData: true,
      }
    },
  },
})

const observer = ref<any>(null)
const observeDomList = computed(() => {
  return props.observerDom
})

const mutationsObserver = () => {
  observer.value = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
      emit('observerAction', mutation)
    })
  })
  if (observeDomList.value.length) {
    observeDomList.value.forEach((observeDom) => {
      observer.value.observe(observeDom, props.observeOption)
    })
  }
}

onMounted(() => {
  mutationsObserver()
})

onBeforeUnmount(() => {
  if (observeDomList.value && observeDomList.value.length && observer.value)
    observer.value.disconnect()
})
</script>
