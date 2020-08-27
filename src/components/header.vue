<template>
  <div class="header-container py-3">
    <div class="logo">
      <a href="/">
        <img src="/static/logo.png" />
      </a>
    </div>

    <div class="search-box d-flex">
      <input type="text" v-model="searchKeyword" placeholder="Search products, Stores, #F49A99..." />
      <v-btn depressed="" tile color="grey" class="search-button" @click="search()">
        <v-icon color="white">mdi-magnify</v-icon>
      </v-btn>
    </div>

    <div class="d-flex mx-10">
      <v-btn icon color="#F49A99" class="mr-10">
        <v-icon size="32">mdi-heart-multiple-outline</v-icon>
      </v-btn>

      <v-menu open-on-hover offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-badge size="12" color="#f49a99" class="" overlap :content="cartLen" :value="cartLen">
            <v-btn icon color="#F49A99" href="#/cart" v-bind="attrs" v-on="on">
              <v-icon size="32">mdi-shopping-outline</v-icon>
            </v-btn>
          </v-badge>
        </template>
        <v-card tile loading>
          <v-card-title class="text-subtitle-1 pt-3 pb-1">
            {{ cartLen }} Items
            <v-spacer></v-spacer>
            <router-link to="/cart" class="text-decoration-none lighten-2"><span>View Cart</span></router-link>
          </v-card-title>

          <v-divider></v-divider>
          <v-list dense two-line width="250px">
            <v-list-item v-for="item in cartItems" :key="item.key">
              <v-list-item-avatar> <v-img :src="processImg(item.productImg)"></v-img></v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-text="item.productName"></v-list-item-title>
                <v-list-item-subtitle v-html="processCartDisplay(item)"></v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-icon>
                <v-icon :color="item.active ? 'red accent-4' : 'grey'">mdi-trash-can-outline</v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <v-btn block tile color="primary lighten-2">Checkout</v-btn>
        </v-card>
      </v-menu>
    </div>
  </div>
</template>

<script>
const conf = require('../utils/conf');
export default {
  name: 'Header',
  data() {
    return {
      searchKeyword: '',
      items: [],
      queryResultList: [],
      page: 1,
      pageSize: 8,
    };
  },
  computed: {
    cartLen() {
      return this.$store.getters['getCartLength'];
    },
    cartItems() {
      return this.$store.getters['cartItems'];
    },
  },
  methods: {
    processImg(img) {
      //processing multiple images products
      return `/static/${img.split(',')[0]}`;
    },
    formatMoney: function(value) {
      return new Intl.NumberFormat(conf.locale, {
        style: 'currency',
        currency: conf.currency,
      }).format(value);
    },
    processCartDisplay(item) {
      return '<strong>' + item.qty + ' × </strong>' + '<strong>' + this.formatMoney(item.productPrice) + '</strong>';
    },
    search() {
      if (!this.searchKeyword) return;
      var param = {
        keyword: this.searchKeyword,
        page: this.page,
        pageSize: this.pageSize,
        sort: 1,
      };
      axios
        .get('/search', {
          params: param,
        })
        .then((res) => {
          res = res.data;
          if (res.status === '1') {
            if (!res.result.length) {
              // this.$store.commit('checkGoodLen', false);
            } else {
              // this.$store.commit('updateGoodslist', res.result);
              // this.$store.commit('checkGoodLen', true);
            }
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.header-container {
  display: flex;
  justify-content: space-around;
  line-height: 20px;
  text-align: center;
  border-bottom: 1px solid #efeff4;
  .logo {
    img {
      margin: 2px 10px 0 10px;
      width: 80%;
    }
  }
  .search-box {
    width: 50%;
    font-size: 14px;
    input {
      color: #555555;
      width: 100%;
      border: #efeff4 2px solid;
      border-radius: 2px;
      padding: 0 10px;
    }
    input:focus {
      outline: none;
      box-shadow: none;
      -webkit-box-shadow: none;
    }
    .search-button {
      height: inherit;
      margin-left: -2px;
    }
  }
  .cartTitle {
    border-top: 2px solid #f49a99;
  }
}
</style>
