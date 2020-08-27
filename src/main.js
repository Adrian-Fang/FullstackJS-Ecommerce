import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import vueLazyLoad from 'vue-lazyload';
import i18n from './i18n';

Vue.config.productionTip = false;

Vue.use(vueLazyLoad, {
  loading: '@/static/loading-svg/loading-bars.svg', // 设置图片懒加载
});

/* eslint-disable no-new */

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
