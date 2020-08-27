import http from './public';

// 商品列表
export const getProducts = (params) => {
  return http.fetchGet('/list', params);
};
// 获取购物车列表
export const getCartList = (params) => {
  return http.fetchPost('/users/cartList', params);
};
// 加入购物车
export const addCart = (params) => {
  return http.fetchPost('/users/addCart', params);
};
// 删除购物车
export const delCart = (params) => {
  return http.fetchPost('/users/delCart', params);
};
// 编辑购物车
export const cartEdit = (params) => {
  return http.fetchPost('/users/cartEdit', params);
};
// 全选
export const editCheckAll = (params) => {
  return http.fetchPost('/memusersber/editCheckAll', params);
};
// 删除整条购物车
export const cartDel = (params) => {
  return http.fetchPost('/users/cartDel', params);
};
// 获取用户地址
export const addressList = (params) => {
  return http.fetchPost('/users/addressList', params);
};
// 通过id获取地址
export const getAddress = (params) => {
  return http.fetchPost('/users/address', params);
};
// 修改收货地址
export const addressUpdate = (params) => {
  return http.fetchPost('/users/updateAddress', params);
};
// 添加收货地址
export const addressAdd = (params) => {
  return http.fetchPost('/users/addAddress', params);
};
// 删除收货地址
export const addressDel = (params) => {
  return http.fetchPost('/users/delAddress', params);
};
// 生成订单
export const submitOrder = (params) => {
  return http.fetchPost('/users/addOrder', params);
};
// 支付
export const payMent = (params) => {
  return http.fetchPost('/users/payOrder', params);
};
// 获取用户订单
export const orderList = (params) => {
  return http.fetchGet('/users/orderList', params);
};
// 获取单个订单详情
export const getOrderDet = (params) => {
  return http.fetchGet('/users/orderDetail', params);
};
// 取消订单
export const cancelOrder = (params) => {
  return http.fetchPost('/users/cancelOrder', params);
};
// 商品详情
export const productDetail = (params) => {
  return http.fetchGet('/products/productDetail', params);
};
// 删除订单
export const delOrder = (params) => {
  return http.fetchGet('/users/delOrder', params);
};
// 商品列表
export const getSearch = (params) => {
  return http.fetchGet('/products/search', params);
};
// 快速搜索
export const getQuickSearch = (key) => {
  return http.fetchQuickSearch(`/products/_search?q=productName: ${key}`);
};
