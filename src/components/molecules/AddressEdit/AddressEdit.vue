<template>
  <!-- 新建地址|修改地址 -->
  <div class="address-edit">
    <div class="address-edit-title">
      {{
        isEdit
          ? t('address.edit_delivery_address')
          : addressListlength === 0
            ? t('address.not_hove_address')
            : t('address.create_a_shipping_address')
      }}
    </div>
    <div class="address-from">
      <div class="from-li">
        <InputItem v-model:value="name" placeholder="收货人" input-type="name" />
      </div>
      <div class="from-li">
        <InputItem v-model:value="tel" placeholder="手机号" input-type="tel" />
      </div>

      <div class="from-li">
        <ICascaderInput v-model:value="cascaderValue" :data="cascaderData" :options="cascaderOptions" @change="change" />
        <div class="from-li-tips"></div>
      </div>
      <div class="from-li">
        <InputItem v-model:value="detail" placeholder="详细地址" input-type="address" />
      </div>
      <div class="from-li">
        <div class="set_default_address">
          <i-checkbox
            :value="isDefault"
            :label="t('from.set_default')"
          />
        </div>
        <div v-if="isEdit" class="delete_address" @click="deleteAddress">
          {{ t("address.delete_address") }}
        </div>
      </div>
    </div>
    <div class="address-edit-footer">
      <div class="edit-close" @click="close">
        <i-button type="button" :small="true" :fluid="true" variant="image-overlay">
          {{ t('public.cancel') }}
        </i-button>
      </div>
      <div class="edit-submit">
        <i-button type="button" :small="true" :fluid="true" variant="primary" @click="submit">
          {{ isEdit?t('public.save'):t('address.save_use') }}
        </i-button>
      </div>
    </div>
  </div>
</template>

<script setup>
// import ICascader from '~/components/base/ICascader'
// import InputItem from '~/components/login/inputItem'
// // import IInput from '~/components/base/IInput'
// import { publicService } from '~/mixins/business/publicService'
import ICascaderInput from 'atoms/ICascader/ICascaderInput.vue'
import InputItem from 'molecules/InputItem/InputItem.vue'
import ICheckbox from 'atoms/ICheckbox/ICheckbox.vue'
import IButton from 'atoms/IButton/IButton.vue'
import commonControl from 'composables/common/common'
import { ref, defineProps, defineEmits, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { profile } from '@/api/config'
const { t } = useI18n()
const { cityData, getCityData } = commonControl()

const props = defineProps({
  // 用户地址列表
  addressListlength: {
    type: Number,
    default: 0,
  },
  item: {
    type: Object,
    default() {
      return {}
    },
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
})
const emits = defineEmits(['close'])
const cascaderData = ref([]) // 库存选择的数组集合
const cascaderOptions = ref({
  placeholder: t('address.select_City'),
})
const cascaderValue = ref('')
const name = ref('')
const tel = ref('')
const detail = ref('')
const isDefault = ref(false)
const close = () => {
  emits('close')
}
// 删除
const deleteAddress = async() => {
  const res = await profile.deleteAddress(props.addressId)
  // if (res.isSuccess) {}
}
const submit = () => {

}
onMounted(async() => {
  await getCityData() // 获取省市区数据
  cascaderData.value = cityData.value
  if (props.item && props.item.name) {
    name.value = props.item.name
    tel.value = props.item.mobile
    detail.value = props.item.detailAddress
    cascaderValue.value = `${props.item.province}/${props.item.city}/${props.item.district}/${props.item.street}`
    isDefault.value = props.item.default
  }
})
</script>

<style lang="scss" scoped>
.address-edit {
  width: 100%;
  padding: 0 0.5rem;

  .address-edit-title {
    font-style: normal;
    font-weight: 600;
    font-size: 0.22rem;
    line-height: 0.32rem;
    color: #111;
  }

  .address-from {
    margin-top: 0.32rem;

    .from-li {
      margin-bottom: 0.24rem;

      .from-li-tips {
        color: #e00751;
        font-size: 0.14rem;
        line-height: 0.2rem;
        height: 0.2rem;
        box-sizing: border-box;
        padding-top: 0.07rem;
        display: block;
      }

      .set_default_address {
        display: inline-block;
      }

      .delete_address {
        float: right;
        line-height: 0.28rem;
      }
    }
  }

  .address-edit-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 0.2rem;
    border-top: 1px solid #f2f2f2;
    display: flex;

    .edit-close {
      flex: 1;
      padding: 0 0.2rem;
    }

    .edit-submit {
      flex: 1;
      padding: 0 0.2rem;
    }
  }
}
</style>
