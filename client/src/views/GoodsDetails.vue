<template>
  <div>
    <NavBar />
    <Header />
    <top-menu></top-menu>
    <div class="container">
      <div class="store-content" v-for="item in goodsList" :key="item.id">
        <v-card color="white">
          <div class="main-info">
            <div class="detail-gallery">
              <div class="main-pic lighten-1">
                <img :src="`static/${pics[mainPicIndex].trim()}`" :alt="item.productName" />
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
              <h4 class="pr-1">{{ item.productDetails }}</h4>
              <div class="text-right pr-4 pb-2">
                <v-rating
                  dense
                  size="16"
                  color="yellow darken-3"
                  background-color="grey darken-1"
                  empty-icon="$ratingFull"
                  half-increments
                  hover
                  v-model="rating"
                ></v-rating>
              </div>
              <div class="price">
                <div class="market text-decoration-line-through mb-1">¥ {{ marketPrice }}</div>
                <div class="promo">
                  ¥ {{ item.productPrice }}
                  <v-chip label color="pink" text-color="white" class="font-weight-thin px-1">In 3 Days</v-chip>
                </div>
                <div class="comment font-italic">* VAT included if applicable</div>
              </div>
              <div class="num mt-2">
                <span class="params-name">数量</span>
                <buy-num @edit-num="editNum" :limit="Number(item.limit_num)"></buy-num>
              </div>
              <div class="buy">
                <v-btn @click="addCart(item)" class="primary option-button">加入购物车</v-btn>
                <v-btn @click="checkout(product.productId)" disabled class="option-button ml-2">现在购买</v-btn>
              </div>
            </div>
          </div>
        </v-card>

        <!--产品信息-->
        <v-card>
          <v-tabs color="primary" slider-color="primary">
            <v-tab>商品描述</v-tab>
            <v-tab>产品参数</v-tab>
            <v-tab-item v-for="n in 2" :key="n">
              <v-container fluid>
                {{ item.desc }}
                <v-img :src="`static/details-img/${item.descImg}`" />
              </v-container>
            </v-tab-item>
          </v-tabs>
        </v-card>
      </div>
    </div>
    <v-snackbar v-model="snackbar">
      <span class="ml-4" v-html="snackText"></span>
      <v-btn small text color="primary" @click.native="snackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>
<script>
import NavBar from '@/components/NavBar.vue';
import Header from '@/components/Header.vue';
import TopMenu from '@/components/TopMenu.vue';
import BuyNum from '../components/buynum';
import axios from 'axios';
export default {
  components: {
    NavBar,
    'top-menu': TopMenu,
    Header,
    BuyNum,
  },
  data() {
    return {
      rating: 4.46,
      goodsList: [],
      product: {},
      mainPicIndex: 0,
      pics: [],
      marketPrice: 3000,
      tabs: ['商品描述', '产品参数'],
      cartQty: 1,
      snackbar: false,
      snackText: '',
      snackTimeOut: 2000,
    };
  },
  computed: {
    // ...mapState(['login', 'showMoveImg', 'showCart'])
  },
  mounted() {
    this.getdata();
  },
  methods: {
    getdata() {
      var m = this.$route.query.m;
      var param = {
        productId: m,
      };

      //TBD: move api call to @/api/goods modules
      axios
        .get('/getDetails', {
          params: param,
        })
        .then((res) => {
          res = res.data;
          this.pics = res.result[0].productImg.split(',');
          if (res.status === '1') {
            this.goodsList = res.result;
          }
        });
    },
    editNum(qty) {
      this.cartQty = qty;
    },
    addCart(item) {
      let params = {
        pId: item.productId,
        pQty: this.cartQty,
      };
      this.$store.dispatch('addItemToCart', params);
      this.snackbar = true;
      this.snackText = `Item [<span class='primary--text'> ${item.productName}</span> ] Added to cart`;
    },
    checkout(productId) {
      axios.get('/users/checkLogin').then((res) => {
        res = res.data;
        if (res.status === '1') {
          this.$router.push({
            path: '/checkout',
            query: { productId, num: this.cartQty },
          });
        } else if (res.status === '10001') {
        }
      });
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
      margin-bottom: 13px;
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
