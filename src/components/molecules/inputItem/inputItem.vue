<template>
  <!-- 输入框组件 -->
  <div class="input-box" :style="inputWidth" :class="{ 'firefox-picker': disabled }">
    <span
      class="inpt-txt"
      :class="{
        on_hide: !inptTxt ? noTit || !value : !inptTxt,
        disabl: disabled
      }"
    >{{ inptTxt || placeholder }}</span>
    <input
      :ref="inputType + 'index'"
      :type="inputBoxType"
      class="inpt-item"
      :class="{
        checker: !verify,
        'no-bob': disabled,
        pdL40: inputType === 'tel' && value && showPhoneRegion
      }"
      :style="inputStyle"
      :value="value"
      :disabled="disabled"
      :placeholder="placeholder"
      :maxlength="maxlength"
      @blur="inputBlur"
      @focus="inputFoucs"
    />
    <slot />
    <span v-if="inputType === 'tel' && value && showPhoneRegion" class="box-item-phone-area">+86</span>
    <span v-if="prompt" :class="{ on_hide: !errTips }" class="inpt-tip">{{ errTips }}</span>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'
import { getRegularRule } from '@/utils/index'
export default {
  name: 'InputItem',
  components: {},
  props: {
    prompt: {
      type: Boolean,
      required: false,
      default: true,
    },
    inputType: {
      type: String,
      required: false,
      default: 'text',
    },
    placeholder: {
      type: String,
      required: false,
      default: '',
    },
    value: {
      type: String,
      required: true,
      default: '',
    },
    noTit: {
      type: Boolean,
      required: false,
      default: false,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    inptTxt: {
      type: String,
      required: false,
      default: '',
    },
    maxlength: {
      type: String,
      required: false,
      default: '',
    },
    verifyOutside: {
      type: Boolean,
      required: false,
      default: false,
    },
    tips: {
      type: String,
      required: false,
      default: '',
    },
    showPhoneRegion: {
      type: Boolean,
      required: false,
      default: false,
    },
    inputWidth: {
      type: Object,
      required: false,
      default: () => {
        return {}
      },
    },
    inputStyle: {
      type: Object,
      required: false,
      default: null,
    },
  },
  emits: ['onInput', 'verify', 'input', 'blur'],
  setup() {
    const { t } = useI18n()
    return {
      t,
    }
  },
  data() {
    return {
      errTips: this.tips,
      verify: true,
      inputBoxType: 'text',
    }
  },
  watch: {
    tips(val) {
      this.errTips = val
    },
  },
  mounted() {
    if (this.inputType === 'captcha' || this.inputType === 'tel')
      this.inputBoxType = 'tel'

    const inpt = this.$refs[`${this.inputType}index`]
    inpt.addEventListener('input', (e) => {
      let val = e.target.value
      if (this.inputType === 'captcha' || this.inputType === 'tel') {
        val = val.replace(/[^0-9]/g, '')
        inpt.value = val
        this.$emit('input', val)
      }
      else {
        this.$emit('input', val)
      }
    })
  },

  methods: {
    inputFoucs() {
      this.errTips = ''
      this.verify = true
      this.$emit('onInput')
    },
    inputBlur() {
      let isverify = false
      if (this.inputType === 'tel' || this.inputType === 'phone')
        isverify = this.validatePhone()

      else if (this.inputType === 'name')
        isverify = this.validateName()

      else if (this.inputType === 'address')
        isverify = this.validateName()

      this.$emit('verify', isverify)
    },
    // 校验电话
    validatePhone() {
      const phone = this.value
      const reg = getRegularRule().phoneReg
      const cardReg = /^\d{19}$/
      debugger
      // 忘记密码inputType 为phone 并且错误信息指挥判断是不是如果手机号和邮箱格式不正确会展示  "请输入正确格式的账号信息" 只要不满足邮箱条件的都会走手机,所以只在手机验证添加了
      if (this.inputType === 'phone' && !reg.test(phone)) {
        this.verify = false
        this.errTips = this.t('login.please_enter_the_correct_format_of_account_information')
        return false
      }
      else if (this.inputType === 'tel' && !phone) {
        this.verify = false
        this.errTips = this.t('login.phone_number_cannot_be_empty')
        return false
      }
      else if (this.inputType === 'tel' && !reg.test(phone)) {
        this.verify = false
        this.errTips = this.t('login.please_enter_correct_phone_number')
        return false
      }
      else {
        this.verify = true
        this.errTips = ''
        return true
      }
    },
    // 校验用户名
    validateName() {
      // const reg1 = /^[\u4E00-\u9FA5]{2,25}$/
      // const reg2 = /(?=(^[a-zA-Z]((\s)?[a-zA-Z]+)*$))(^[a-zA-Z\s]{2,25}$)/g
      // const reg=/^[\u4E00-\u9FA5A-Za-z]{2,15}$/
      const reg = getRegularRule().userNameReg
      const name = this.value
      if (this.inputType === 'address')
        this.$emit('blur')

      if (!reg.test(name)) {
        this.verify = false
        this.errTips = this.t('login.please_enter_correct_name')
        return false
      }
      else {
        this.verify = true
        this.errTips = ''
        return true
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.input-box {
  width: 100%;
  position: relative;

  input {
    outline: none;
    border: none;

    &::-webkit-input-placeholder {
      color: #484848;
    }

    &::-moz-placehold {
      /* Mozilla Firefox 19+ */
      color: #484848;
    }

    &:-moz-placehold {
      /* Mozilla Firefox 4 to 18 */
      color: #484848;
    }

    &:-ms-input-placeholder {
      /* Internet Explorer 10+ */
      color: #484848;
    }
  }

  .inpt-txt {
    font-size: 0.12rem;
    color: #484848;
    line-height: 0.18rem;
    display: block;
    padding-bottom: 0.04rem;

    &.disabl {
      color: #666;
    }
  }

  .inpt-item {
    border-bottom: 1px solid #929292;
    padding-bottom: 3px;
    box-sizing: border-box;
    width: 100%;
    font-size: 0.16rem;
    color: #111;
    line-height: 0.24rem;
    background-color: #fff;

    &.no-bob {
      color: #dfdfdf;
      border-color: #929292;
    }

    &:focus {
      color: #0058a3;
      border-bottom: 1px solid #0058a3;
    }

    &.checker {
      border-bottom: 1px solid #e00751;
    }

    &::-webkit-input-placeholder {
      color: #484848;
    }

    &::-moz-placehold {
      /* Mozilla Firefox 19+ */
      color: #484848;
    }

    &:-moz-placehold {
      /* Mozilla Firefox 4 to 18 */
      color: #484848;
    }

    &:-ms-input-placeholder {
      /* Internet Explorer 10+ */
      color: #484848;
    }
  }

  .inpt-tip {
    color: #e00751;
    font-size: 0.12rem;
    line-height: 0.18rem;
    height: 0.18rem;
    box-sizing: border-box;
    padding-top: 0.07rem;
    display: block;
  }
}

.on_hide {
  visibility: hidden;
}

.box-item-phone-area {
  position: absolute;
  left: 0;
  top: 0.22rem;
  font-size: 0.16rem;
  line-height: 0.24rem;
  color: #111;
}

.pdL40 {
  padding-left: 0.4rem;
}

.firefox-picker {
  //disabled为true时兼容火狐
  position: relative;

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 2;
    cursor: pointer;
  }
}
</style>
