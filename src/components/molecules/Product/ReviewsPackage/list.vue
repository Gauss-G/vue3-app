<template>
  <div class="reviews-list">
    <h2 class="reviews-list-title">
      <!-- 只有中文才有晒单 -->
      {{ `已有 ${list.length} 条精选晒单` }}
    </h2>
    <main class="reviews-list-main">
      <section v-for="item in list" :key="item.id">
        <header class="reviews-list-user">
          <img
            v-if="item.reviewer?.avatarUrl"
            class="reviews-list-img"
            :src="item.reviewer?.avatarUrl"
            alt=""
          >
          <img v-else class="reviews-list-img" src="https://ikeacn-static-test.oss-cn-shanghai.aliyuncs.com/static/images/photo.svg" alt="">
          <div class="reviews-list-name">
            <strong>{{ item.reviewer?.name || '***' }}</strong>
            <p>1天前</p>
          </div>
        </header>
        <div class="reviews-list-content">
          <template v-if="item.content?.items && item.content?.items.length">
            <div class="reviews-list-main-list">
              <p
                v-for="(items, index) in item.content.items"
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
          <p class="reviews-list-main-text">
            {{ item.content?.comment }}
          </p>
          <template v-if="item.content?.images && item.content?.images.length">
            <div
              :class="[
                'images',
                {
                  'one-img': item.content.images.length == 1,
                  'multiple-to-2': item.content.images.length == 2,
                  'multiple-to-3': item.content.images.length > 2,
                  'multiple-to-4': item.content.images.length == 4
                }
              ]"
            >
              <template v-for="(images, index) in item.content.images">
                <img
                  v-if="index < 10"
                  :key="images.url"
                  v-lazy="images.url"
                  alt=""
                >
              </template>
            </div>
          </template>
          <div class="line">
            <img v-if="isLike" src="https://www.ikea.cn/icons/liked.svg" />
            <img v-else src="https://www.ikea.cn/icons/like.svg" />
            <span>{{ item.voteCount }}人</span>
          </div>
        </div>
        <footer></footer>
      </section>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps } from 'vue'

const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
})

const list = props.list as Array<any>
const isLike = ref(false)
</script>

<style lang="scss" scoped>
.reviews-list {
  width: 100%;
  padding: 0 0.5rem;
  color: #111;

  > .reviews-list-title {
    font-size: 0.24rem;
    line-height: 0.36rem;
  }

  .reviews-list-main {
    padding-top: 0.08rem;

    > section {
      margin-top: 0.24rem;

      header.reviews-list-user {
        display: flex;

        .reviews-list-img {
          width: 0.4rem;
          height: 0.4rem;
          margin-right: 0.15rem;
          border-radius: 50%;
          object-fit: contain;
        }

        .reviews-list-name {
          strong {
            font-size: 0.14rem;
            line-height: 0.21rem;
          }

          p {
            margin-top: 0.02rem;
            font-size: 0.12rem;
            line-height: 0.18rem;
            color: #484848;
          }
        }
      }

      .reviews-list-content {
        margin-top: 0.2rem;
        padding-bottom: 0.2rem;
        border-bottom: 0.01rem solid #f5f5f5;

        .reviews-list-main-list {
          .reviews-content-item {
            display: flex;
            color: #111;
            font-size: 0.14rem;
            line-height: 0.21rem;

            .item-left {
              flex: 1;
              color: #767676;
            }

            .item-right {
              flex: 4;
            }
          }
        }

        .reviews-list-main-text {
          margin-top: 0.06rem;
        }

        .images {
          width: 100%;
          margin-top: 0.16rem;
          display: flex;
          overflow: hidden;
          flex-wrap: wrap;

          &.one-img {
            img {
              width: 100%;
              height: 3.8rem;
              margin-bottom: 0.1rem;
              margin-right: 0;
            }
          }

          &.multiple-to-2 {
            display: flex;
            justify-content: space-between;

            img {
              width: calc((100% - 0.1rem) / 2);
              height: 1.85rem;
              margin-right: 0;
              margin-bottom: 0.1rem;
            }
          }

          &.multiple-to-3 {
            img {
              width: calc((100% - 0.2rem) / 3);
              height: 1.2rem;
              margin-right: 0.1rem;
              margin-bottom: 0.1rem;

              &:nth-child(2n) {
                margin-right: 0.1rem;
              }

              &:nth-child(3n) {
                margin-right: 0;
              }
            }
          }

          &.multiple-to-4 {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;

            img {
              width: calc((100% - 0.1rem) / 2);
              height: 1.85rem;
              margin-right: 0 !important;
            }
          }

          img {
            width: calc((100% - 0.2rem) / 2);
            height: 1.85rem;
            border-radius: 0.04rem;
            object-fit: cover;
            margin-right: 0.12rem;
            margin-bottom: 0.1rem;
          }
        }

        .line {
          display: flex;
          align-items: center;
          color: #767676;
          font-size: 0.14rem;
          margin-top: 0.06rem;

          > img {
            cursor: pointer;
            margin-right: 0.06rem;
          }
        }
      }
    }
  }
}
</style>
