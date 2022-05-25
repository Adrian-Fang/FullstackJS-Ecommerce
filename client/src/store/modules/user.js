const authApi = require('../../api/auth');
import { setToken, getToken, removeToken } from '@/utils/auth'; //deal with local

const getters = {
  isLoggedIn: (state) => state.token && state.token.length > 0,
  authStatus: (state) => state.status,
  getProfile: (state) => state.profile,
  isProfileLoaded: (state) => !!Object.keys(state.profile).length,
};

const state = {
  profile: {},
  token: getToken() || null,
  status: '', //auth status could be: ['loading', 'success', 'error']
  rules: {},
};

const actions = {
  login({ commit }, params) {
    return new Promise((resolve, reject) => {
      commit('AUTH_REQUEST');
      authApi
        .login(params)
        .then((res) => {
          if (res.token) {
            setToken(res.token);
            commit('AUTH_SUCCESS', res.token);
            commit('USER_SUCCESS', res.userProfile); // 因为get profile 随login 一起做了
            resolve(res);
          } else {
            //TBD: login failed, how to do
            commit('AUTH_ERROR');
            removeToken();
            reject(new Error('Error'));
          }
        })
        .catch((err) => {
          commit('AUTH_ERROR');
          removeToken();
          reject(err);
        });
    });
  },

  auth(context, token) {
    return new Promise((resolve, reject) => {
      authApi
        .authorisation(token)
        .then((res) => {
          if (parseInt(res.status) === 401) {
            context.dispatch('logout');
            reject(new Error('token validation error'));
          } else {
            setToken(res.data.token);
            resolve(res.data.rules.page); //TBD: rules not finished yet
            context.commit('SET_RULES', res.data.rules.component); ////not finished yet
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  register(context, params) {
    return new Promise((resolve, reject) => {
      authApi.register(params)
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  },
  getAddress(context, params) {
    return new Promise((resolve, reject) => {
      authApi
        .getAddress(params)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  addNewAddress(context, params) {
    return new Promise((resolve, reject) => {
      authApi.addAddress(params)
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  },
  setDefaultAddress(context, params) {
    return new Promise((resolve, reject) => {
      authApi.setDefaultAddress(params)
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  },
  submitOrder(context, params) {
    return new Promise((resolve, reject) => {
      authApi.submitOrder(params)
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  },
  // not too much user data, already got from login
  // getProfile({ commit }) {
  //     return new Promise((resolve, reject) => {
  //         commit('USER_REQUEST');
  //         getProfile().then(res => {
  //             commit('USER_SUCCESS', res.userProfile);
  //         })
  //     }).catch(() => {
  //         commit('USER_ERROR');
  //         commit('AUTH_LOGOUT');
  //     });
  // },

  logout({ commit }) {
    // setToken('');
    commit('AUTH_LOGOUT');
    removeToken();
    commit('DESTROY_CART');
    return new Promise((resolve, reject) => {
      authApi.logout()
        .then(res => resolve(res))
        .catch(err =>  reject(err));
    });
  },
};

const mutations = {
  AUTH_REQUEST(state) {
    state.status = 'loading';
  },
  AUTH_SUCCESS(state, token) {
    state.status = 'success';
    state.token = token;
  },
  AUTH_ERROR(state) {
    state.status = 'error';
  },
  AUTH_LOGOUT(state) {
    state.token = '';
    state.profile = {};
    state.status = '';
  },
  USER_REQUEST(state) {
    state.status = 'loading';
  },
  USER_SUCCESS(state, profile) {
    state.status = 'success';
    //Vue.set(state, profile);
    state.profile = profile;
  },
  USER_ERROR(state) {
    state.status = 'error';
  },
  SET_RULES(state, rules) {
    state.rules = rules;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
