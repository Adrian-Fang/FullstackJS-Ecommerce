<template>
  <div>
    <NavBar />
    <Header />
    <div class="container">
      <div v-if="orderList.length">
        <v-card class="my-3 py-2" v-for="(order, index) in orderList" :key="index">
          <div class="ml-4" text-color="#626262">
            {{ $t('myOrders.order') }}
            <a href="/"
               class="text-decoration-none"
               text-color="#626262">#{{ order.orderId }}</a>
            <div class="text-caption #626262--text">{{ $t('myOrders.orderDate') }} {{ formatDate(order.createdAt) }}</div>
          </div>
          <div class="d-flex align-center"
               style="position:absolute; right: 8px;top: 10px;">
            <div>{{ $n((Number(order.subTotal) + Number(order.shipping) + Number(order.insurance) + Number(order.discount)), 'currency') }}</div>
            <div class="ml-4">
              <v-btn text class="primary" small @click="payOrder(order)" v-show="order.paymentStatus == 1 || order.paymentStatus == 2">{{ $t('myOrders.payNow') }}</v-btn>
              <v-chip small color="green lighten-2" dark v-show="order.paymentStatus === 3">{{ $t('myOrders.paid') }}</v-chip>
            </div>
          </div>
          <v-divider></v-divider>

          <v-row v-for="(p, index) in order.orderProducts" :key="index">
            <v-col sm="4">
              <div class="d-flex ml-4">
                <img class="product-image" width="80px" v-lazy="processImage(p.productImg)" :alt="p.productName" />
                <div class="py-1 ml-2"> <p>{{ p.productName }}</p></div>
              </div>
            </v-col>
            <v-col sm="2">
              <div class="font-weight-medium">
                {{ $n((Number(p.productPrice) + Number(p.productDiscount)) * Number(p.productQty), 'currency') }}
              </div>
              <div class="font-weight-light">×{{ p.productQty }}</div>
            </v-col>
            <v-col sm="2">
              <v-icon size="14">mdi-airplane-landing</v-icon>
              <span>{{ order.contactPerson }}</span>
            </v-col>
            <v-col sm="2">
              <v-chip class="text-caption"> {{ $t('myOrders.toDeliver') }}</v-chip>
            </v-col>
            <v-col sm="2">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on" color="red lighten-2" @click="deleteOneOrder(order)">
                    <v-icon>mdi-trash-can-outline</v-icon>
                  </v-btn>
                </template>
                <span>{{ $t('delete') }}</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on" color="blue lighten-2">
                    <v-icon>mdi-receipt</v-icon>
                  </v-btn>
                </template>
                <span>{{ $t('myOrders.invoice') }}</span>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-card>
      </div>
      <div class="text-center"
           v-if="!orderList.length">
        <div style="padding: 80px 0; font-size:16px; font-weight:500; color:#999;">
          {{ $t('myOrders.orderEmpty') }}
        </div>
        <v-btn color="primary px-2 mx-2"
               @click="continueShopping">{{$t('cart.goShopping')}}</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import Header from "@/components/Header.vue";
import { getOrders,payOneOrder, deleteOrder } from '../api/auth';
import { processImage } from '../utils/product';

export default {
  components: {
    NavBar,
    Header,
  },
  data() {
    return {
      orderList: [],
      deleteOrderTip: false,
      invoiceTip: false,
    };
  },
  mounted() {
    this.initOrderData()
  },
  methods: {
    initOrderData() {
      getOrders().then( res => {
      if (res.status == "1") {
        this.orderList = res.data;
      }
    })
    },
    continueShopping() {
      this.$router.push({ path: "/mall" });
    },
    deleteOneOrder(item) {
      let index = this.orderList.indexOf(item);
      deleteOrder({ orderId: item.orderId }).then( res => {
        console.log('delete order res: ', res);
        if(res.status == '1') {
          this.orderList.splice(index, 1);
        }
      })
    },
    payOrder(item) {
      payOneOrder({ orderId: item.orderId }).then( res => {
        if (res.status == "1") {
          console.log('paid for this order..')
          this.initOrderData();
        }
      })
    },

    formatDate(item) {
      return new Date(Date.parse(item)).toLocaleString();
    },
    processImage
  },
};
</script>
<style lang="scss" scoped>
.container {
  font-size: 14px;
}
.product-image {
  border: 1px solid #f5f5f5;
}
</style>
