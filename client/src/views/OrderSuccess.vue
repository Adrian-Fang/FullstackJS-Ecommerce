<template>
  <div class="container"
       background-color="#f4f4f4">
    <div class="checkout-header py-2">
      <img src="/static/one-mall-logo.png"
           alt="ONE-MALL Checkout" />
      <div class="checkout-title lighten-2">| {{$t('cart.checkoutPage')}}</div>
    </div>

    <v-card class="mt-2 pa-3">
      <div class="pa-2 d-flex align-center">
        <v-icon class="d-block mr-2"
                size="60"
                color="green">mdi-comment-check</v-icon>
        <div class="d-block py-5">
          <div class="text-h6 green--text">{{$t('checkout.orderSuccess')}}</div>
          <div class="text-h6 green--text">{{$t('checkout.thanksForBuying')}}</div>
        </div>
      </div>
      <div class="mt-5 text-center py-5">
        <div class="font-weight-bold">{{$t('checkout.orderId')}}: #{{ orderId }}</div>
        <div class="my-5">{{$t('checkout.suceessMessage')}}</div>
        <div class="py-5 ma-5">
          <v-btn color="primary px-2 mx-2"
                 @click="viewOrders">{{$t('checkout.viewOrder')}}</v-btn>
          <v-btn color="primary px-2 mx-2"
                 @click="continueShopping">{{$t('checkout.continueShopping')}}</v-btn>
        </div>
      </div>
    </v-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      orderId: ""
    };
  },
  mounted() {
    this.orderId = this.$route.query.m;
    if(!this.orderId) {
        this.$router.push('/mall')
    }
  },
  methods: {
    viewOrders() {
      this.$router.push({ path: "/orders" });
    },
    continueShopping() {
      this.$router.push({ path: "/mall" });
    },
  },
};
</script>

<style lang="scss" scoped>
.checkout-header {
  display: flex;
  align-items: flex-start;
  img {
    height: 36px;
  }
  .checkout-title {
    margin-left: 5px;
    font-size: 18px;
    color: #d81b60;
    text-align: center;
    line-height: 24px;
  }
}
</style>
