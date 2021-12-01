<template>
  <div class="iloading">
    <div class="iloading-icon">
      <component :is="type" :type="type" :size="size" :color="color"></component>
    </div>
    <div class="iloading-slot">
      <slot />
    </div>
  </div>
</template>

<script>
import Ballpules from './variants/Ballpules.vue'
import SkapaLoadingBall from './variants/SkapaLoadingBall/index.vue'
export default {
  components: {
    Ballpules,
    SkapaLoadingBall,
  },
  props: {
    // loading动画类型
    type: {
      type: String,
      default: 'SkapaLoadingBall',
    },
    // Small-小 Default默认 Large-大
    size: {
      type: String,
      default: 'medium',
    },
    // 动画元素颜色值
    color: {
      type: String,
      default: '',
    },
  },
}
</script>

<style scoped lang="scss">
.iloading {
  display: inline-block;

  .iloading-icon,
  .iloading-slot {
    display: inline-block;
  }
}
</style>
