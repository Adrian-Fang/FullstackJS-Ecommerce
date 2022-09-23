const express =require('express');
require('dotenv').config();
const path = require('path');
const $conf = require('./conf');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const util = require('./utils/util');
const Sentry = require('@sentry/node');
const swaggerUi = require('swagger-ui-express');

const swaggerDocument = require('./v1/docs/swagger');

const productsRoute = require('./v1/routes/products');
const usersRoute = require('./v1/routes/users');

const app = express();

// Implement Sentry for error tracing, into production only
if(process.env.NODE_ENV === 'production'){
  Sentry.init({
    dsn: "https://eb07dca034764e8480f734e7576b2d6d@o465476.ingest.sentry.io/6422420",
    tracesSampleRate: 1.0,
  });

  app.use(Sentry.Handlers.requestHandler());
}

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.all('*', (req, res, next) => {
  // deal with access-control-allow-origin error
  res.header('Access-Control-Allow-Origin', $conf.allowdOrigin[process.env.NODE_ENV]);
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  res.header('X-Powered-By', 'express');
  res.header('Cache-Control', 'public,max-age=60000');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    // 拦截请求，验证 Token
    let method = req.method.toLowerCase();
    if ($conf.whiteListUrl[method] && util.inWhiteList(req.path, $conf.whiteListUrl[method])) {
      next();
    } else {
      const bearerAuth = req.headers['authorization'];
      if (!bearerAuth) return res.status(401).send('Access denied, please login');
      else {
        const token = bearerAuth.split(' ')[1];
        jwt.verify(token, $conf.secret, (err, decodedToken) => {
          if (err) {
            //TBD: processing with token expiration case
            return res.status(401).send('token verfication error');
          } else {
            if (!req.userId) {
              req.userId = decodedToken._id;
            }
            next();
          }
        });
      }
    }
  }
});

app.get('/', (req, res, next) => {
  if (req.protocol === 'https') {
    res.status(200).send('Accessing server via https');
  } else {
    res.status(200).send('Accessing server via http');
  }
  next();
});

app.use('/api/v1/products', productsRoute);
app.use('/api/v1/users', usersRoute);
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// The error handler must be before any other error middleware and after all controllers
if(process.env.NODE_ENV === 'production'){
  app.use(Sentry.Handlers.errorHandler());
}

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next();
});


//error hanlder for production
app.use((error, req, res, next) => { 
  console.log(util.getCurrentDateTime(), '\n', error);
  res.end(res.sentry + '\n');
});


module.exports = app;
