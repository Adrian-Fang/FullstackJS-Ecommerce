<template>
  <div class="container"
       background-color="#f4f4f4">
    <div class="checkout-header py-2">
      <img src="/static/logo.png"
           alt="ONE & mAll Checkout" />
      <div class="checkout-title lighten-2">| Checkout</div>
    </div>

    <div class="address-area-border mt-5"></div>
    <v-card outlined
            tile
            class="address pa-2">
      <div class="mt-1 d-flex">
        <h4 class="text--secondary">Delivery Address</h4>
        <v-spacer></v-spacer>
        <div v-show="userHasAddress">
          <v-btn text
                 class="text-caption text-secondary"
                 @click="showDialog = true">
            <v-icon size="18"
                    color="grey"
                    class="mr-1">mdi-map-marker-plus-outline</v-icon> Add
          </v-btn>
        </div>
      </div>
      <div v-if="!userHasAddress"
           class="pa-2">
        No address found,
        <v-btn class="d-inline-block pa-0"
               text
               small
               color="primary"
               @click="showDialog = true">Add Now</v-btn>
      </div>
      <div v-else
           class="mt-1 px-2 d-flex">
        <v-card outlined
                width="23%"
                v-for="(address, index) in addressData"
                :key="index"
                :class="{ active: selected == index }"
                class="mr-2"
                @click="selected = index">
          <div class="d-flex">
            <div class="address-selected-sign"
                 v-if="selected == index">
              <v-icon class="text-center px-auto"
                      size="18"
                      color="primary lighten-2">mdi-map-marker</v-icon>
            </div>
            <div>
              <div class="text-caption font-weight-medium pl-2">{{ address.userName }}</div>
              <div class="text-caption font-weight-medium pl-2">{{ address.tel }}</div>
            </div>
          </div>
          <v-divider color="#f2f2f2"></v-divider>
          <v-card-text class="address-full text-caption px-3 py-1">{{ address.fullAddress }}, {{ address.postCode }}</v-card-text>
        </v-card>
      </div>
    </v-card>

    <div class="d-flex mt-4 py-3 px-2">
      <v-card flat
              width="65%">
        <h4 class="text--secondary mb-2">Payment Options</h4>
        <div class="payment d-flex py-2">
          <v-card outlined
                  tile
                  background-color="transparent"
                  class="payment-option text-center"
                  v-for="(option, index) in paymentOptions"
                  :key="index"
                  :class="{ active: payOptSelected == index }"
                  @click="payOptSelected = index">
            <img :src="`/static/${option.img}`"
                 :alt="option.title" />
            <div class="text-center text-caption font-weight-medium">{{ option.title }}</div>
          </v-card>
        </div>
        <div class="option-detail"
             v-show="payOptSelected == 0">
          <v-form name="checkoutForm"
                  method="POST">
            <input type="hidden"
                   name="omiseToken"
                   v-model="omiseConfig.omiseToken" />
            <input type="hidden"
                   name="omiseSource"
                   v-model="omiseConfig.omiseSource" />
            <v-btn outlined
                   type="submit"
                   id="checkoutButton"
                   @click.prevent="handleOmiseFormSubmit"
                   color="indigo ">
              <v-icon class="mr-2">mdi-credit-card-outline</v-icon>Pay with Omise
            </v-btn>
          </v-form>
        </div>

        <h4 class="text--secondary mt-10 mb-2">Shipping Items</h4>
        <v-card flat
                class="cart-list-wrap mb-5">
          <div class="cart-item pl-2"
               v-for="item in checkoutItems"
               :key="item.cartId">
            <div class="thumbnail mt-1">
              <img :src="processImg(item.productImg)" />
            </div>
            <div class="desc mt-2 ml-3">
              <span class="font-weight-medium">{{ item.productName }}</span>
            </div>
            <div class="price mt-2">
              <span class="font-weight-medium">{{ formatMoney(item.productPrice) }}</span>
              <br />
              <span class="market text-decoration-line-through">{{ formatMoney(3000) }}</span>
            </div>
            <v-spacer></v-spacer>
            <div class="quantity mt-2">
              <div class="select-self-area text-center">
                <span class="select-ipt">×{{ item.qty }}</span>
              </div>
            </div>
          </div>
        </v-card>
      </v-card>
      <v-card width="32%"
              color="#fffefb"
              class="summary pa-3">
        <h4 class="text--secondary mb-2">Order Summary</h4>
        <div class="cost-item">
          <div class="ml-1">Sub-Total</div>
          <v-spacer></v-spacer>
          <div class="mr-1">{{ formatMoney(checkSubTotal) }}</div>
        </div>
        <div class="cost-item">
          <div class="ml-1">Shipping</div>
          <v-spacer></v-spacer>
          <div class="mr-1">{{ formatMoney(shipping) }}</div>
        </div>
        <div class="cost-item discount"
             v-if="discount != 0">
          <div class="ml-1">Discount</div>
          <v-spacer></v-spacer>
          <div class="mr-1">{{ formatMoney(discount) }}</div>
        </div>
        <div class="cost-item">
          <div class="ml-1 font-weight-bold">Total</div>
          <v-spacer></v-spacer>
          <div class="mr-1 font-weight-bold">{{ formatMoney(checkTotalAmount) }}</div>
        </div>
        <v-btn block
               class="mt-3"
               color="primary"
               :disabled="!isOrderComplete"
               @click="submitOrder">Place Order</v-btn>
      </v-card>
    </div>
    <v-dialog v-model="showDialog"
              max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Edit Delivery Address</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-form ref="newAddressForm"
                  v-model="validFlag">
            <v-row>
              <v-col cols="12"
                     sm="4"
                     md="4">
                <v-text-field dense
                              label="First Name*"
                              v-model="newAddress.firstName"
                              :rules="[rules.required]"></v-text-field>
              </v-col>
              <v-col cols="12"
                     sm="4"
                     md="4">
                <v-text-field dense
                              label="Last name*"
                              v-model="newAddress.lastName"
                              :rules="[rules.required]"></v-text-field>
              </v-col>
              <v-col cols="4"
                     sm="4">
                <v-text-field dense
                              type="number"
                              v-model="newAddress.contactNumber"
                              label="Contact Number*"
                              :rules="[rules.required]"></v-text-field>
              </v-col>
              <v-col cols="12"
                     sm="12">
                <v-text-field dense
                              v-model="newAddress.addressLineOne"
                              label="Address 1*"
                              placeholder="Room, Floor, Buildiing..."
                              :rules="[rules.required]"></v-text-field>
              </v-col>
              <v-col cols="12"
                     sm="12">
                <v-text-field dense
                              v-model="newAddress.addressLineTwo"
                              label="Address 2"></v-text-field>
              </v-col>
              <v-col cols="12"
                     sm="6">
                <v-text-field dense
                              v-model="newAddress.postalCode"
                              label="Postal Code*"
                              :rules="[rules.required]"></v-text-field>
              </v-col>
              <v-col cols="12"
                     sm="6">
                <v-text-field dense
                              v-model="newAddress.province"
                              label="State/Province*"
                              :rules="[rules.required]"></v-text-field>
              </v-col>
              <v-col cols="12"
                     sm="6">
                <v-text-field dense
                              v-model="newAddress.city"
                              label="City/District*"
                              :rules="[rules.required]"></v-text-field>
              </v-col>
              <v-col cols="12"
                     sm="6">
                <v-text-field dense
                              v-model="newAddress.county"
                              label="County/Sub-District*"
                              :rules="[rules.required]"></v-text-field>
              </v-col>
            </v-row>
          </v-form>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions class="pb-4 pr-4">
          <v-spacer></v-spacer>
          <v-btn color="accent"
                 @click="showDialog = false">Close</v-btn>
          <v-btn color="primary"
                 :disabled="!validFlag"
                 @click="addAddress">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar">
      <span class="ml-4"
            v-html="snackText"></span>
      <v-btn small
             text
             color="primary"
             @click.native="snackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import axios from "axios";
