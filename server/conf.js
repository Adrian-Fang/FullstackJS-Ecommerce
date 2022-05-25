// and modify your own production conn configuration

module.exports = {
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
      host: 'your host',
      user: 'user',
      password: 'password',
      database: 'your database name',
    },
  },
  allowdOrigin: {
      production: 'https://yourown.appurl.app',
      dev: 'http://localhost:8081'
  },
  emailAccountAuth: {
    user: 'your-account@outlook.com', // this configuration works with the transporter setting in ./util/mailer.js 
    pass: 'yourpassword'
  },

  //Processing User Login Token
  secret: 'whatever-key-you like', //

  //Processing Order ID prefix
  platformId: '62',

  //Default Order query length
  recentOrderLength: 5,

  //Processing Omise Payment, Server-end private testing key
  omiseSecretKey: 'your Omise key if you use Omise',
  captureCharge: false,
};
