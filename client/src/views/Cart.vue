<template>
  <div>
    <nav-bar></nav-bar>
    <nav-header></nav-header>
    <div class="container">
      <div class="empty-cart" v-if="cartList.length == 0">
        <div class="content">
          <p class="font-weight-light mt-5 mb-5">{{$t('cart.cartEmpty')}}</p>
          <v-img contain src="static/empty-cart.png" width="400px" class="mx-auto" />
          <v-btn class="my-5" color="primary lighten-2" @click="$router.push('/mall')"
            >{{$t('cart.goShopping')}}</v-btn
          >
        </div>
      </div>

      <div class="cart-container mt-5" v-else>
        <v-card class="cart">
          <v-card flat dense class="cart-list-header pl-2">
            <v-checkbox
              v-model="allSelected"
              color="primary"
              :indeterminate="partialSelected"
              @click.native.prevent="toggleSelectAll()"
            ></v-checkbox>
            <span>{{$t('cart.selectAll')}}</span>
            <span v-if="selectedCount" class="selected">
              ({{$t('cart.selected')}}
              <em class="font-weight-bold primary--text">{{ selectedCount }}</em> {{$t('cart.item')}})
            </span>
          </v-card>

          <v-card flat class="cart-list-wrap">
            <div class="cart-item pl-2" v-for="item in cartList" :key="item.productId">
              <v-checkbox v-model="selectedList" :value="`${item.productId}`"></v-checkbox>
              <div class="thumbnail mt-1">
                <img :src="processImage(item.productImg)" />
              </div>
              <div class="desc mt-2 ml-3">
                <span class="font-weight-medium">{{ item.productName }}</span>
              </div>
              <div class="price mt-2">
                <span class="font-weight-medium primary--text">{{ $n(item.productPrice, 'currency')}}</span>
                <br />
                <span class="market text-decoration-line-through">{{ $n(3000, 'currency') }}</span>
              </div>
              <v-spacer></v-spacer>
              <div class="quantity mt-2">
                <div class="select-self-area">
                  <a class="input-sub" @click="editQty(item, -1)">-</a>

                  <span class="select-ipt">{{ item.qty }}</span>
                  <a class="input-add" @click="editQty(item, 1)">+</a>
                </div>
              </div>
            </div>
          </v-card>
        </v-card>
        <v-dialog v-model="dialog" width="500px" transition="dialog-transition">
          <v-card>
            <v-card-title class="headline grey lighten-2 text-h6 py-2">{{$t('cart.cartAlertHeader')}}</v-card-title>
            <v-card-text class="py-2">
              You've only 1 unit left for this item, you are going to remove this item from your
              cart?
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="info" text @click="dialog = false">
                {{$t('cart.keepIt')}}
              </v-btn>
              <v-btn color="error " text @click="handleDeleteCartItem()">
                {{$t('cart.delete')}}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-spacer></v-spacer>
        <v-card class="summary pa-3">
          <div class="location mb-1">{{$t('cart.shipTo')}}</div>
          <v-icon color="#999999">mdi-map-marker-radius-outline</v-icon>
          <span class="region ml-1">{{ userLocation }}</span>
          <v-divider class="my-3"></v-divider>

          <h4>{{$t('cart.orderSummary')}}</h4>
          <div class="cost-item">
            <div class="ml-1">{{$t('cart.subTotal')}}</div>
            <v-spacer></v-spacer>
            <div class="mr-1">{{ $n(calcSubTotal, 'currency') }}</div>
          </div>
          <div class="cost-item">
            <div class="ml-1">{{$t('cart.shippingFee')}}</div>
            <v-spacer></v-spacer>
            <div class="mr-1">{{ $n(shipping, 'currency') }}</div>
          </div>
          <div class="promo-code my-2">
            <input v-model="promoCode" placeholder="Enter Promo Code" />
            <v-btn tile depressed color="gray darken-4 gray--text" class="apply-btn">{{$t('cart.applyCoupon')}}</v-btn>
          </div>
          <div class="cost-item">
            <div class="ml-1 font-weight-bold">{{$t('cart.total')}}</div>
            <v-spacer></v-spacer>
            <div class="mr-1 font-weight-bold">{{ $n(calcTotal, 'currency') }}</div>
          </div>
          <v-btn class="mt-3" block color="primary" :disabled="!selectedCount" @click="checkOut"
            >{{$t('cart.checkout')}}</v-btn
          >
        </v-card>
      </div>
    </div>
    <v-snackbar v-model="snackbar">
      <span class="ml-4" v-html="snackText"></span>
      <v-btn class="px-1 py-1" text color="primary" @click.native="snackbar = false">{{$t('closeBtn')}}</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import Header from '@/components/Header.vue';
import { processImage } from '../utils/product';

