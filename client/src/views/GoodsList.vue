<template>
  <div>
    <NavBar />
    <Header />
    <div class="mall-container">
      <div class="filter-panel" :class="{ 'filterby-show': filterBy }">
        <div class="search-filter">{{$t('mall.allResults')}}</div>
        <div class="filter-group">
          <!-- here is just one filter group, which is Price -->
          <div class="filter-group-header">{{$t('mall.price')}}:</div>
          <div class="filter-group-items">
            <a href :class="{ cur: clickflag === 'all' }" @click.stop="setClickAll">{{$t('mall.all')}}</a>
          </div>
          <div class="filter-group-items" v-for="(price, index) in priceFilter" :key="index">
            <a
              href
              :class="{ cur: clickflag === index ? true : false }"
              @click="setClickFlag(index)"
              >{{ price.startPrice }}-{{ price.endPrice }}</a
            >
          </div>
        </div>
      </div>
      <div class="product-main">
        <div class="filter-nav">
          <span class="sortby">{{$t('mall.sortBy')}}: </span>
        </div>
        <!-- searched results list -->
        <div class="product-list" v-if="checkGoodsLen">
          <div class="product-card" v-for="item in goodsList" :key="item.id">
            <div class="pic">
              <a href="#">
                <img v-lazy="processImg(item.productImg)" />
              </a>
              <!--v-lazy图片懒加载-->
            </div>
            <div class="main">
              <div class="name">{{ item.productName }}</div>
              <div class="details">
                <a
                  href="javascript:;"
                  :title="`${item.productDetails}`"
                  @click="viewDetails(item)"
                  >{{ item.productDetails }}</a
                >
              </div>
              <div class="price">{{ formatMoney(item.productPrice) }}</div>
              <div open-on-hover class="btn-area">
                <v-btn class="px-2 my-1" tile @click="viewDetails(item)">{{$t('mall.details')}}</v-btn>
                <v-btn class="px-2 my-1" tile color="primary lighten-1" dark @click="addCart(item)"
                  >{{$t('mall.addToCart')}}</v-btn
                >
              </div>
            </div>
          </div>
          <div class="my-3">
            <v-btn color="grey" dark="" @click="loadMore()">{{$t('mall.loadMore')}}</v-btn>
          </div>
        </div>
        <div
          v-if="!checkGoodsLen"
          width="100%"
          style="background:url(../../static/404.png) no-repeat center;"
        ></div>
      </div>
    </div>
    <v-snackbar v-model="snackbar">
      <span class="ml-4" v-html="snackText"></span>
      <v-btn small text color="primary" @click.native="snackbar = false">{{$t('closeBtn')}}</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import Header from '@/components/Header.vue';
const conf = require('../utils/conf');

export default {
  components: {
    NavBar,
    Header,
  },
  data() {
    return {
      // goodsList:[],
      priceFilter: [
        {
          startPrice: 0,
          endPrice: 500,
        },
        {
          startPrice: 500,
          endPrice: 1000,
        },
        {
          startPrice: 1000,
          endPrice: 2000,
        },
        {
          startPrice: 2000,
          endPrice: 5000,
        },
        {
          startPrice: 5000,
          endPrice: 10000,
        },
      ],
      filterBy: false,
      overLayFlag: false,
      sortFlag: '',
      clickflag: 'all',
      busy: false,
      isDefault: true,
      reqProductParams: {
        page: 1,
        pageSize: 8,
        priceLevel: this.clickflag,
      },
      snackbar: false,
      snackText: '',
      snackTimeOut: 2000,
    };
  },
  mounted() {
    //Be Noted that, the params needed to be written in curly brackets for GET requests...
    this.$store.dispatch('requestProducts', { params: this.reqProductParams });
  },

  computed: {
    goodsList() {
      return this.$store.getters['getProducts'];
    },
    checkGoodsLen() {
      return this.$store.getters['getProducts'].length > 0;
    },
  },
  methods: {
    defineSort() {
      let sort = '';
      if (this.sortFlag === true) {
        sort = 1;
      } else if (this.sortFlag === false) {
        sort = 0;
      }
      return sort;
    },
    viewDetails(item) {
      this.$router.push({
        path: `/goodsdetails?m=${item.productId}`,
      });
    },
    addCart(item) {
      //check login status first.
      if(this.$store.getters['isLoggedIn']) {
      //default qty is 1 unit
        var params = {
          pId: item.productId,
          pQty: 1,
        };
        this.$store.dispatch('addItemToCart', params);
        this.$store.dispatch('getCartList');
        this.snackbar = true;
        this.snackText = `Item [<span class='primary--text'> ${item.productName}</span> ] Added to cart`;
      } else {
        this.snackbar = true;
        this.snackText = `${ this.$t('cart.loginRequired') }`;
      }
    },
    loadMore() {
      this.busy = true;
      this.params.page++;
      this.$store.dispatch('requestProducts', {
        params: this.params,
        loadMoreFlag: true,
      });
    },
    formatMoney: function(value) {
      return new Intl.NumberFormat(conf.locale, {
        style: 'currency',
        currency: conf.currency,
      }).format(value);
    },
    processImg(img) {
      //processing multiple images products
      return `/static/${img.split(',')[0]}`;
    },
  },
};
</script>
<style scoped>
.mall-container {
  display: flex;
  font-family: 'moderat', sans-serif;
}

