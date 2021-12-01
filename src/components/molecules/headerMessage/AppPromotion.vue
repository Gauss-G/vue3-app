<template>
  <div class="container">
    <div class="basic-content" :style="{ color: showDetail ? '#767676' : '' }">
      <div class="basic-title" :style="'background:' + backgroundColor">
        <IIcon class="qrcode-icon" size="0.16rem" component-name="ScanQrCodeIcon" />
        {{ descData.desc }}
      </div>
      <div ref="detailInfo" class="detail-info-container">
        <div class="detail-info">
          <div class="detail-desc">
            {{ descData.descDetail }}
          </div>
          <div class="bottom-images">
            <img :src="appIconSrc" />
            <img :src="descData.qrCodeUrl" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { defineProps, ref } from 'vue'
import { throttle } from 'throttle-debounce'
import IIcon from 'atoms/IIcon/IIcon.vue'
import { getImgUrlByPath } from '@/utils/helper'
const props = defineProps({
  // iconType, desc, descDetail, qrCodeUrl
  descData: {
    type: Object,
    required: true,
  },
  backgroundColor: {
    type: String,
    default: '#111111',
  },
})
const qrCodeIconSrc = getImgUrlByPath('/images/header/apppromotion/qrIcon_w.svg')
const qrCodeIconSrcSelected = getImgUrlByPath('/images/header/apppromotion/qrIcon.svg')
const appIconSrc = getImgUrlByPath('/images/header/apppromotion/IKEAAppIcon.png')
</script>
<style lang="scss" scoped>
.container {
  width: 152px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 0.12rem;
  z-index: 1;

  .basic-content {
    pointer-events: none;
    height: 100%;
  }

  &:hover {
    .detail-info {
      transform: translateY(0);
    }
  }
}

.basic-title {
  height: 100%;
  line-height: 14px;
  width: 152px;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1002;

  .qrcode-icon {
    margin: 0 6px 0 0;
  }

  img {
    vertical-align: middle;
    margin-right: 0.5rem;
  }

  &:hover {
    cursor: pointer;
  }
}

.detail-info-container {
  position: relative;
  z-index: 1001;
}

.detail-info {
  position: absolute;
  top: 100%;
  width: 152px;
  height: 138px;
  background: #fbfbfb;
  border-radius: 0 0 4px 4px;
  left: 0;
  z-index: 1;
  transition: 300ms transform;
  transform: translateY(-140px);
}

.detail-desc {
  font-weight: bold;
  font-size: 13px;
  line-height: 19px;
  padding: 0.16rem 0.14rem 0.15rem 0.05rem;
  color: #111;
}

.bottom-images {
  justify-content: space-evenly;
  display: flex;

  img {
    width: 50px;
    height: 50px;
  }
}
</style>
