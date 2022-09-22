// conf.js
module.exports = {
  whiteListUrl: {
    get: [
      '/api/v1/products', 
      '/api/v1/users/logout', 
      '/api/v1/users/checkUserExist', 
      '/robots.txt',
      '/api/v1/docs/'
    ],
    post: [
      '/api/v1/users/login', 
      '/api/v1/users/register', 
      '/api/v1/users/verifyUser'
    ],
  },
  mysql: {
    dev: {
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'mall',
      port: 3306,
      charset: 'UTF8_GENERAL_CI',
    },
    production: {
      host: 'us-cdbr-east-03.cleardb.com',
      user: 'b1ccd41ff26775',
      password: 'a734da47',
      database: 'heroku_a6634ea955d8887',
      charset: 'UTF8_GENERAL_CI',
    },
  },
  allowdOrigin: {
    production: 'https://one-mall.netlify.app',
    dev: 'http://localhost:8081'
  },
  emailAccountAuth: {
    user: 'one-mall@outlook.com',
    pass: 'Go_vgc_2020!'
  },

  //Processing User Login Token
  secret: 'Adrian-Fang-Key',

  //Processing Order ID prefix
  platformId: '62',

  //Default Order query length
  recentOrderLength: 5,

  //Processing Omise Payment, Server-end private testing key
  omiseSecretKey: 'skey_test_5k17fds64zd87ukxpch',
  captureCharge: false,
};
