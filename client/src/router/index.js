import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home';
import Register from '@/views/Register';
import Login from '@/views/Login';
import GoodsList from '@/views/GoodsList';
import GoodsDetails from '@/views/GoodsDetails';
import Cart from '@/views/Cart';
import Checkout from '@/views/Checkout';
import OrderSuccess from '@/views/OrderSuccess';
import OrderList from '@/views/OrderList.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/mall',
      name: 'Goodslist',
      component: GoodsList,
    },
    {
      path: '/register',
      component: Register,
    },
    {
      path: '/login',
      component: Login,
    },
    {
      path: '/items/:productId',
      component: GoodsDetails,
    },
    {
      path: '/cart',
      component: Cart,
    },
    {
      path: '/checkout',
      name: 'CheckOut',
      component: Checkout,
    },
    {
      path: '/complete',
      name: 'OrderSuccess',
      component: OrderSuccess,
    },
    {
      path: '/orders',
      name: 'OrderList',
      component: OrderList,
    },
  ],
});
