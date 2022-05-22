const express =require('express');
require('dotenv').config();
const path = require('path');
const $conf = require('./conf');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const indexRoute = require('./routes/index');
const usersRoute = require('./routes/users');

const app = express();

// view engine setup
app.set('view engine', 'pug');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//WhiteList URLs no need for user Authorisation
const whiteListUrl = {
  get: ['/api/list', '/api/getDetails', '/api/users/logout', '/api/users/authorisation','/api/users/checkUserExist', '/api/search', '/robots.txt'],
  post: ['/api/users/login', '/api/users/register', '/api/users/verifyUser'],
};

const hasOneOf = (str, arr) => {
  return arr.some((item) => item.includes(str));
};

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
    let requestPath = req.path;
    if (whiteListUrl[method] && hasOneOf(requestPath, whiteListUrl[method])) {
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

app.use('/api', indexRoute);
app.use('/api/users', usersRoute);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next();
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('Internal error;');
});

module.exports = app;
