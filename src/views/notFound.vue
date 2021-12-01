<template>
  <div class="error-page">
    <div class="error__content">
      <div class="error__img__wrapper">
        <video
          :src="getImgUrlByPath('/ufo.mp4')"
          class="error__img"
          autoplay
          loop
          muted
          playsinline
        />
      </div>
      <div class="error__title">
        {{ t('not_found.sorry') }}
      </div>
      <div class="error__commit">
        {{ t('not_found.not_find') }}
      </div>
      <div class="error__des">
        {{ t('not_found.help') }}
      </div>
      <div class="error__control">
        <IButton class="error__btn" variant="primary" @click="goBack">
          <span>{{ t('links.back_to_home_page') }}</span>
        </IButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import base from 'composables/base'
import { getImgUrlByPath } from '@/utils/helper'
import { generateLink } from '@/utils'
import IButton from '@/components/atoms/IButton/IButton.vue'

const { t, locale } = base()

const goBack = () => {
  if (location)
    location.href = generateLink('/', locale.value)
}
</script>

<style lang="scss">
.error-page {
  position: relative;
  width: 100%;
  margin: auto;
  text-align: center;
  min-height: 100px;
  padding: 0.6rem 0.4rem 1.6rem;

  .error__content {
    color: $colour-feedback-error;
    min-height: 0.6rem;
    line-height: 0.6rem;
    font-size: 0.36rem;
    margin-top: 0.4rem;

    .error__img__wrapper {
      position: relative;
      width: 100%;
      margin: 0 auto;
      padding: 0 0.4rem;
    }

    .error__img {
      position: relative;
      margin: 0 auto;
      width: 100%;
      min-width: 1.6rem;
      max-width: 3.2rem;
      object-fit: cover;
      object-position: center;
    }

    .error__title {
      font-weight: $font-weight-bold;
      font-size: 0.14rem;
      line-height: 0.21rem;
      color: $colour-neutral-grey-900;
      margin: 0.4rem auto 0;
    }

    .error__commit {
      margin: 0.2rem auto 0;
      font-weight: normal;
      font-size: 0.14rem;
      line-height: 0.21rem;
      color: $colour-neutral-grey-500;
    }

    .error__des {
      margin: 0 auto;
      font-weight: normal;
      font-size: 0.14rem;
      line-height: 0.21rem;
      color: $colour-neutral-grey-500;
    }

    .error__control {
      margin: 0.4rem auto 0;

      .error__btn {
        width: 1.35rem;
      }
    }
  }
}

@media screen and (min-width: 900px) {
  .error-page {
    .error__title {
      font-size: 0.28rem !important;
      line-height: 0.36rem !important;
    }

    .error__commit,
    .error__des {
      font-size: 0.16rem !important;
      line-height: 0.28rem !important;
    }
  }
}
</style>
