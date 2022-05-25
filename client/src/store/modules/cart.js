import { getCartList, deleteCartItem, addProductToCart } from '@/api/auth'; //deal with server

const state = {
  cartCount: 0,
  cartList: [],
  checkoutList: [],
};

const getters = {
  cartItems: (state) => state.cartList,
  isCartEmpty: (state) => state.cartCount == 0,
  getCartLength: (state) => state.cartList.length,
  checkedItems: (state) => state.checkoutList,
};

const actions = {
  getCartList({ commit }) {
    return new Promise((resolve, reject) => {
      // do something here;
      getCartList()
        .then((res) => {
          if (res.status == '1') {
            commit('INIT_CART', res.result);
            resolve(res);
          } else {
            console.log('Not authorised,login might be required');
          }
        })
        .catch((err) => {
          console.log('error occured getting cart list', err);
          reject(err);
        });
    });
  },

  addItemToCart({ commit, dispatch }, params) {
    return new Promise((resolve, reject) => {
      addProductToCart(params)
        .then((res) => {
          if (res.status == '1') {
            dispatch('getCartList');
            resolve();
          }
        })
        .catch((err) => {
          console.log('Server has returned an error...', err);
          reject(err);
        });
    });
  },

  delCartItem({ commit, dispatch }, params) {
    return new Promise((resolve, reject) => {
      deleteCartItem(params)
        .then((res) => {
          if (res.status == '1') {
            dispatch('getCartList');
            resolve();
          } else {
            console.log('Error occured during removing from cart...');
            reject();
          }
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  },
};

const mutations = {
  // In init_cart, cart count is also initialized
  INIT_CART(state, cartList) {
    state.cartList = cartList;
    state.cartCount = cartList.length;
  },

  // Update Cart Count, called in actions
  UPDATE_CART_COUNT(state) {
    state.cartCount = state.cartList.length;
  },

  DESTROY_CART(state) {
    state.checkoutList = [];
    state.cartList = [];
    state.cartCount = 0;
  },
  CHECKOUT(state, selected) {
    state.checkoutList = state.cartList.filter((v, i) => selected.includes(v.productId.toString()));
  },
  COMPLETE_CHECKOUT (state) {
    state.checkoutList = []; //after successful checkout, this list should be cleared
  }
};

export default {
  state,
  getters,
  actions,
  mutations,
};
