import http from './public';

//public APIs
// 商品 Products
export const getProducts = (params) => http.fetchGet('/products', params) ;
export const getProductDetail = (params) =>  http.fetchGet(`/products/${params.productId}`);

//APIs with authentication
//User
export const verifyEmail = (params) => http.fetchPost('/users/verifyUser', params);
export const register = (params) => http.fetchPost('/users/register', params);
export const login = (params) => http.fetchPost('/users/login', params);
export const checkUserExist = (params) => http.fetchGet('/users/checkUserExist', params);
export const authorisation = (params) => http.fetchGet('/users/authorisation', params);
export const logout = (params) => http.fetchGet('/users/logout', params);

//User Profile
export const getProfile = () => http.fetchGet('/users/me');
export const updateProfile = (params) => http.fetchPost('/users/updateprofile', params); //Not in use yet @20200819
export const upload = (params) => http.fetchPost('/member/imgaeUpload', params); //Not in use yet @20200819
export const updateAvatar = (params) => http.fetchPost('/member/updateheadimage', params); //Not in use yet @20200819

// User Address
export const getAddress = () => http.fetchGet('/users/addresses');
export const addAddress = (params) => http.fetchPost('/users/addresses', params);
export const setDefaultAddress = (params) => http.fetchPost('/users/setDefaultAdress', params);
export const updateAddress = (params) => http.fetchPost('/users/updateAddress', params);
export const deleteAddress = (params) =>  http.fetchPost('/users/delAddress', params);

//User Cart Init
export const getCartList = () => http.fetchGet('/users/getCartData');
export const addProductToCart = (params) => http.fetchPost('/users/addCart', params);
export const editQtyCart = (params) => http.fetchPost('/users/addCart', params);
export const deleteCartItem = (params) => http.fetchPost('/users/delProduct', params);

//User Orders
export const getOrders = (params) =>  http.fetchGet('/users/orders', params);
export const submitOrder = (params) => http.fetchPost('/users/orders', params);
export const getOrderDetails = (params) =>  http.fetchGet('/users/orderDetail', params);
export const payOneOrder = (params) => http.fetchPost('/users/payOrder', params);
export const deleteOrder = (params) =>  http.fetchPost('/users/delOrder', params);
export const cancelOrder = (params) =>  http.fetchPost('/users/cancelOrder', params);

