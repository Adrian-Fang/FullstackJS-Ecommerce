// conf.js
module.exports = {
  whiteListUrl: {
    get: [
      '/api/v1/products', 
      '/api/v1/users/logout', 
      '/api/v1/users/checkUserExist', 
      '/robots.txt',
      '/api/v1/docs/',
    ],
    post: [
      '/api/v1/users/login', 
      '/api/v1/users/register', 
      '/api/v1/users/verifyUser',
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
      host: '',
      user: '',
      password: '',
      database: '',
      port: 3306,
      charset: 'UTF8_GENERAL_CI',
    },
  },
  allowdOrigin: {
    production: 'https://your-client-project-url.netlify.app',
    dev: 'http://localhost:8080'
  },
  emailAccountAuth: {
    user: 'your-email@outlook.com',
    pass: 'yourpassword'
  },

  //Processing User Login Token
  secret: 'your-own-key',

  //Processing Order ID prefix
  platformId: '62',

  //Default Order query length
  recentOrderLength: 5,

  //Processing Omise Payment, Server-end private testing key
  omiseSecretKey: 'skey_test_your_applied_key_from_omise',
  captureCharge: false,
};
