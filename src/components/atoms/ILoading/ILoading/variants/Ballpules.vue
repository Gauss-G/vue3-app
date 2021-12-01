<template>
  <div
    class="loader-inner ball-pulse"
    :class="{ 'ball-pulse-small': size === 'Small', 'ball-pulse-large': size === 'large' }"
  >
    <div :style="styleObject"></div>
    <div :style="styleObject"></div>
    <div :style="styleObject"></div>
  </div>
</template>

<script>
export default {
  name: 'BallPules',
  inheritAttrs: true,
  props: {
    type: {
      type: String,
      default: 'Ballpules',
    },
    // Small-小 Default默认 Large-大
    size: {
      type: String,
      default: 'Default',
    },
    // 动画元素颜色值
    color: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      styleObject: {
        background: this.color,
      },
    }
  },
}
</script>

<style scoped lang="scss">
// loading动画-3个点start
@-webkit-keyframes scale {
  0% {
    -webkit-transform: scale(1);
    transform: scale(1);
    opacity: 1;
    // background: #0058a3;
  }

  45% {
    -webkit-transform: scale(0.1);
    transform: scale(0.1);
    opacity: 0.8;
    // background: #005fa3;
  }

  80% {
    -webkit-transform: scale(1);
    transform: scale(1);
    opacity: 1;
    // background: #108ee9;
  }
}

@keyframes scale {
  0% {
    -webkit-transform: scale(1);
    transform: scale(1);
    opacity: 1;
    // background: #0058a3;
  }

  45% {
    -webkit-transform: scale(0.1);
    transform: scale(0.1);
    opacity: 0.8;
    // background: #005fa3;
  }

  80% {
    -webkit-transform: scale(1);
    transform: scale(1);
    opacity: 1;
    // background: #108ee9;
  }
}

.ball-pulse div {
  width: 0.08rem;
  height: 0.08rem;
  border-radius: 100%;
  margin: 2px;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  display: inline-block;
  // background: linear-gradient(#108EE9, #10ade9,#10b9e9);
  background: #108ee9;
}

.ball-pulse-small div {
  width: 0.05rem;
  height: 0.05rem;
}

.ball-pulse-large div {
  width: 0.15rem;
  height: 0.15rem;
}

.ball-pulse > div:nth-child(0) {
  -webkit-animation: scale 0.7s 0s infinite cubic-bezier(0.2, 0.68, 0.18, 1.08);
  animation: scale 0.7s 0s infinite cubic-bezier(0.2, 0.68, 0.18, 1.08);
}

.ball-pulse > div:nth-child(1) {
  -webkit-animation: scale 0.7s 0.12s infinite cubic-bezier(0.2, 0.68, 0.18, 1.08);
  animation: scale 0.7s 0.12s infinite cubic-bezier(0.2, 0.68, 0.18, 1.08);
}

.ball-pulse > div:nth-child(2) {
  -webkit-animation: scale 0.7s 0.24s infinite cubic-bezier(0.2, 0.68, 0.18, 1.08);
  animation: scale 0.7s 0.24s infinite cubic-bezier(0.2, 0.68, 0.18, 1.08);
}

.ball-pulse > div:nth-child(3) {
  -webkit-animation: scale 0.7s 0.36s infinite cubic-bezier(0.2, 0.68, 0.18, 1.08);
  animation: scale 0.7s 0.36s infinite cubic-bezier(0.2, 0.68, 0.18, 1.08);
}

// loading动画-3个点end
</style>
