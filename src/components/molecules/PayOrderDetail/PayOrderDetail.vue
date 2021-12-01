<template>
  <div class="pay-order-articles">
    <div class="order-title">
      订单明细
    </div>
    <div class="order-articles">
      <ul>
        <li>
          <label>商品小计</label>
          <p>
            <span>¥234.00</span>
          </p>
        </li>
        <li>
          <label>配送费</label>
          <p>
            <span>¥234.00</span>
          </p>
        </li>
        <li>
          <label>优惠券</label>
          <p>
            <span>¥234.00</span>
          </p>
        </li>
        <li>
          <label>促销优惠</label>
          <p>
            <span>¥234.00</span>
          </p>
        </li>
        <li>
          <label>会员优惠</label>
          <p>
            <span class="blueColor">¥234.00</span>
          </p>
        </li>
      </ul>
    </div>
    <div class="order-articles-br"></div>
    <div class="order-price">
      <label>应付金额</label>
      <p><span>¥</span><span>123123</span><span>.00</span></p>
    </div>
    <div class="order-price-tips">
      <img src="https://static.web.ikea.cn/static/images/pay/pay/warning.svg" alt="" />
      <span>此费用不包含安装服务费</span>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed, toRefs } from 'vue'

export default defineComponent({

})
</script>

<style lang="scss" scoped>
.pay-order-articles {
  font-size: 0.14rem;
  line-height: 0.21rem;
  color: #484848;

  .order-title {
    font-style: normal;
    font-weight: bold;
    font-size: 0.18rem;
    line-height: 0.27rem;
    color: #111;
  }

  .order-articles {
    padding: 0.3rem 0 0.4rem 0;

    ul li {
      display: flex;
      margin-top: 20px;

      &:first-child {
        margin: 0;
      }

      p {
        flex: 1;
        text-align: right;
        color: #111;
        font-weight: bold;
      }

      .blueColor {
        color: #0058a3;
      }
    }
  }

  .order-articles-br {
    background: #111;
    height: 2px;
  }

  .order-price {
    margin-top: 0.36rem;
    display: flex;

    p {
      flex: 1;
      text-align: right;
      color: #111;
      font-weight: bold;

      span {
        font-size: 0.14rem;
        line-height: 0.14rem;
        vertical-align: top;
      }

      span:nth-child(2) {
        font-size: 0.24rem;
        line-height: 0.22rem;
      }
    }
  }

  .order-price-tips {
    text-align: right;
    margin-top: 5px;
    font-size: 0.12rem;
    line-height: 0.18rem;
    color: #666;
  }
}
</style>
