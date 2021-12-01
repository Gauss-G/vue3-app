<template>
  <div class="draw-wrapper">
    <div class="mask" @click="closeIcon" />
    <div class="navigate-wrapper" @mouseleave="closeIcon">
      <div class="navigate-left">
        <div class="right-col">
          <div v-if="catalogList.length <= 0" class="navigate-loadding">
            <div class="t-cell">
              <div class="loader-inner line-spin-fade-loader">
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
              </div>
            </div>
          </div>
          <div class="main-list">
            <ul class="category-list">
              <li
                v-for="(catalog, index) in catalogList"
                :key="catalog.id"
                @mouseenter="showSecondMenu(catalog, index)"
              >
                <!-- <img v-lazy="catalog.iconImg" alt> -->
                <a :class="[currentCatalogId === catalog.id ? 'active' : '', 'name']">{{ catalog.name }}</a>
              </li>
            </ul>
          </div>
          <div v-if="catalogChild && catalogChild.length > 0" class="sub-list">
            <div v-for="(item) in catalogChild" :key="item.id" class="categoty-detail" span="3">
              <a class="categoty-box" :href="linkToList(item)">
                <div class="img-bg">
                  <img
                    v-if="item.error === 0"
                    :src="item.icon"
                    :alt="item.name"
                    width="100%"
                    height="100%"
                    @error="item.error = 1"
                  />
                  <img
                    v-else-if="item.error === 1"
                    v-lazy="item.icon2"
                    :alt="item.name"
                    width="100%"
                    height="100%"
                    @error="handleImageError(item)"
                  />
                  <img
                    v-else
                    v-lazy="$store.state.categoryDefaultImagerUrl"
                    :alt="item.name"
                    width="100%"
                    height="100%"
                  />
                </div>
                <div>{{ item.name }}</div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, defineProps, defineEmits, onMounted, computed, onUnmounted } from 'vue'
import categoryControl from 'composables/common/category'
import base from 'composables/base'
import { product } from '@/api/config'
import { generateLink } from '@/utils/index'

// import { getCategoryAll } from '~/api/catalogsServer'
// import { createCategoryAdapter } from '~/adapter/category'
// import { createProductAdapter } from '~/adapter/product'
const { locale } = base()
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  module: {
    type: String,
    default: '',
  },
})
const catalogList = ref([]) // 类目数据
const catalogChild = ref([]) // 二级类目
const currentCatalogId = ref('')
const currentCatalogIndex = ref(0)
const is_all = false
const CATEGORY_IMG_URL = 'https://res.app.ikea.cn/'
// 没有拿到分类数据时
const getCategoryList = async() => {
  const lang = locale.value
  const categoryList = await categoryControl(lang).getCatalogsAll()
  const list = []
  const imageVersion = new Date().getTime()
  for (let i = 0; i < categoryList.length; i++) {
    const mo = {
      bannerImg: '',
      children: [],
      id: categoryList[i].id,
      name: categoryList[i].name,
      url: categoryList[i].url,
    }
    mo.children = categoryList[i].subCategories.map((x) => {
      return {
        bannerImg:
              `${CATEGORY_IMG_URL}static/public/subcatalog/${x.id}/banner.jpg?v=${imageVersion}`,
        children: [],
        icon:
              `${CATEGORY_IMG_URL}static/public/subcatalog/${x.id}/thumbnail.png?v=${imageVersion}`,
        icon2:
              `${CATEGORY_IMG_URL
              }static/public/other_catalog/${
                x.id
              }/thumbnail.png?v=${
                imageVersion}`,
        error: 0,
        url: x.url,
        id: x.id,
        name: x.name,
      }
    })
    list.push(mo)
  }
  catalogList.value = list

  if (list.length > 0) {
    catalogChild.value = list[0]?.children
    currentCatalogId.value = list[0]?.id
  }
}
const showSecondMenu = (item, index) => {
  if (item.children && item.children.length > 0) {
    catalogChild.value = item.children
    currentCatalogId.value = item.id
  }
  else {
    catalogChild.value = []
  }
}
const handleImageError = async(item) => {
  // 找不到图时去找改分类下第一个产品的图
  const lang = locale.value
  const res = await product.getProductList({ category: item.id })
  if (res.isSuccess)
    item.icon2 = res.data.productListPage?.productWindow[0]?.mainImageUrl
    // 下面是获取商品场景图的
    // const productId = res.data.productListPage?.productWindow[0]?.id
    // const productResult = await product.getProductsByIdList(productId)
    // if (productResult.isSuccess)
    //   item.icon2 = productResult.data[0]?.sceneImage
    // else
    //   item.error = 2

  else item.error = 2
}
const linkToList = (item) => {
  if (!item.url?.includes('http'))
    return generateLink(item.url, locale.value)
  else
    return item.url
}
const emits = defineEmits(['close'])
const closeIcon = () => {
  emits('close')
}
onMounted(() => {
  getCategoryList()
})
</script>
<style lang="scss" scoped>
.navigate-loadding {
  width: 100%;
  display: table;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: white;

  .t-cell {
    display: table-cell;
    vertical-align: middle;
    text-align: center;

    .line-spin-fade-loader {
      transform: scale(0.7);
      top: -15px;
    }
  }
}

