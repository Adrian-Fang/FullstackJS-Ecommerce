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
      getCartList()
        .then((res) => {
          if (res.status == '1') {
            commit('INIT_CART', res.result);
          } else {
            console.log('Not authorised,login might be required');
          }
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  },

  addItemToCart({ commit, dispatch }, params) {
    return new Promise((resolve, reject) => {
      addProductToCart(params)
        .then((res) => {
          if (res.status === '1') {
            //update cartList...
            dispatch('getCartList');
          } else {
            console.log('Error occured during processing');
          }
        })
        .catch((err) => {
          console.log(err);
          console.log('Server has returned an error...');
        });
    });
  },

  delCartItem({ commit, dispatch }, params) {
    return new Promise((resolve, reject) => {
      deleteCartItem(params)
        .then((res) => {
          if (res.status === '1') {
            dispatch('getCartList');
            // defer the callback after next DOM update cycle.
            // this.$nextTick(() => {
            //     this.getCartData();
            // });
          } else {
            console.log('Error occured during removing from cart...');
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
};

export default {
  state,
  getters,
  actions,
  mutations,
};
