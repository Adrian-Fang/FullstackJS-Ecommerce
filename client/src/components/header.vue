<template>
<div>
  <div class="logo">
      <a href="/">
        <img src="/static/one-mall-logo.png" />
      </a>
  </div>

  <div class="header-container">
    
    <div class="collection" v-for="(c, i) in category" :key="i" @click="goto(c.link)">{{c.text}}</div>

    <div class="d-flex">
      <v-btn icon color="#F49A99" class="mr-10">
        <v-icon size="32">mdi-heart-plus-outline</v-icon>
      </v-btn>

      <v-menu open-on-hover offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-badge size="12" color="#f49a99" class="" overlap :content="cartLen" :value="cartLen">
            <v-btn icon color="#F49A99" href="#/cart" v-bind="attrs" v-on="on">
              <v-icon size="32">mdi-shopping-outline</v-icon>
            </v-btn>
          </v-badge>
        </template>
        <v-card tile style="border-top:5px solid #F49A99" v-if="cartLen">
          <v-card-title class="text-subtitle-1 pt-3 pb-1">
            {{ cartLen }} {{$t('cart.numberOfItems')}}
            <v-spacer></v-spacer>
            <router-link to="/cart" class="text-decoration-none lighten-2"
              ><span>{{$t('cart.viewCart')}}</span></router-link
            >
          </v-card-title>

          <v-divider></v-divider>
          <v-list dense two-line width="250px">
            <v-list-item v-for="item in cartItems" :key="item.key">
              <v-list-item-avatar>
                <v-img :src="processImg(item.productImg)"></v-img>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-text="item.productName"></v-list-item-title>
                <v-list-item-subtitle v-html="processCartDisplay(item)"></v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-icon>
                <v-icon :color="item.active ? 'red accent-4' : 'grey'"
                  >mdi-trash-can-outline</v-icon
                >
              </v-list-item-icon>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <v-btn block tile color="primary lighten-2" @click="$router.push('/cart')"
            >{{$t('cart.checkout')}}</v-btn
          >
        </v-card>
        <v-card tile style="border-top:5px solid #F49A99" v-else width="250px">
          <v-card-title class="text-subtitle-1 pt-3 pb-1"> {{ cartLen }} {{$t('cart.numberOfItems')}}</v-card-title>
          <v-spacer></v-spacer>
          <v-img class="mx-auto my-auto white" src="/static/icons/empty-cart.png"></v-img>
          <v-btn block tile color="primary lighten-2" @click="$router.push('/mall')"
            >{{$t('cart.goShopping')}}</v-btn
          >
        </v-card>
      </v-menu>
    </div>
  </div>
</div>
  
</template>

<script>

import { formatMoney } from "../utils/locale";

export default {
  name: 'Header',
  data() {
    return {
      searchKeyword: '',
      items: [],
      queryResultList: [],
      page: 1,
      pageSize: 8,
      category:[
        {
          text: "New Arrival",
          link: "/mall"
        },
        {
          text: "Women",
          link: "/mall"
        },
        {
          text: "Men",
          link: "/mall"
        },
        {
          text: "Other",
          link: "/mall"
        },
        {
          text: "Promoted",
          link: "/mall"
        },
        {
          text: "Flash",
          link: "/mall"
        }
      ]
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
    goto(link) {
      this.$router.push(link);
    },
    processImg(img) {
      //processing multiple images products
      return `/static/${img.split(',')[0]}`;
    },
    processCartDisplay(item) {
      return (
        '<strong>' +
        item.qty +
        ' × </strong>' +
        '<strong>' +
        formatMoney(item.productPrice) +
        '</strong>'
      );
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
          if (res.status == '1') {
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
.logo {
  text-align: center;
    img {
      width: 200px;
      height: 80px;
    }
  }

.header-container {
  display: flex;
  align-items: center;
  justify-content:space-evenly;
  padding-bottom: 10px;

  border-bottom: 1px solid #efeff4;
  margin-top: -10px;
  margin-bottom: 20px;
  
  .collection {
    cursor: pointer;
    &:hover {
      font-weight: 600;
      color: #F49A99;
    }
  }
  .search-box {
    width: 50%;
    height: 40px;
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
  .cart {
    border-top: 2px solid #f49a99;
  }
}
</style>
