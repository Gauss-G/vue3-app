<template>
  <div class="cont-main">
    <template v-if="isH5">
      <div
        v-if="!(selectEditItem.product && selectEditItem.product.itemType === 'VTP')"
        class="cont-collection"
        @click="toggleCollect"
      >
        <div class="collection-text">
          {{ selectEditItem.isCollect ? t('cart.collected') : t('cart.collection') }}
        </div>
        <div class="img">
          <IIcon
            class="box-item-icon"
            size="0.22rem"
            :style="{ color: !selectEditItem.isCollect ? '#111' : 'red' }"
            :component-name="!selectEditItem.isCollect ? 'HeartIcon' : 'HeartFilledIcon'"
          />
        </div>
      </div>
      <div class="cont-collection" @click="deleteItem">
        <div class="text">
          {{ t('cart.delete') }}
        </div>
        <IIcon class="img" size="0.22rem" component-name="TrashCanIcon" />
      </div>
    </template>
    <template v-else>
      <div class="deleteTip-box">
        <div class="deleteTip-title">
          {{ t('cart.are_you_sure_you_want_to_delete_the_selected_item') }}
        </div>
        <div class="deleteTip-content">
          {{ t('cart.when_you_select_delete') }}
        </div>
        <div class="deleteTip-bottom">
          <div
            class="deleteTip-bottom-cancle"
            data-track-id="other-operation.7"
            :data-track-label="t('public.cancel')"
            @click="close"
          >
            {{ t('public.cancel') }}
          </div>
          <div
            class="deleteTip-bottom-deter"
            data-track-id="other-operation.8"
            :data-track-label="t('public.determine')"
            @click="deleteItem"
          >
            {{ t('public.determine') }}
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue'
import IIcon from 'atoms/IIcon/IIcon.vue'
import base from 'composables/base.ts'
const { t, isH5 } = base()
const props = defineProps({
  selectEditItem: {
    type: Object,
    default() {
      return {}
    },
  },
})
const emit = defineEmits(['toggleCollect', 'deleteItem', 'close'])
const toggleCollect = () => {
  emit('toggleCollect', props.selectEditItem)
}
const deleteItem = () => {
  emit('deleteItem', props.selectEditItem)
}
const close = () => {
  emit('close')
}
</script>
<style lang="scss" scoped>
.cont-main {
  width: 100%;
  background: #fff;

  .cont-collection {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 0.95rem;
    padding-left: 0.28rem;
    border-bottom: 0.01rem solid #f2f2f2;

    .collection-text {
      font-size: 0.14rem;
      color: #111;
    }

    .img {
      width: 0.48rem;
      height: 0.48rem;
      display: flex;
      justify-content: center;
      align-items: center;

      .red {
        color: red;
      }
    }
  }

  .cont-detele {
    display: flex;
    align-items: center;
    padding-left: 0.28rem;
    height: 0.95rem;
    font-size: 0.14rem;
    color: #111;
  }
}

.deleteTip-title {
  margin-top: 1.2rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  font-weight: bold;
  font-size: 0.22rem;
  line-height: 0.32rem;
  color: #000;
}

.deleteTip-content {
  margin-top: 0.42rem;
  font-weight: normal;
  font-size: 0.14rem;
  line-height: 0.24rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  color: #484848;
}

.deleteTip-bottom {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 0.8rem;
  position: absolute;
  left: 0;
  bottom: 0;
  border-top: 1px solid #f5f5f5;
  background: #fff;
  z-index: 100000;
  width: 100%;

  div {
    width: 2rem;
    height: 0.4rem;
    border-radius: 0.2rem;
    text-align: center;
    font-size: 0.12rem;
    line-height: 0.4rem;
    cursor: pointer;
  }

  .deleteTip-bottom-cancle {
    background: #f5f5f5;
    color: #111;
    margin-right: 0.1rem;
  }

  .deleteTip-bottom-deter {
    background: #111;
    color: #fff;
  }
}

</style>