export default {
  components: {
    'nav-bar': NavBar,
    'nav-header': Header,
  },
  data() {
    return {
      selectedList: [],
      userLocation: 'กรุงเทพมหานคร/ Bangkok,จตุจักร/ Chatuchak,10900',
      promoCode: '',
      shipping: 0,
      dialog: false,
      itemToDelete: {},
      snackbar: false,
      snackText: '',
      snackTimeOut: 2000,
    };
  },
  mounted() {
    if(this.$store.getters['isLoggedIn']) {
      this.$store.dispatch('getCartList');
    }
  },
  computed: {
    cartList() {
      return this.$store.getters['cartItems'];
    },
    selectedCount() {
      return this.selectedList.length;
    },
    partialSelected() {
      if (this.selectedCount > 0 && this.selectedCount < this.cartList.length) {
        return true;
      } else {
        return false;
      }
    },
    allSelected() {
      return this.selectedCount == this.cartList.length;
    },
    calcSubTotal() {
      let subTotal = 0;
      var _this = this;
      this.cartList.forEach((item) => {
        if (_this.selectedList.includes(item.productId.toString())) {
          subTotal += item.productPrice * item.qty;
        }
      });
      return subTotal;
    },
    calcTotal() {
      return this.calcSubTotal + this.shipping;
    },
  },
  methods: {
    processImage,
    editQty(item, flag) {
      if (item.qty + flag > 0) {
        let params = {
          pId: item.productId,
          pQty: flag,
        };
        this.$store.dispatch('addItemToCart', params);
      } else {
        this.dialog = true;
        this.itemToDelete = item;
      }
    },
    handleDeleteCartItem() {
      let params = {
        pId: this.itemToDelete.productId,
      };
      this.$store.dispatch('delCartItem', params);
      this.$store.dispatch('getCartList');
      this.dialog = false;
      this.$nextTick(() => {
        this.snackText = `Item [<span class='primary--text'> ${this.itemToDelete.productName}</span> ] deleted from cart`;
        this.snackbar = true;
        this.itemToDelete = {};
      });
    },
    checkOut() {
      //add items from Cart to checkout list
      this.$store.commit('CHECKOUT', this.selectedList);
      this.$router.push({
        path: '/checkout',
      });
    },
    toggleSelectAll() {
      console.log(this.selectedList);
      if (this.allSelected) {
        this.selectedList.splice(0, this.selectedList.length);
      } else {
        this.selectedList.splice(0, this.selectedList.length);
        this.cartList.forEach((v) => {
          this.selectedList.push(v.productId.toString());
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  margin: 0 auto;
  padding: 0;
}

.empty-cart {
  min-height: 320px;
}
.empty-cart .content {
  text-align: center;
}

.cart-container {
  display: flex;
  padding-bottom: 50px;
  .cart {
    width: 65%;
    margin: 0 auto;
    .cart-list-header {
      display: flex;
      margin-bottom: 15px;
      align-items: center;
      .selected {
        margin: 0 5px;
        font-size: 12px;
        color: #605f5f;
      }
    }
    .cart-list-wrap {
      padding: 0 5px;
      .cart-item {
        display: flex;
        margin-bottom: 5px;
        border-bottom: 1px solid #f0f0f0;
        .thumbnail {
          img {
            width: 70px;
            height: 70px;
          }
        }
        .desc {
          width: 40%;
          min-width: 200px;
          font-size: 14px;
        }
        .price {
          font-size: 18px;
          .market {
            font-size: 12px;
            color: #605f5f;
          }
        }
        .quantity {
          justify-self: flex-end;
          margin-right: 5px;
          .select-self-area {
            line-height: 18px;
            text-align: center;
            border: 1px solid #f0f0f0;
            .input-sub,
            .input-add {
              width: 18px;
              line-height: 18px;
              color: #605f5f;
              display: inline-block;
              background: #f0f0f0;
            }
            .select-ipt {
              display: inline-block;
              font-size: 14px;
              min-width: 16px;
            }
          }
        }
      }
    }
  }
  .summary {
    width: 33%;
    height: 100%;
    margin: 0 auto;
    color: #605f5f;
    .location {
      font-size: 14px;
    }
    .region {
      font-size: 12px;
    }
    .cost-item {
      display: flex;
      margin: 5px 0;
    }
    .promo-code {
      display: flex;
      input {
        line-height: 2;
        width: 100%;
        padding: 2px 8px;
        margin: 0;
        font-size: 14px;
        color: #605f5f;
        border: 2px solid #f0f0f0;
      }
      input:focus {
        outline: none;
        box-shadow: none;
        -webkit-box-shadow: none;
      }
      .apply-btn {
        margin: 0;
        display: inline-block;
      }
    }
  }
}
</style>
