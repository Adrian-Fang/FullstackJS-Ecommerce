var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var $conf = require('../conf/conf');
// 使用连接池
var pool = mysql.createPool($conf.mysql);
router.use(express.static('public'));
// 查询商品列表
router.get('/list', function(req, res, next) {
  const reqQuery = Object.assign(req.query); //TBD: No idea why cannot direcly use req.query...
  const sortNum = reqQuery.sort;
  // const secContent = req.query('secContent');
  const page = parseInt(reqQuery.page);
  const pageSize = parseInt(reqQuery.pageSize) ? parseInt(reqQuery.pageSize) : 5;
  const pageNum = (page - 1) * pageSize >= 0 ? (page - 1) * pageSize : 0;

  const priceLevel = reqQuery.priceLevel;
  const priceGt = 0; //定义价格区间
  const priceLte = 99999999; //定义价格区间
  // switch (priceLevel) {
  //   case '0':
  //     priceGt = 0;
  //     priceLte = 500;
  //     break;
  //   case '1':
  //     priceGt = 500;
  //     priceLte = 1000;
  //     break;
  //   case '2':
  //     priceGt = 1000;
  //     priceLte = 2000;
  //     break;
  //   case '3':
  //     priceGt = 2000;
  //     priceLte = 5000;
  //     break;
  //   case '4':
  //     priceGt = 5000;
  //     priceLte = 10000;
  //     break;
  //   case 'all':
  //     priceGt = 0;
  //     priceLte = 999999;
  //     break;
  //   default:
  //     priceGt = 0;
  //     priceLte = 999999999;
  // };

  if (pool) {
    var sort = '';
    if (sortNum === '1') {
      sort = 'asc';
    } else if (sortNum === '0') {
      sort = 'desc';
    } else {
      sort = 'desc';
    }
    if (priceLevel == 'all' && sortNum == '') {
      var sql = `select * from goods order by id asc limit ${pageNum},${pageSize}`;
    } else {
      var sql = `select * from goods where productPrice>${priceGt} and productPrice<=${priceLte} order by productPrice ${sort} limit ${pageNum},${pageSize}`;
    }
    pool.query(sql, (err, result) => {
      if (err) {
        // res.send(err.message);
        console.log('error occured during qurey');
        res.json({
          status: '-1',
          msg: err.message,
          pageNum: pageNum,
        });
      } else {
        // res.send( JSON.stringify(result));
        res.json({
          status: '1',
          msg: '',
          sort: sort,
          pageNum: pageNum,
          result: {
            count: result.length,
            list: result,
          },
        });
      }
    });
    console.log('successful!');
  } else {
    console.log('an err occured when query product data...');
  }
});

// 搜索框接口
router.get('/search', (req, res, next) => {
  var secContent = req.query('keyword');
  var page = parseInt(req.query('page')); // 获取前台传过来的page(第几页)值
  var pageSize = parseInt(req.query('pageSize')); // 获取前台传过来的pageSize(每页多少条)值
  var pageNum = (page - 1) * pageSize;
  var sql = `select * from goods where productName LIKE '%${secContent}%' or productDetails LIKE '%${secContent}%'`;
  pool.query(sql, (err, result) => {
    if (err) {
      res.json({
        status: '-1',
        msg: err.message,
      });
    } else {
      res.json({
        status: '1',
        msg: '',
        result: result,
      });
    }
  });
});

//查看商品详情
router.get('/getDetails', (req, res, next) => {
  let productId = parseInt(req.query['productId']); // 获取前台传过来的productId值
  console.log('query product id is: ', productId);
  let sql = `select * from goods where productId=${productId}`;
  pool.query(sql, (err, result) => {
    if (err) {
      res.json({
        status: '0',
        msg: err.message,
      });
    } else {
      res.json({
        status: '1',
        msg: '',
        result: result,
      });
    }
  });
});
module.exports = router;
