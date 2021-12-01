<template>
  <div>
    <div class="draw-wrapper" :class="{ show: drawShow, hide: !drawShow }">
      <div class="mask" @click="closeIcon" />
      <div class="cus_container" @mouseleave="closeIcon">
        <div class="rooms_box">
          <div class="rooms_box_over">
            <a
              v-for="(item, index) in list"
              :key="index"
              class="room_item"
              :href="urlPath(item.link)"
              :data-track-id="dataTrackId"
              :data-track-label="item.title"
            >
              <div class="room_item-img disable-event" :style="{ background: 'url(' + item.image + ') center no-repeat' }" />
              <div class="room-name disable-event">
                {{ item.title }}
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import { useI18n } from 'vue-i18n'
import { generateLink } from '@/utils/index'
const props = defineProps({
  list: {
    type: Array,
    default: () => {
      return []
    },
  },
  dataTrackId: {
    type: String,
    default: null,
  },
})
const { locale } = useI18n()
const urlPath = (url) => {
  if (!url?.includes('http'))
    return generateLink(url, locale.value)
  else
    return url
}
const emits = defineEmits(['close'])
const closeIcon = () => {
  emits('close')
}
</script>
<style lang="scss" scoped>
.draw-wrapper {
  position: absolute;
  // top: .6rem;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow-y: scroll;
  z-index: 1000;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  .mask {
    position: fixed;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.4);
    z-index: 1001;
    overflow: hidden;
  }

  .cus_container {
    background-color: #fff;
    width: 100%;
    // height: 70%;
    max-height: 560px;
    overflow-y: scroll;
    border-top: 1px solid #f5f5f5;
    position: relative;
    z-index: 10002;
    min-width: 10rem;
    display: flex;
    justify-content: center;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }

    .rooms_box {
      width: 100%;
      max-width: 14.4rem;
      min-width: 10rem;
      padding-top: 0.4rem;
      margin: 0 auto;
      height: 100%;
      overflow: auto;
      padding-left: 1rem;

      .rooms_box_over {
        width: 100%;
        margin: 0 auto;
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
      }
    }
  }
}

.rooms_box {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.room_item {
  width: 2.4rem;
  border-radius: 4px;
  margin-right: 0.2rem;
  margin-bottom: 0.4rem;
  cursor: pointer;
  // display: flex;
  // flex-direction: column;
  display: inline-block;

  .room_item-img {
    width: 100%;
    height: 1.35rem;
    background-size: auto 100% !important;
    background-color: #e5e5e5 !important;
    border-radius: 0.04rem 0.04rem 0 0;
  }

  .room-name {
    padding: 0.1rem 0.2rem;
    font-size: 0.14rem;
    line-height: 0.2rem;
    text-align: center;
    color: #111;
    background: #f5f5f5;
    border-radius: 0 0 0.04rem 0.04rem;

    /* flex: 1 0 0; */
    flex: 0;
  }
}
</style>
