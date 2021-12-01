<template>
  <div v-if="imgUrl || title || des" class="empty-list">
    <div class="empty-list__body">
      <img v-if="imgUrl" v-lazy="imgUrl" :src="imgUrl" class="empty-list__img" alt="empty-box" />
      <h2 v-if="title" class="empty-list__title">
        {{ title }}
      </h2>
      <p v-if="des" class="empty-list__content">
        {{ des }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import base from 'composables/base'
import { defineProps } from 'vue'
const { t } = base()
const props = defineProps({
  imgUrl: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  des: {
    type: String,
    default: '',
  },
})

</script>

<style lang="scss" scoped>
.empty-list {
  position: relative;
  margin: 0 auto;
  padding: 0.88rem 0 0.2rem;
  width: 100%;
  display: flex;
  justify-content: center;
  text-align: center;

  .empty-list__body {
    padding: 0 0.4rem 0;
    text-align: center;

    .empty-list__img {
      width: 1rem;
      display: block;
      margin: 0 auto 0.3rem;
    }

    .empty-list__title {
      font-size: 0.18rem;
      font-weight: $font-weight-bold;
      line-height: 0.26rem;
      color: $colour-neutral-grey-900;
      text-align: center;
      margin: 0 auto 0.12rem;
    }

    .empty-list__content {
      margin: 0 auto;
      color: $colour-neutral-grey-500;
      font-size: 0.14rem;
      line-height: 0.21rem;
      text-align: center;
    }
  }
}
</style>
