import { getProducts } from '../../api/productsApi';

const getters = {
  getProducts: (state) => state.productList,
  isProductLoaded: (state) => state.productList.length > 0,
};

const state = {
  productList: [],
  productStatus: '', // ['loading', 'success', ‘error’，‘all’]
};

const actions = {
  requestProducts({ commit, getters }, payload) {
    return new Promise((resolve, reject) => {
      commit('SET_PRODUCT_STATUS', 'loading');
      getProducts(payload.params)
        .then((res) => {
          if (res.status == '1') {
            if (payload.loadMoreFlag) {
              //Loading more products...
              if (res.result.list.length > 0) {
                commit(
                  'SET_PRODUCTS',
                  getters.getProducts.concat(res.result.list)
                );
                commit('SET_PRODUCT_STATUS', 'success');
              } else {
                //No More products..
                console.log('All products loaded...');
                commit('SET_PRODUCT_STATUS', 'all');
              }
            } else {
              //Simply Loading products...
              commit('SET_PRODUCTS', res.result.list);
              commit('SET_PRODUCT_STATUS', 'success');
            }
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
  SET_PRODUCT_STATUS(state, status) {
    state.productStatus = status;
  },
  SET_PRODUCTS(state, list) {
    state.productList = list;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
