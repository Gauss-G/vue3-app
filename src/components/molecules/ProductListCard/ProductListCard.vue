<!-- 商品列表缺货时相似推荐组件 -->
<template>
  <div class="product-list-card" @click="viewAll()">
    <i-card :title="title" :closeable="false" :show-divider="false">
      <template #header-link>
        <div class="product-list-card__link">
          <span class="product-list-card__title"> {{ t('cart.check_product_list') }} </span>
          <!-- <i-svg-icon :src="`/icons/chevron-right-small.svg`" /> -->

          <IIcon class="product-list-card__icon" size="0.2rem" component-name="ChevronRightSmallIcon" />
        </div>
      </template>
      <template #body>
        <div class="product-list-card__body">
          <div v-for="(item, index) in productList.slice(0, displayCount)" :key="index" :style="itemStyle">
            <img :src="item.product.images[0].url" />
            <span v-if="item.product.stockStatus === 'OUTOFSTOCK'" class="unavailable-tag">
              {{ t('cart.not_available_for_the_time_being') }}
            </span>
          </div>
          <div v-if="productList.length > 2" :style="itemStyle">
            <IIcon class="product-list-card__icon" size="0.2rem" component-name="EllipsesHorizontalIcon" />
          </div>
        </div>
      </template>
    </i-card>
  </div>
</template>

<script>
import { defineComponent, computed, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'
import ICard from 'atoms/ICard/ICard.vue'
import IIcon from 'atoms/IIcon/IIcon.vue'
export default defineComponent({
  components: {
    ICard,
    IIcon,
  },
  props: {
    productFullId: {
      type: String,
      required: true,
    },
    productList: {
      type: Array,
      default() {
        return []
      },
    },
    displayCount: {
      type: Number,
      default: 4,
    },
  },
  emits: ['viewAll'],
  setup(props) {
    const { t } = useI18n()
    const itemStyle = computed(() => {
      return {
        width: `${(100 / props.displayCount).toFixed(0)}%`,
      }
    })
    const { productList } = toRefs(props)
    const productCount = computed(() => {
      return productList.value.reduce((prev, item) => {
        return prev + item.quantity * 1
      }, 0)
    })
    const title = computed(() => t('cart.totally_product_count').replace('_N_', productCount.value || 0))
    return {
      t,
      title,
      itemStyle,
      productCount,
    }
  },
  methods: {
    viewAll() {
      this.$emit('viewAll', this.productFullId)
    },
  },
})
</script>

<style lang="scss" scoped>
.product-list-card {
  position: relative;
  border: 1px solid #ebebeb;
  border-radius: 0.06rem;

  .product-list-card__link {
    display: flex;

    &:deep(.svg-icon) {
      color: #666;
    }
  }

  .product-list-card__title {
    font-size: 0.14rem;
    line-height: 0.24rem;
    color: #666;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .product-list-card__body {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-items: flex-start;

    div {
      position: relative;
      display: flex;
      height: 0.5rem;
      margin: 0 5px;

      img {
        margin: auto;
        width: 0.5rem;
        height: 0.5rem;
      }

      span {
        margin: auto;
      }
    }

    .unavailable-tag {
      position: absolute;
      width: 100%;
      bottom: 0;
      background: #111;
      color: #fff;
      opacity: 0.5;
      font-size: 0.1rem;
      line-height: 0.2rem;
      text-align: center;
    }
  }

  .product-list-card__icon {
    margin: auto;
  }

  &:deep(.card-header__text) {
    font-size: 0.14rem;
    line-height: 0.24rem;
    color: #111;
  }
}
</style>
