<template>
  <div class="notification-container">
    <div ref="headerMessage" class="header-message-inner">
      <a
        v-for="(item, index) in notifications"
        :key="index"
        :href="item.url"
        :class="{ 'message-slide-item': true, show: notifications.length === 1 || index === currentIndex }"
      >
        <div class="ellipsis" :style="{ color: textColor || '#fff' }">
          <IIcon
            v-if="item.iconComponentName"
            class="message-slide-item__icon"
            size="0.14rem"
            :color="item.iconColor || 'inherit'"
            :component-name="item.iconComponentName"
          />
          <span :style="'color:' + item.fontColor">{{ item.message }}</span>
        </div>
      </a>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, defineProps, onMounted, onUnmounted } from 'vue'
import IIcon from 'atoms/IIcon/IIcon.vue'

const props = defineProps({
  textColor: {
    type: String,
    default: '#ffffff',
  },
  notifications: {
    type: Array,
    default: () => [],
  },
})

const currentIndex = ref(0)
const timer = ref<any>(null)

const startAnimation = (maxNumber) => {
  timer.value = setInterval(() => {
    if (currentIndex.value < maxNumber)
      currentIndex.value++

    else
      currentIndex.value = 0
  }, 3000)
}

onMounted(() => {
  if (props.notifications.length > 1) {
    const maxNumber = props.notifications.length - 1
    startAnimation(maxNumber)
  }
})

onUnmounted(() => {
  if (timer.value)
    clearInterval(timer.value)
})
</script>

<style lang="scss" scoped>
.notification-container {
  padding: 0 0.4rem;

  .header-message-inner {
    height: 0.4rem;
    padding-left: 0.05rem;
    position: relative;

    .message-slide-item {
      // position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      // z-index: -1;
      height: 0.4rem;
      line-height: 0.4rem;
      text-align: center;
      color: #fff;
      display: none;
      // transition: z-index 3s;

      &__icon {
        transform: translateY(0.02rem);
      }
    }

    .message-slide-item.show {
      z-index: 1;
      display: block;
      transition: display 3s;
      animation: fadeIn 3s ease;
    }

    .ellipsis {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin: 0 auto;
      max-width: 85vw;
      font-size: 0.12rem;
      text-align: left;

      .message-slide-item__icon {
        margin: 0 0.06rem 0.06rem 0;
        vertical-align: middle;
      }
    }
  }
}

@keyframes fadeInUp {
  0% {
    opacity: 0.5;
  }

  80% {
    opacity: 1;
  }

  100% {
    opacity: 0.5;
  }
}

@-webkit-keyframes fadeIn {
  0% {
    opacity: 0.5;
  }

  80% {
    opacity: 1;
  }

  100% {
    opacity: 0.5;
  }
}
</style>