.filter-panel {
  flex: 0 1 auto;
  min-width: 150px;
  max-width: 230px;
  margin: 25px 30px;
  color: #605f5f;
  -webkit-transition: right 0.5s ease-out;
  transition: right 0.5s ease-out;
}

.filterby-show {
  right: 0;
  -webkit-transition: right 0.5s ease-out;
  transition: right 0.5s ease-out;
}

.search-filter {
  font-weight: bold;
  font-size: 16px;
  line-height: 2;
}

.filter-group {
  padding: 20px 0px;
  font-size: 14px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.09);
}
.filter-group-header {
  font-weight: bold;
  margin: 0 0 10px;
}

.filter-group-items {
  padding: 8px 0px;
  line-height: 1.1;
}

.filter-group-items a:hover,
.filter-group-items .cur {
  -webkit-transition: padding-left 0.3s ease-out;
  transition: padding-left 0.3s ease-out;
  border-left: 2px solid #ee7a23;
  padding-left: 15px;
}
.filter-group-items .cur {
  font-weight: bold;
}
/* end of left part filter */

.product-main {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -moz-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
}

.filter-nav {
  font-size: 14px;
  height: 55px;
  margin: 10px 35px 10px 0;
  padding: 0 10px;
  background: white;
  text-align: right;
  overflow: hidden;
}

.filter-nav a {
  margin: 0 10px;
}

.filter-nav a.cur,
.filter-nav a:hover {
  color: #ee7a23;
}

.filter-nav .sort-up .icon-arrow-short {
  -webkit-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  transform: rotate(180deg);
}

.filter-nav .filterby {
  right: 0;
  -webkit-transition: right 0.5s ease-out;
  transition: right 0.5s ease-out;
}

.product-list {
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-flex: 0;
  -moz-box-flex: 0;
  -webkit-flex: 0 1 auto;
  flex: 0 1 auto;
  -webkit-box-direction: normal;
  -moz-box-direction: normal;
  -webkit-box-orient: horizontal;
  -webkit-box-orient: horizontal;
  -webkit-flex-direction: row;
  -ms-flex-direction: row;
  flex-direction: row;
  flex-wrap: wrap;
  -ms-flex-wrap: wrap;
}
.product-card {
  -webkit-flex-basis: 23.2%;
  -ms-flex-preferred-size: 23.2%;
  flex-basis: 23.2%;
  max-width: 23.2%;
  margin-right: 1.5873%;
  margin-bottom: 1.5873%;
  background: #fff;
  border: 2px solid #e9e9e9;
  -webkit-transition: all 0.5s ease-out;
  transition: all 0.5s ease-out;
}

.product-card::after {
  visibility: hidden;
  display: block;
  content: ' ';
  clear: both;
}

.product-card:hover {
  border-color: #ee7a23;
  -webkit-transform: translateY(-5px);
  -ms-transform: translateY(-5px);
  transform: translateY(-5px);
  -webkit-box-shadow: 0 0 10px #999;
  box-shadow: 0 0 10px #999;
  -webkit-transition: all 0.5s ease-out;
  transition: all 0.5s ease-out;
}

.product-list.col-4 .product-card {
  width: 23.80952%;
  margin-right: 1.5873%;
  margin-bottom: 1.5873%;
}

.product-card .pic {
  overflow: hidden;
}

.product-card .pic a {
  display: block;
  width: 100%;
  height: 0;
  padding-bottom: 100%;
}

.product-card .pic img {
  width: 100%;
}

.product-card .main {
  padding: 20px 10px 10px 10px;
  font-size: 12px;
  display: block;
}
.product-card .main a {
  text-decoration: none;
  color: #605f5f;
}
.product-card .main .name {
  line-height: 20px;
  font-weight: bold;
  margin-bottom: 5px;
  text-overflow: ellipsis;
  overflow: hidden;
}

.product-card .main .details {
  height: 40px;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-card .main .price {
  float: left;
  line-height: 30px;
  color: #d1434a;
  font-size: 1.25em;
}

.product-card .main .quantity {
  float: right;
}
.product-card .main .btn-area {
  clear: both;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
</style>
