<template>
  <section v-if="item" class="iVideo" @click="handleClick">
    <video
      :id="videoId + item.url"
      ref="videoRef"
      class="iVideo__box"
      :playsinline="true"
      :poster="poster || item.coverUrl"
      :src="item.url"
      :muted="true"
      preload="metadata"
      :controls="showControl"
    />
    <div v-if="!playing" class="iVideo__playBtn">
      <IIcon size="0.24rem" :component-name="!playing ? 'PlayIcon' : 'PauseIcon'" />
    </div>
  </section>
</template>

<script>
import IIcon from '@/components/atoms/IIcon/IIcon.vue'

export default {
  components: { IIcon },
  props: {
    showControl: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      isRequire: true,
      default: () => {},
    },
    videoId: {
      type: String,
      isRequire: true,
      default: '',
    },
    detailInfo: {
      type: Object,
      isRequire: true,
      default: () => {},
    },
    addMarginTop: {
      type: Boolean,
      isRequire: false,
      default: true,
    },
    poster: {
      type: String,
      default: '',
    },
    isShow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      playing: false,
      playStartTime: 0,
    }
  },
  watch: {
    isShow(val) {
      if (!val)
        this.pause()
    },
  },
  mounted() {},
  beforeUnmount() {},
  methods: {
    handleClick() {
      if (this.playing)
        this.pause()

      else
        this.play()
    },
    play() {
      if (this.$refs.videoRef) {
        if (!(this.playing || this.$refs.videoRef.playing)) {
          this.$refs.videoRef.play()
          this.playing = true
          this.$emit('videoStartPlay', this.videoId)
        }
      }
    },
    pause() {
      if (this.$refs.videoRef) {
        if (this.playing || this.$refs.videoRef.playing) {
          this.$refs.videoRef.pause()
          this.playing = false
          this.$emit('videoPause', this.videoId)
        }
      }
    },
    // 监听播放
    // onPlayerPlay(player) {
    //   document.getElementById(this.videoId).querySelector('.vjs-fluid').style.height = '0'
    //   if (this.addMarginTop)
    //     document.getElementById(this.videoId).querySelector('.vjs-fluid').style.marginTop = '90px'
    //   player.currentTime(this.playStartTime)
    //   this.$emit('videoStartPlay', this.videoId)
    //   const param = {
    //     name: this.detailInfo.name,
    //     productId: this.detailInfo.productId,
    //     playMode: this.playerOptions.firstAutoPlay,
    //     url: this.item.url,
    //   }
    //   // this.$gio.trackViewPIPVideo(param)
    // }
  },
}
</script>

<style lang="scss" scoped>
.iVideo {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  cursor: pointer;

  &:hover {
    .iVideo__playBtn {
      border: 2px solid transparent;
    }
  }

  .iVideo__box {
    height: 100%;
    width: 100%;
    object-fit: contain;
    object-position: center;
  }

  .iVideo__playBtn {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 0.54rem;
    height: 0.54rem;
    border-radius: 50%;
    border: 2px solid #fff;
    color: #fff;
    background: rgba(0, 0, 0, 0.2);
  }
}
</style>
