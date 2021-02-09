// remove .sample from filename after clone,
// and modify your own production conn configuration

module.exports = {
  mysql: {
    dev: {
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'mall',
    },
    production: {
      host: 'your host',
      user: 'user',
      password: 'password',
      database: 'your database name',
    },
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
