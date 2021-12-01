<template>
  <div class="content-gallery" :class="{'pcview':!isH5}">
    <div class="content-gallery-header">
      <div class="content-gallery-header__title">
        <slot name="header-title">
          <!-- <i-svg-icon class="content-gallery__icon" :src="`/icons/${headerIcon}.svg`" /> -->
          <IIcon class="content-gallery__icon" size="0.2rem" :component-name="headerIcon" />
          <span>{{ title || t('operation.view_all') }} </span>
        </slot>
      </div>
      <div id="content-gallery-header__action" class="content-gallery-header__action" @click="handleClick('viewAll')">
        <!-- <module-exposure-observer
          :trackId="`${dataModuleId}.0`"
          observedTargetId="content-gallery-header__action"
          :extendedAttributes="{
            positionName_var: '查看全部'
          }"
        /> -->
        <slot name="header-action">
          <template v-if="isH5">
            <span>{{ headerActionLabel }}</span>
            <IIcon class="content-gallery__icon" size="0.2rem" component-name="ChevronRightSmallIcon" />
          </template>
          <i-button
            v-else
            type="button"
            :small="true"
            :fluid="true"
            variant="secondary"
            @click.stop="handleClick('viewAll')"
          >
            <span>{{ headerActionLabel }}</span>
          </i-button>
        </slot>
      </div>
    </div>

    <div v-if="isH5" class="content-gallery-content">
      <slot name="content" />

      <div v-if="showOperation" class="content-gallery-opeation" @click="handleClick('viewMore')">
        <!-- <module-exposure-observer
          :trackId="`${dataModuleId}.1`"
          observedTargetId="content-gallery-opeation"
          :extendedAttributes="{
            positionName_var: '查看更多'
          }"
        /> -->
        <slot name="operation">
          <div class="content-gallery-opeation__button">
            <span> {{ viewMoreLabel || t('operation.view_more') }} </span>
          </div>
        </slot>
      </div>
    </div>
    <i-scrollbar v-else :show-vertical="false">
      <div class="content-gallery-content">
        <slot name="content" />

        <div v-if="showOperation" class="content-gallery-opeation" @click="handleClick('viewMore')">
          <!-- <module-exposure-observer
            :track-id="`${dataModuleId}.1`"
            observed-target-id="content-gallery-opeation"
            :extended-attributes="{
              positionName_var: '查看更多'
            }"
          /> -->
          <slot name="operation">
            <span>{{ viewMoreLabel || t('operation.view_more') }}</span>
            <IIcon size="0.25rem" component-name="ArrowRightIcon" />
          </slot>
        </div>
      </div>
    </i-scrollbar>
  </div>
</template>

<script setup>
// import ISvgIcon from '~/components/base/ISvgIcon'
// import ModuleExposureObserver from '~/components/observer/ModuleExposureObserver'
// import { gioTrackService } from '~/mixins/gioTrackService'
// import { CLICK_TYPE } from '~/constants/gio/variables'
import IIcon from 'atoms/IIcon/IIcon.vue'
import IButton from 'atoms/IButton/IButton.vue'
import IScrollbar from 'atoms/IScrollbar/Scrollbar.vue'
import { defineProps, defineEmits } from 'vue'
import base from 'composables/base'
const { t, isH5 } = base()
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  headerIcon: {
    type: String,
    default: 'ShoppingBagAddIcon',
  },
  headerActionLabel: {
    type: String,
    default: '查看全部',
  },
  headerActionIcon: {
    type: String,
    default: 'chevron-right-small',
  },
  count: {
    type: Number,
    default: 0,
  },
  showOperation: {
    type: Boolean,
    default: true,
  },
  viewMoreLabel: {
    type: String,
    default: '查看更多',
  },
})
const emits = defineEmits(['viewAll', 'viewMore'])
const handleClick = (eventName) => {
//  if (eventName === 'viewAll') {
//         this.$gio.trackClickData(
//           {
//             trackId: `${this.dataModuleId}.0`,
//             clickType: CLICK_TYPE.ADDON_PRODUCTS,
//           },
//           true,
//           {
//             positionName_var: '查看全部',
//           },
//         )
//       }
//       else {
//         this.$gio.trackClickData(
//           {
//             trackId: `${this.dataModuleId}.1`,
//             clickType: CLICK_TYPE.ADDON_PRODUCTS,
//           },
//           true,
//           {
//             positionName_var: '查看更多',
//           },
//         )
//       }
  emits(eventName)
}
</script>

<style scoped lang="scss">
.content-gallery {
  .content-gallery__icon {
    vertical-align: top;
    height: 0.2rem;
    width: 0.2rem;
  }

  .content-gallery-header {
    display: flex;
    padding: 0.16rem 0.1rem 0.16rem 0.2rem;
    color: #111;

    .content-gallery-header__title {
      flex: 1;
      font-size: 0.14rem;
      font-weight: bold;
      line-height: 0.18rem;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;

      .content-gallery__icon {
        vertical-align: top;
        height: 0.2rem;
        width: 0.2rem;
        margin-right: 0.05rem;
      }
    }

    .content-gallery-header__action {
      display: flex;
      padding-left: 0.08rem;
      flex-direction: row;
      align-items: center;
      font-size: 0.14rem;
      font-weight: normal;
      line-height: 0.18rem;

      span {
        padding-right: 0.04rem;
      }

      .right-icon--custom {
        display: flex;
        width: 8px;
        height: 13px;
        flex: 0 0 8px;
      }
    }
  }

  .content-gallery-content {
    position: relative;
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    width: 100%;
    padding: 0 0.2rem 0.2rem 0.2rem;
    overflow-x: scroll;

    .content-gallery-opeation {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding-right: 0.16rem;

      .content-gallery-opeation__button {
        font-size: 0.12rem;
        line-height: 0.16rem;
        width: 0.8rem;
        height: 0.8rem;
        border: 0.01rem solid #dfdfdf;
        border-radius: 0.06rem;
        display: flex;

        span {
          color: #666;
          margin: auto;
          text-align: center;
        }
      }
    }
  }
}

.pcview {
  .content-gallery-header__title {
    font-size: 0.18rem !important;
    line-height: initial !important;

    .iicon {
      font-size: 0.25rem !important;
      height: 0.25rem !important;
      width: 0.25rem !important;
      vertical-align: middle;
    }
  }

  .content-gallery-content {
    overflow-x: inherit;

    .content-gallery-opeation {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-direction: column;
      margin: auto;
      padding: 0.2rem;
      cursor: pointer;

      span {
        font-weight: bold;
        font-size: 0.12rem;
        line-height: 0.16rem;
        width: 100%;
        white-space: nowrap;
      }
    }
  }
}

</style>
