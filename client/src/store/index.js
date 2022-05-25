import Vue from 'vue';
import Vuex from 'vuex';
import i18n from '../plugins/i18n';

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
  state: {
    locale: i18n.locale
  },
  mutations:{
    initLocale(state) {
      if(localStorage.getItem('locale')) {
        const locale = localStorage.getItem('locale')
        i18n.locale = locale // Set locale from localStorage first
        state.locale = locale
      } else {
        localStorage.setItem('locale', i18n.locale)
      }
    },
    updateLocale(state, newLocale) {
      state.locale = newLocale
      localStorage.setItem('locale', newLocale)
    }
  },
  actions:{
    changeLocale({commit}, newLocale) {
      i18n.locale = newLocale
      commit('updateLocale', newLocale)
    }
  }
});
