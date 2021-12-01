<template>
  <div class="not-support">
    <div class="not-support__body">
      <img v-lazy="getImgUrlByPath('/images/h5/noMobile.png')" class="not-support__img" alt="not-support" />
      <h2 class="not-support__title">
        {{ t('layouts.notSupportInMobile.title') }}
      </h2>
      <p class="not-support__content">
        {{ t('layouts.notSupportInMobile.content') }}
      </p>
      <IButton
        v-if="showReturnBtn"
        class="not-support__btn"
        variant="primary"
        small
        @click="goBack"
      >
        <span>{{ t('layouts.notSupportInMobile.btn') }}</span>
      </IButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import base from 'composables/base'
import IButton from 'atoms/IButton/IButton.vue'
import { useRouter } from 'vue-router'
import { getImgUrlByPath } from '@/utils/helper'

const { t } = base()
const router = useRouter()

const props = defineProps({
  showReturnBtn: {
    type: Boolean,
    default: false,
  },
})

const goBack = () => {
  router.back()
}
</script>

<style lang="scss" scoped>
.not-support {
  position: relative;
  padding: 0.8rem 0 0.4rem;
  width: 100%;
  display: flex;
  justify-content: center;
  text-align: center;

  .not-support__body {
    padding: 0 0.4rem 0;
    text-align: center;

    .not-support__img {
      width: 2.4rem;
      display: block;
      margin: 0 auto;
    }

    .not-support__title {
      font-size: 0.16rem;
      line-height: 0.24rem;
      color: $colour-neutral-grey-900;
      margin-top: 0.2rem;
    }

    .not-support__content {
      margin-top: 0.1rem;
      color: $colour-neutral-grey-500;
      font-size: 0.14rem;
      line-height: 0.21rem;
    }

    .not-support__btn {
      margin-top: 0.48rem;
      width: 100%;
      max-width: 3.2rem;
    }
  }
}
</style>
