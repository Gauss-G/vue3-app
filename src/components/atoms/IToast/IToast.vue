<template>
  <div>
    <!-- <teleport to="toast-panel"> -->
    <div
      v-if="isShow"
      class="self-toast-box"
      :class="{ 'toast-hide': endAnimation,'toast-box-right':position==='right'}"
      :style="{ transform: transform }"
    >
      <div class="self-toast-content" :style="{ backgroundColor }">
        <div
          class="toast-txt"
          :class="{ 'text-center': textPosition === 'center', 'text-right': textPosition === 'right' }"
        >
          {{ text }}
        </div>
        <div class="toast-control">
          <div v-if="actionTxt" class="action-txt" @click="onClickAction">
            {{ actionTxt }}
          </div>
          <div v-if="showClose" class="action-close" @click="hide">
            <IIcon component-name="CrossSmallIcon" size="0.24rem" class="close-icon" />
          </div>
        </div>
      </div>
    </div>
    <!-- </teleport> -->
  </div>
</template>

<script setup>
// 调用方式  import { toast } from 'atoms/IToast/index' toast({text:'123',duration:3000,textPosition:'center'})
import { ref, defineProps, onMounted } from 'vue'
import IIcon from 'atoms/IIcon/IIcon.vue'

const props = defineProps({
  backgroundColor: {
    type: String,
    default: '#111',
  },
  // 左侧文案
  text: {
    type: String,
    isRequire: true,
    default: '',
  },
  // 文案位置 left  center  right bottom
  textPosition: {
    type: String,
    default: 'left',
  },
  // 显示右侧关闭按钮
  showClose: {
    type: Boolean,
    default: false,
  },
  // 右侧文案
  actionTxt: {
    type: String,
    default: '',
  },
  // 显示时间
  duration: {
    type: Number,
    default: 2000,
  },
  // 距离底部距离 需要带单位(rem,px)
  bottom: {
    type: String,
    default: '',
  },
  // 弹框出现的地方 bottom  底部 right 右上侧
  position: {
    type: String,
    default: 'bottom',
  },
  // 右侧文案事件
  clickAction: {
    type: Function,
    default: () => {},
  },
  close: {
    type: Function,
    default: () => {},
  },
})
const isShow = ref(false)
const endAnimation = ref(false)// 结束动画
const transform = ref('')
const hide = () => {
  endAnimation.value = true
  setTimeout(() => {
    isShow.value = false
    props.close()
  }, 300)
}
const show = () => {
  isShow.value = true
  setTimeout(() => {
    hide()
  }, props.duration)
}

const onClickAction = () => {
  props.clickAction()
  hide()
}

const onClickClose = () => {
  hide()
}

onMounted(() => {
  show()
  setTimeout(() => {
    let range = '.8rem'
    if (props.bottom) {
      range = props.bottom
      if (range.indexOf('px') <= 0 && range.indexOf('rem') <= 0)
        range += 'px'
    }
    transform.value = `translateY(-${range}) translateZ(0) translate3d(0,0,0)`
  }, 10)
})
</script>

<style lang="scss" scoped>
.self-toast-box {
  max-width: 3.2rem;
  // bottom: 0.8rem;
  // left: 50%;
  // transform: translateX(-50%);
  transition: all 300ms;
  transform: translateY(-0.5rem) translateZ(0) translate3d(0, 0, 0);
  margin: 0.1rem auto;
  text-align: left;
  display: block;
  opacity: 1;

  .self-toast-content {
    background-color: #111;
    box-shadow: 0 2px 4px rgba(17, 17, 17, 0.1);
    border-radius: 0.04rem;
    min-width: 3.2rem;
    height: 0.7rem;
    font-size: 0.12rem;
    color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 0.14rem 0 0.25rem;
    z-index: 11111;

    .toast-txt {
      flex: 1;
      padding: 0 0.1rem 0 0;
      line-height: 1.5;
    }

    .text-center {
      text-align: center;
    }

    .text-right {
      text-align: right;
    }

    .toast-control {
      display: inline-flex;
      justify-content: flex-end;
      align-items: center;
    }

    .action-txt {
      position: relative;
      display: inline-block;
      min-width: 0.4rem;
      line-height: 0.2rem;
      cursor: pointer;
      padding: 0 0.08rem 0 0;
      vertical-align: initial;
      text-align: right;
    }

    .action-close {
      position: relative;
      display: inline-block;
      padding: 0 0 0 0.15rem;
      margin: 0 0 0 0.12rem;
      cursor: pointer;

      &::before {
        position: absolute;
        display: block;
        content: "";
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        width: 1px;
        height: 0.34rem;
        background-color: rgba(255, 255, 255, 0.2);
      }

      .close-icon {
        vertical-align: bottom;
      }
    }
  }
}

.toast-box-right {
  .self-toast-content {
    min-width: 3.5rem;
  }
}

.toast-hide {
  opacity: 0;
}
</style>
