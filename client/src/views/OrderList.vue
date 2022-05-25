<template>
  <div>
    <NavBar />
    <Header />
    <div class="container">
      <div v-if="orderList.length">
        <v-card class="my-3 py-2"
                v-for="(order, index) in orderList"
                :key="index">
          <div class="ml-4"
               text-color="#626262">
            Order
            <a href="/"
               class="text-decoration-none"
               text-color="#626262">#{{ order.orderId }}</a>
            <div class="text-caption #626262--text">Placed On {{ formatDate(order.createdAt) }}</div>
          </div>
          <div class="d-flex align-center"
               style="position:absolute; right: 8px;top: 10px;">
            <div>{{ formatMoney(order.subTotal + order.shipping + order.insurance + order.discount) }}</div>
            <div class="ml-4">
              <v-btn text
                     class="primary"
                     small
                     @click="payOrder(order)"
                     v-show="order.paymentStatus == 1">Pay Now</v-btn>
              <v-btn text
                     class="primary"
                     small
                     @click="payOrder(order)"
                     v-show="order.paymentStatus == 2">Pay Now</v-btn>
              <v-chip small
                      color="green lighten-2"
                      dark
                      v-show="order.paymentStatus === 3">Paid</v-chip>
            </div>
          </div>
          <v-divider></v-divider>

          <v-row v-for="(p, index) in order.orderProducts"
                 :key="index">
            <v-col sm="4">
              <div class="d-flex ml-4">
                <img class="product-image"
                     width="80px"
                     v-lazy="processImg(p.productImg)"
                     :alt="p.productName" />
                <div class="py-1 ml-2">
                  <p>{{ p.productName }}</p>
                </div>
              </div>
            </v-col>
            <v-col sm="2">
              <div class="font-weight-medium">
                {{ formatMoney((p.productPrice + p.productDiscount) * p.productQty) }}
              </div>
              <div class="font-weight-light">×{{ p.productQty }}</div>
            </v-col>
            <v-col sm="2">
              <v-icon size="14">mdi-airplane-landing</v-icon>
              <span>{{ order.contactPerson }}</span>
            </v-col>
            <v-col sm="2">
              <v-chip class="text-caption">To Deliver</v-chip>
            </v-col>
            <v-col sm="2">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon
                         v-bind="attrs"
                         v-on="on"
                         color="red lighten-2"
                         @click="delOrderList(order)">
                    <v-icon>mdi-trash-can-outline</v-icon>
                  </v-btn>
                </template>
                <span>Delete Order</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon
                         v-bind="attrs"
                         v-on="on"
                         color="blue lighten-2">
                    <v-icon>mdi-receipt</v-icon>
                  </v-btn>
                </template>
                <span>Check Invoice</span>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-card>
      </div>
      <div class="text-center"
           v-if="!orderList.length">
        <div style="padding: 80px 0; font-size:16px; font-weight:500; color:#999;">
          You haven't placed any order yet
        </div>
        <v-btn color="primary px-2 mx-2"
               @click="continueShopping">Shopping Now</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import Header from "@/components/Header.vue";
import axios from "axios";
const conf = require("../utils/conf");
export default {
  components: {
    NavBar,
    Header,
  },
  data() {
    return {
      orderList: [],
      totalPrice: "",
      orId: "",
      deleteOrderTip: false,
      invoiceTip: false,
    };
  },
  mounted() {
    this.getOrderData();
  },
  methods: {
    continueShopping() {
      this.$router.push({ path: "/mall" });
    },
    getOrderData() {
      axios.get("/users/getOrderData").then((res) => {
        res = res.data;
        if (res.status == "1") {
          this.orderList = res.result;
        }
      });
    },
    delOrderList(item) {
      var index = this.orderList.indexOf(item);
      var param = {
        orderId: item.orderId,
      };
      axios
        .get("/users/delOrder", {
          params: param,
        })
        .then((res) => {
          res = res.data;
          if (res.status == "1") {
            this.orderList.splice(index, 1);
          }
        });
    },
    payOrder(item) {
      this.mdShow = true;
      this.totalPrice = item.totalPrice;
      this.orId = item.orderId;
    },
    pay() {
      var param = {
        orderId: this.orId,
      };
      axios
        .get("/users/updateOrder", {
          params: param,
        })
        .then((res) => {
          res = res.data;
          if (res.status == "1") {
            setTimeout(() => {
              this.mdShow = false;
              this.$router.push({
                path: `/orderlist`,
              });
            }, 6000);
          }
        });
    },
    formatDate(item) {
      return new Date(Date.parse(item)).toLocaleString();
    },
    formatMoney: function (value) {
      return new Intl.NumberFormat(conf.locale, {
        style: "currency",
        currency: conf.currency,
      }).format(value);
    },
    processImg(img) {
      //processing multiple images products
      return `/static/${img.split(",")[0]}`;
    },
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
