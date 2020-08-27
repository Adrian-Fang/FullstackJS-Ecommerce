// conf/db.js
// MySQL数据库联接配置
module.exports = {
  mysql: {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'mall',
    port: 3306,
    charset: 'UTF8_GENERAL_CI',
  },
  //Processing User Login Token
  secret: 'whatever-key-you like', //

  //Processing Order ID prefix
  platformId: '62',

  //Default Order query length
  recentOrderLength: 5,

  //Processing Omise Payment, Server-end private testing key
  omiseSecretKey: 'skey_test_5k17fds64zd87ukxpch',
  captureCharge: false,
};
