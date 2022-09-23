<template>
  <div>
    <NavBar />
    <Header />
    <div class="container">
      <div class="store-content"
           v-for="item in goodsList"
           :key="item.id">
        <v-card color="white">
          <div class="main-info">
            <div class="detail-gallery">
              <div class="main-pic lighten-1">
                <img :src="`static/${pics[mainPicIndex].trim()}`"
                     :alt="item.productName" />
              </div>
              <div class="thumbnail">
                <ul v-for="(img, index) in pics" :key="index">
                  <li @click="mainPicIndex = index" :class="{ active: mainPicIndex == index }">
                    <img v-lazy="`static/${img.trim()}`" :alt="item.productName" />
                    <span class="triangle"></span>
                  </li>
                </ul>
              </div>
            </div>
            <!--右边-->
            <div class="detail-right">
              <h4>{{ item.productName }}</h4>
              <h5 class="sub_title">{{ item.sub_title }}</h5>
              <p class="desc">{{ item.productDetails }}</p>
              <div class="text-right pr-4 pb-2">
                <v-rating dense
                          size="16"
                          color="yellow darken-3"
                          background-color="grey darken-1"
                          empty-icon="$ratingFull"
                          half-increments
                          hover
                          v-model="rating"></v-rating>
              </div>
              <div class="price">
                <div class="market text-decoration-line-through mb-1"> {{ $n(marketPrice, 'currency') }}</div>
                <div class="promo">
                  {{ $n(item.productPrice, 'currency') }}
                  <v-chip label color="pink" text-color="white" class="font-weight-thin px-1">In 3 Days</v-chip>
                </div>
                <div class="comment font-italic">* {{$t('mall.taxIncluded')}}</div>
              </div>
              <div class="num mt-2">
                <span class="params-name">{{$t('mall.available')}}</span>
                <buy-num @edit-num="editNum" :limit="Number(item.limit_num)"></buy-num>
              </div>
              <div class="buy">
                <v-btn @click="addCart(item)" class="primary option-button">{{$t('mall.addToCart')}}</v-btn>
                <v-btn @click="checkout(product.productId)" :disabled="!userLoggedin" class="option-button ml-2">{{$t('mall.buyNow')}}</v-btn>
              </div>
            </div>
          </div>
        </v-card>

        <!--产品信息-->
        <v-card>
          <v-tabs color="primary"
                  v-model="tab">
            <v-tabs-slider color="primary"></v-tabs-slider>
            <v-tab>{{$t('mall.productDesc')}}</v-tab>
            <v-tab>{{$t('mall.productSpecs')}}</v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item v-for="n in 2" :key="n">
              <v-card flat  min-height="500px" class="pa-3">
                {{ item.description }}
                <v-img class="mx-auto" :src="`/static/details-img/${item.descImg}`" />
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </div>
    </div>
    <v-snackbar v-model="snackbar">
      <span class="ml-4" v-html="snackText"></span>
      <v-btn small text color="primary" @click.native="snackbar = false">{{$t('closeBtn')}}</v-btn>
    </v-snackbar>
  </div>
</template>
<script>
import NavBar from "@/components/NavBar.vue";
import BuyNum from "@/components/buynum.vue";
import Header from "@/components/Header.vue";
import { getProductDetail } from '../api/auth';

export default {
  components: {
    NavBar,
    Header,
    BuyNum
  },
  data() {
    return {
      tab: null,
      rating: 4.46,
      goodsList: [],
      product: {},
      mainPicIndex: 0,
      pics: [],
      marketPrice: 3000,
      tabs: ["商品描述", "产品参数"],
      cartQty: 1,
      snackbar: false,
      snackText: "",
      snackTimeOut: 2000,
    };
  },
  computed: {
    // ...mapState(['login', 'showMoveImg', 'showCart'])
    userLoggedin() {
      return this.$store.getters['isLoggedIn'];
    }
  },
  mounted() {
    getProductDetail(this.$route.params).then((res) => {
      let itemImage = res.data[0]?.productImg || null;
      if(itemImage) {
        this.pics = res.data[0].productImg.split(",");
      } else {
        this.pics.push('default.png'); // there is this default picture for product items
      }
      if (res.status == "1") {
          this.goodsList = res.data;
      }
    });
  },
  methods: {
    editNum(qty) {
      this.cartQty = qty;
    },
    addCart(item) {
      if(this.$store.getters['isLoggedIn']) {
        let params = {
          pId: item.productId,
          pQty: this.cartQty,
        }; 
        this.$store.dispatch("addItemToCart", params);
        this.snackbar = true;
        this.snackText = `[<span class='primary--text'> ${item.productName}</span> ] Added to cart`;
      } else {
        this.snackbar = true;
        this.snackText = `${ this.$t('cart.loginRequired') }`;
      }
      
    },
    checkout(productId) {
      if(this.userLoggedin){
        this.$router.push({ path: "/checkout", query: { productId, num: this.cartQty } });
      } else {
        console.log("You're not logged in, sucker");
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  width: 75%;
  min-width: 760px;
  margin: 0 auto;
}
.store-content {
  min-height: 600px;
  background-color: #f4f4f4;
}

.main-info {
  display: flex;
  margin-bottom: 20px;
  .detail-gallery {
    padding: 15px;
    // width: 360px;
    .main-pic {
      border: 2px grey solid;
      padding: 5px;
      margin-bottom: 15px;
      img {
        width: 360px;
        height: 360px;
      }
    }
    .thumbnail {
      display: flex;
      ul {
        padding-left: 15px;
        li {
          list-style-type: none;
          width: 47px;
          height: 47px;
          cursor: pointer;
          img {
            width: 100%;
          }
        }
        .active {
          border: 2px solid red;
          .triangle {
            width: 0;
            height: 0;
            display: inline-block;
            zoom: 1;
            position: relative;
            top: -74px;
            left: 50%;
            border-style: solid;
            border-width: 12px 6px;
            border-color: transparent transparent red;
            margin-left: -5px;
          }
        }
      }
    }
  }
  // 右边
  .detail-right {
    width: 580px;
    padding-top: 10px;
    h4 {
      font-size: 16px;
      font-weight: 700;
      line-height: 1.25;
      color: #000;
      margin-bottom: 10px;
    }
    .sub_title {
      color:#d44d44;
    }
    .desc {
      margin-top:5px;
      font-size: 14px;
    }
    .sku-custom-title {
      overflow: hidden;
      padding: 8px 8px 18px 10px;
      position: relative;
    }
    .params-name {
      padding: 0 20px 0 10px;
      font-size: 14px;
      color: #8d8d8d;
      line-height: 36px;
    }
    .num {
      display: flex;
      align-items: center;
    }
    .buy {
      margin-top: 15px;
      .option-button {
        height: 40px;
        line-height: 40px;
      }
    }
  }
}

.price {
  background-color: #f4f4f4;
  border-radius: 3px;
  padding: 10px;
  .promo {
    color: #d44d44;
    font-weight: 700;
    font-size: 24px;
  }
  .comment {
    margin-top: 5px;
    font-size: 12px;
    font-weight: 500;
    color: gray;
  }
}
</style>
