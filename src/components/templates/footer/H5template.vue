<template>
  <div class="ikea-footer">
    <footer>
      <ul>
        <li v-for="(item, index) in menuList" :key="index" :class="{'active':active===index}" @click="goLink(item)">
          <div>
            <i-icon :component-name="item.icon" size=".2rem" />
          </div>
          <p>{{ t(item.i18nKey) }}</p>
        </li>
      </ul>
    </footer>
  </div>
</template>
<script lang="ts" setup>
import base from 'composables/base'
import { ref } from 'vue'
import IIcon from 'atoms/IIcon/IIcon.vue'
import { useI18n } from 'vue-i18n'
import { generateLink } from '@/utils'

const { t } = base()

const menuList = ref([{
  icon: 'HomeIcon',
  i18nKey: 'links.index',
  link: '/',
}, {
  icon: 'SquareGridIcon',
  i18nKey: 'links.category',
  link: '/guide/category/',
}, {
  icon: 'MapIcon',
  i18nKey: 'links.more',
  link: '/more/more/',
}, {
  icon: 'ShoppingBagIcon',
  i18nKey: 'links.cart',
  link: '/pay/cart/',
}, {
  icon: 'PersonIcon',
  i18nKey: 'links.home',
  link: '/profile/myprofile/',
}])
const active = ref(5)
const { locale } = useI18n()
const goLink = (item) => {
  window.location.href = generateLink(item.link, locale.value)
}
</script>
<style lang="scss" scoped>
.ikea-footer {
  border-top: 1px solid #eee;

  footer {
    ul {
      display: -webkit-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      -webkit-box-sizing: border-box;
      width: 100%;
      height: 0.5rem;
      z-index: 5;

      li {
        -webkit-box-flex: 1;
        height: 100%;
        font-size: 0;
        width: 100%;
        text-align: center;
        display: block;
        color: #959595;
        padding: 0.1rem 0;

        div {
          margin: -0.02rem 0 0.02rem;
        }

        p {
          font-size: 0.12rem;
          line-height: 0.16rem;
          display: inline-block;
          white-space: nowrap;
        }
      }

      .active {
        color: #0058a3;
      }
    }
  }
}
</style>
