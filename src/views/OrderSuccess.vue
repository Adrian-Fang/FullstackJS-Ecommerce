<template>
  <div class="container" background-color="#f4f4f4">
    <div class="checkout-header py-2">
      <img src="/static/logo.png" alt="ONE & mAll Checkout" />
      <div class="checkout-title lighten-2">| Checkout</div>
    </div>

    <v-card class="mt-2 pa-3">
      <div class="pa-2 d-flex align-center">
        <v-icon class="d-block mr-2" size="60" color="green">mdi-comment-check</v-icon>
        <div class="d-block py-5">
          <div class="text-h6 green--text">Order Created Successfully</div>
          <div class="text-h6 green--text">Thanks for purchasing on ONE&mALL!</div>
        </div>
      </div>
      <div class="mt-5 text-center py-5">
        <div class="font-weight-bold">Order ID: #{{ orderId }}</div>
        <div class="my-5">We're processing this order with all efforts, please wait for futher notifications.</div>
        <div class="py-5 ma-5">
          <v-btn color="primary px-2 mx-2" @click="viewOrders">View Orders</v-btn>
          <v-btn color="primary px-2 mx-2" @click="continueShopping">Continue Shopping</v-btn>
        </div>
      </div>
    </v-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      orderId: '',
      totalPrice: '',
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.orderId = this.$route.query.m;
    },
    viewOrders() {
      this.$router.push({ path: '/orderlist' });
    },
    continueShopping() {
      this.$router.push({ path: '/mall' });
    },
  },
  components: {},
};
</script>

<style lang="scss" scoped>
.checkout-header {
  display: flex;
  vertical-align: middle;
  img {
    height: 24px;
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
