import Vue from 'vue';
import Vuex from 'vuex';
import cart from './modules/cart';
import user from './modules/user';
import products from './modules/products';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    cart,
    user,
    products,
  },
});