.draw-wrapper {
  position: absolute;
  // top: 60/16rem;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1000;

  .mask {
    position: fixed;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.4);
    z-index: 1001;
    overflow: hidden;
  }

  .navigate-wrapper {
    background-color: #fff;
    width: 100%;
    // height: 70%;
    height: 100vh;
    max-height: 560px;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1002;
    box-sizing: border-box;
    overflow: hidden;
    border-top: 1px solid #f5f5f5;
  }
}

.categoty-detail {
  text-align: center;
  margin-bottom: 0.4rem;
  cursor: pointer;
  width: calc(14.28% - 0.16rem);
  position: relative;
  min-width: 122px;

  .categoty-box {
    padding: 7px 23.5px;
    display: block;
    color: #484848;

    &:hover {
      background-color: #f5f5f5;
    }
  }

  .img-bg {
    position: relative;
    padding-bottom: 100%;
    overflow: hidden;
    margin-bottom: 5px;

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      mix-blend-mode: darken;
    }
  }
}

.side-more {
  padding: 14px 0 13px 10px;
  cursor: pointer;

  img {
    width: 0.16rem;
    height: 0.16rem;
    vertical-align: middle;
  }

  span {
    color: #111;
    font-size: 14px;
    line-height: 21px;
    padding-left: 7px;
    font-weight: bold;
  }
}

.left-col {
  width: 90px;
}

.navigate-wrapper {
  height: 100%;

  .navigate-left {
    display: flex;
    flex-direction: row;
    height: 100%;
    padding: 0 1rem 0 0.84rem;
    max-width: 1440px;
    margin: auto;
    min-width: 1000px;
  }

  .left-col {
    a {
      display: block;
      margin-top: 28px;
      width: 16px;
      height: 16px;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .right-col {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
    position: relative;

    .main-list {
      flex: 0 0 1.79rem;
      box-sizing: border-box;
      border-right: 1px solid #f5f5f5;
      overflow: hidden;

      .category-list {
        overflow-y: auto;
        height: 100%;
        margin-right: -0.2rem;
        padding-right: 0.2rem;
      }

      &::-webkit-scrollbar {
        width: 4px;
        height: 4px;
      }

      &::-webkit-scrollbar-track {
        background: #f6f6f6;
        border-radius: 2px;
      }

      &::-webkit-scrollbar-thumb {
        background: #dfdfdf;
        border-radius: 2px;
      }

      &::-webkit-scrollbar-thumb:hover {
        background: #fafafa;
      }

      &::-webkit-scrollbar-corner {
        background: #f6f6f6;
      }
    }

    .sub-list {
      flex: 1 1 auto;
      position: relative;
      overflow: hidden;
      overflow-y: auto;
      height: 100%;
      margin-right: -0.18rem;
      padding-right: 0.18rem;
      padding-top: 0.16rem;
      padding-left: 0.16rem;
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      align-content: flex-start;

      &::-webkit-scrollbar {
        width: 4px;
        height: 4px;
      }

      &::-webkit-scrollbar-track {
        background: #f6f6f6;
        border-radius: 2px;
      }

      &::-webkit-scrollbar-thumb {
        background: #dfdfdf;
        border-radius: 2px;
      }

      &::-webkit-scrollbar-thumb:hover {
        background: #fafafa;
      }

      &::-webkit-scrollbar-corner {
        background: #f6f6f6;
      }

      &::before {
        content: '';
        width: 1px;
        height: 97%;
        background-color: $border-color;
        position: absolute;
        left: -20px;
      }
    }

    .title {
      font-size: 22px;
      line-height: 32px;
      color: $text-normal;
      margin: 20px 0;
    }

    .category-list {
      li {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 14px 0 13px 10px;
        font-weight: bold;
        color: #111;
        cursor: pointer;

        img {
          width: 0.3rem;
          height: 0.3rem;
          vertical-align: middle;
          padding-right: 0.07rem;
        }

        .name {
          font-size: 14px;
          color: $text-normal;
        }

        .active {
          color: $activeColor;
        }
      }
    }
  }
}
</style>
