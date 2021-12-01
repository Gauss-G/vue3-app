<template>
  <div class="reviews-item">
    <!-- 有精选晒单 -->
    <template v-if="reviewsList.length">
      <header class="reviews-item-title">
        <strong>已有 {{ reviewsList.length }} 条精选晒单</strong>
      </header>
      <section class="reviews-item-section">
        <template v-if="reviewsItem.content?.items && reviewsItem.content?.items.length">
          <div class="reviews-item-section-text-list">
            <p
              v-for="(items, index) in reviewsItem.content.items"
              :key="index"
              class="reviews-content-item"
            >
              <span class="item-left">
                {{ `${items.desc} : ` }}
              </span>
              <span class="item-right">
                {{ items.value }}
              </span>
            </p>
          </div>
        </template>
        <p v-if="reviewsItem.content?.comment" class="reviews-item-section-text">
          {{ reviewsItem.content.comment }}
        </p>
        <template v-if="reviewsItem.content?.images && reviewsItem.content?.images.length">
          <img :src="reviewsItem.content?.images[0].url" alt="精选晒单">
        </template>
        <p class="reviews-item-section-name">
          <strong class="name-left">
            <img v-if="reviewsItem.reviewer?.avatarUrl" :src="reviewsItem.reviewer?.avatarUrl" alt="userImg">
            <img v-else src="https://ikeacn-static-test.oss-cn-shanghai.aliyuncs.com/static/images/photo.svg" alt="userImg" />
            {{ reviewsItem.reviewer?.name }}
          </strong>
          <span class="name-right" @click="onLike(productId)">
            <img v-if="isLike" src="https://www.ikea.cn/icons/liked.svg" />
            <img v-else src="https://www.ikea.cn/icons/like.svg" />
            {{ reviewsItem.voteCount }}人
          </span>
        </p>
      </section>
      <template v-if="reviewsList.length > 1">
        <footer class="reviews-item-footer">
          <strong @click="emit('onLodin', reviewsList)">查看更多</strong>
        </footer>
      </template>
    </template>
    <!-- 无精选晒单 -->
    <template v-else>
      <header class="reviews-item-title">
        <strong>暂无精选晒单</strong>
      </header>
      <section class="reviews-item-section">
        <span>-</span>
      </section>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, onMounted, defineEmits } from 'vue'
import { reviewList } from '@/api/config'

const props = defineProps({
  productId: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['onLodin'])

const reviewsList = ref<Array<any>>([])
const reviewsItem = ref<any>({})
const isLike = ref(false)

const getReviewsList = async(id?: string) => {
  try {
    const { data } = await reviewList.getProductReviews(id)
    reviewsList.value = data.filter(item => item.featured)
    reviewsItem.value = reviewsList.value[0] || {}
  }
  catch (error) {
    reviewsList.value = []
    reviewsItem.value = {}
  }
}

onMounted(() => {
  getReviewsList(props.productId)
})

const onLike = async(id: string) => {
  try {
    let res: any = null
    if (!isLike.value) res = await reviewList.upvoteReview(id)
    else res = await reviewList.downvoteReview(id)
    console.error('res', res)
  }
  catch (error) {}
}
</script>

<style lang="scss" scoped>
.review-vote-button {
  margin-right: 0.04rem;

  i {
    display: inline-block;
    width: 0.18rem;
    height: 0.18rem;
    color: #666;
    background: url('./like.svg') center no-repeat;
    background-size: 100% 100%;
    cursor: pointer;
    vertical-align: middle;
  }

  .votes {
    background: url('./liked.svg') center no-repeat;
    background-size: 100% 100%;
    transform: scale(0.98);
  }
}

.reviews-item {
  width: 100%;

  header.reviews-item-title {
    > strong {
      color: #484848;
      font-size: 0.14rem;
      line-height: 0.21rem;
    }
  }

  section.reviews-item-section {
    margin-top: 0.24rem;

    .reviews-item-section-text {
      color: #111;
    }

    .reviews-item-section-text-list {
      margin-bottom: 0.06rem;

      .reviews-content-item {
        display: flex;
        color: #111;

        .item-left {
          flex: 1;
          color: #767676;
        }

        .item-right {
          flex: 2;
        }
      }
    }

    > img {
      display: block;
      width: 100%;
      margin-top: 0.12rem;
      border-radius: 0.04rem;
    }

    .reviews-item-section-name {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 0.14rem;

      .name-right,
      .name-left {
        display: flex;
        align-items: center;

        > img {
          width: 0.2rem;
          margin-right: 0.06rem;
        }
      }

      .name-left {
        color: #111;
        font-size: 0.12rem;
        line-height: 0.18rem;

        > img {
          border-radius: 50%;
        }
      }

      .name-right {
        color: #767676;
        font-size: 0.14rem;
        line-height: 0.21rem;

        > img {
          cursor: pointer;
        }
      }
    }
  }

  footer.reviews-item-footer {
    margin-top: 0.24rem;

    > strong {
      color: #111;
      font-size: 0.14rem;
      line-height: 0.21rem;
      cursor: pointer;
    }
  }
}
</style>