const conf = require("../utils/conf");
export default {
  data() {
    return {
      addressData: [],
      selected: 0,
      shipping: 12,
      discount: -10,
      payOptSelected: null,
      placeOrderClicked: false,
      validFlag: false,
      rules: {
        required: (value) => !!value || "Required Field",
        min: (v) => v.length > 8 || "Min 8 characters",
      },
      newAddress: {
        firstName: "",
        lastName: "",
        contactNumber: null,
        addressLineOne: "",
        addressLineTwo: "",
        postalCode: "",
        province: "",
        city: "",
        county: "",
      },
      showDialog: false,
      paymentOptions: [
        {
          title: "Credit/Debit Card",
          method: "Cards Online",
          img: "payment-options/option-card.svg",
        },
        {
          title: "AliPay",
          method: "AliPay",
          img: "payment-options/option_alipay.png",
        },
        {
          title: "WeChat Pay",
          method: "WeChat Pay",
          img: "payment-options/option_wechat.png",
        },
        {
          title: "Cash On Delivery",
          method: "Cash On Delivery (COD)",
          img: "payment-options/option_cod.svg",
        },
      ],
      omiseConfig: {
        publicKey: "pkey_test_5k17fds5v318ybg2vz3",
        currency: "THB",
        omiseToken: "",
        omiseSource: "",
      },
      snackbar: false,
      snackText: "",
      snackTimeOut: 2000,
    };
  },
  mounted() {
    this.getAddressList();
    var omiseScript = document.createElement("script");
    omiseScript.setAttribute("src", "https://cdn.omise.co/omise.js");
    document.head.appendChild(omiseScript);
  },
  computed: {
    userHasAddress() {
      return this.addressData.length > 0;
    },
    checkoutItems() {
      return this.$store.getters["checkedItems"];
    },
    checkSubTotal() {
      let amount = 0;
      this.checkoutItems.forEach((v, i) => {
        amount += v.productPrice * v.qty;
      });
      return amount;
    },
    checkTotalAmount() {
      return this.checkSubTotal + this.shipping;
    },
    isOrderComplete() {
      return (
        this.payOptSelected != null &&
        this.selected != null &&
        !this.placeOrderClicked
      );
    },
  },
  methods: {
    handleOmiseFormSubmit() {
      alert("you can use {Card No.: 4242424242424242} for testing");
      //OmiseCard.configure() must be called before OmiseCard.open(), otherwise the form won't open;
      OmiseCard.configure({
        publicKey: this.omiseConfig.publicKey,
        amount: this.checkTotalAmount * 100,
        currency: this.omiseConfig.currency,
        frameLabel: "One&Mall Co., Ltd.",
        submitLabel: "Confirm Amount",
      });
      // OmiseCard.configureButton("#checkoutButton", {

      // });
      // OmiseCard.attach();

      var form = document.querySelector("#checkoutForm");
      OmiseCard.open({
        //You can also do the configure here, such as
        //currency: "CNY",
        onCreateTokenSuccess: (nonce) => {
          if (nonce.startsWith("tokn_")) {
            this.omiseConfig.omiseToken = nonce;
          } else {
            this.omiseConfig.omiseSource = nonce;
          }
        },
        onFormClosed: () => {
          alert("form closed...");
        },
      });
    },
    //TBD: deal with network error
    getAddressList() {
      this.$store.dispatch("getAddress").then((res) => {
        if (res.status === "1") {
          // Be aware you cannot use = sign to do array value copy;
          this.addressData = Array.from(res.result);
        } else {
          this.selected = null;
        }
      });
    },
    addAddress() {
      this.$store
        .dispatch("addNewAddress", this.formatAddress(this.newAddress))
        .then((res) => {
          if (res.status === "1") {
            this.getAddressList();
            this.showDialog = false;
          }
        });
    },
    setAddressDefault(item) {
      this.addressData.forEach((list, index) => {
        if (item == list.addressId) {
          list.isDefault = 1;
        } else {
          list.isDefault = 0;
        }
      });
      let params = {
        addressId: item,
      };
      this.$store.dispatch("setDefaultAddress", params).then((res) => {
        res = res.data;
        if (res.status === "1") {
        }
      });
    },
    deleteAddress() {
      var index = this.addressData.indexOf(this.delAdr);
      var param = {
        addressId: this.delAdr.addressId,
      };
      axios
        .get("/users/delAdr", {
          params: param,
        })
        .then((res) => {
          res = res.data;
          if (res.status === "1") {
            this.addressData.splice(index, 1);
            this.mdShow = false;
          }
        });
    },
    submitOrder() {
      this.placeOrderClicked = true;
      //Step1: update table `cartlist`: set the checked-out products as checked=1;
      let checkedCartItemsId = [];
      this.$store.getters["checkedItems"].forEach((v, i) =>
        checkedCartItemsId.push(v.cartId)
      );
      //Step2: update `OMS_orders`;
      let params = {
        checkedCartItemsId: checkedCartItemsId,
        addressData: this.addressData[this.selected],
        paymentOption: this.paymentOptions[this.payOptSelected].method,
        subTotal: this.checkSubTotal,
        discount: this.discount,
        shipPrice: this.shipping,
        totalPrice: this.checkTotalAmount,
        omiseConfig: this.omiseConfig,
      };
      this.$store
        .dispatch("submitOrder", params)
        .then((res) => {
          if (res.status === "1") {
            this.snackbar = true;
            this.snackText = `Submitting your Order, #${res.orderId.slice(14)}`;
            setTimeout(() => {
              this.$router.push({
                path: `/complete?m=${res.orderId}`,
              });
            }, 2000);
            //Update the cartList after successfully checkout
            this.$store.dispatch("getCartList");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    formatMoney: function (value) {
      return new Intl.NumberFormat(conf.locale, {
        style: "currency",
        currency: conf.currency,
      }).format(value);
    },
    formatAddress: (item) => {
      let name = item.lastName.toUpperCase() + " " + item.firstName;
      let contactNumber = item.contactNumber;
      let fullAddress =
        item.addressLineOne +
        ", " +
        item.addressLineTwo +
        "; " +
        item.province +
        " - " +
        item.city +
        " - " +
        item.county;
      let postalCode = item.postalCode;
      let isDefault = item.isDefault;
      return { name, contactNumber, fullAddress, postalCode };
    },
    processImg(img) {
      //processing multiple images products
      return `/static/${img.split(",")[0]}`;
    },
  },
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
.address-area-border {
  height: 0.1875rem;
  width: 100%;
  background-image: repeating-linear-gradient(
    45deg,
    #465cec,
    #465cec 33px,
    transparent 0,
    transparent 41px,
    #f14343 0,
    #f14343 74px,
    transparent 0,
    transparent 82px
  );
}
.address {
  .active {
    border: 1px solid pink;
  }
  .address-selected-sign {
    line-height: 2;
    text-align: center;
    margin-left: 6px;
  }
  .address-full {
    line-height: 18px;
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
        width: 80px;
        height: 80px;
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
        border: 1px solid #f0f0f0;
        .input-sub,
        .input-add {
          min-width: 30px;
          line-height: 30px;
          color: #605f5f;
          font-size: 16px;
          display: inline-block;
          background: #f0f0f0;
        }
        .select-ipt {
          display: inline-block;
          width: 30px;
          min-width: 20px;
        }
      }
    }
  }
}
.payment {
  .payment-option {
    border: 1px solid #f3f3f3;
    width: 120px;
    height: 80px;
    padding: 3px;
    img {
      justify-self: center;
      height: 40px;
    }
  }
  .active {
    border: 1px solid pink;
  }
}

.summary {
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
  .discount {
    color: rgba($color: #d81a61, $alpha: 0.8);
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
</style>
