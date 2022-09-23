import axios from 'axios';
import { getToken } from '@/utils/auth';

axios.defaults.timeout = 50000;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers['Cache-Control'] = 'no-cache';

// axios.defaults.baseURL = 'https://one-mall.herokuapp.com/api/v1';
axios.defaults.baseURL = 'http://localhost:3000/api/v1';

//设置 axios 拦截器，将 token 加入所有的 request header
axios.interceptors.request.use((request) => {
  const token = getToken();
  if (token) request.headers['Authorization'] = `Bearer ${token}`;
  return request;
});

export default {
  fetchGet(url, p) {
    return new Promise((resolve, reject) => {
      axios.get(url, { params: p }).then((res) => { resolve(res.data) }).catch((error) => {
          reject(error);
        });
    });
  },
  fetchQuickSearch(url) {
    return new Promise((resolve, reject) => {
      axios.get(url).then((res) => {resolve( res.data) }).catch((error) => {
          reject(error);
        });
    });
  },
  fetchPost(url, params) {
    return new Promise((resolve, reject) => {
      axios.post(url, { params: params }).then((res) => { resolve(res.data) })
        .catch((error) => {
          reject(error);
        });
    });
  },
};
