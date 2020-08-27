import http from './public';

//User Authentication
export const register = (params) => http.fetchPost('/users/register', params);
export const login = (params) => http.fetchPost('/users/login', params);
export const checkUserExist = (params) => http.fetchGet('/users/checkUserExist', params);
export const authorisation = (params) => ahttp.fetchGet('/users/authorisation', params);

//User logout
export const logout = (params) => http.fetchGet('/users/logout', params);

//User Profile
export const getProfile = () => http.fetchGet('/users/me');
export const getAddress = () => http.fetchGet('/users/addressList');
export const addAddress = (params) => http.fetchPost('/users/insertAdr', params);
export const setDefaultAddress = (params) => http.fetchPost('/users/insertAdr', params);
export const updateProfile = (params) => http.fetchPost('/users/updateprofile', params); //Not in use yet @20200819
export const upload = (params) => http.fetchPost('/member/imgaeUpload', params); //Not in use yet @20200819
export const updateAvatar = (params) => http.fetchPost('/member/updateheadimage', params); //Not in use yet @20200819

//User Cart Init
export const getCartList = () => http.fetchGet('/users/getCartData');
export const addProductToCart = (params) => http.fetchPost('/users/addCart', params);
export const editQtyCart = (params) => http.fetchPost('/users/addCart', params);
export const deleteCartItem = (params) => http.fetchPost('/users/delProduct', params);
export const submitOrder = (params) => http.fetchPost('/users/submitOrder', params);
