var router = require('express').Router();
var mysql = require('mysql');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var utils = require('../util/util');
var $conf = require('../conf/conf');
var omise = require('omise')({
  secretKey: $conf.omiseSecretKey,
  omiseVersion: '2019-05-29',
});

// 使用连接池
var pool = mysql.createPool($conf.mysql[process.env.NODE_ENV]);
// router.use(express.static('public'));
router.get('/', function (req, res, next) {
  if (pool) {
    res.json({
      status: '0000',
      msg: 'succees',
    });
  } else {
    res.json({
      status: '-1',
      msg: 'error!',
    });
  }
});
// 注册接口
router.post('/register', async (req, res) => {
  let userId = req.body.params.email;
  let userPwd = req.body.params.password;
  let userName = req.body.params.userName;
  let title = req.body.params.title;
  let firstName = req.body.params.firstName;
  let lastName = req.body.params.lastName;
  if (!userName) {
    userName = userId.split('@')[0];
  }
  if (pool) {
    //Step 1: check user id
    let checkIdQuery = `SELECT COUNT(userId) AS userCount FROM CRM_user WHERE userId='${userId}';`;
    pool.query(checkIdQuery, (err, result) => {
      if (err) {
        res.json({
          status: '0',
          msg: err.message,
        });
      } else if (JSON.stringify(result)[0].userCount) {
        res.status(400).send('Email already exists, please try login');
      } else {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(userPwd, salt);

        let regQuery = `INSERT INTO CRM_user(userId,userName,userPwd,title,firstName,lastName) VALUES('${userId}','${userName}','${hashedPassword}','${title}','${firstName}','${lastName}');`;
        pool.query(regQuery, (err, result) => {
          if (err) {
            console.log(err);
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
      }
    });
  } else {
    res.json({
      status: '-1',
      msg: 'Database connection error!',
    });
  }
});
// 该账号是否存在
router.get('/checkUserExist', (req, res, next) => {
  var userId = req.body.params.userId;
  if (pool) {
    let sql = `SELECT COUNT(userId) AS userCount FROM CRM_user WHERE userId='${userId}';`;
    pool.query(sql, (err, result) => {
      if (err) {
        res.json({
          status: '0',
          msg: err.message,
        });
      } else if (result.length) {
        res.json({
          status: '1',
          msg: '',
          result: '',
        });
      } else {
        res.json({
          status: '2',
          msg: '',
        });
      }
    });
  } else {
    res.json({
      status: '-1',
      msg: 'Database connection error!',
    });
  }
});
//User Login
router.post('/login', (req, res) => {
  const userId = req.body.params.userId;
  if (pool) {
    const sql = `SELECT userId, userPwd,userName,avatar FROM CRM_user WHERE userId='${userId}';`;
    pool.query(sql, (err, result) => {
      if (err) {
        console.log('SQL query returned an error:', err.message);
        return res.status(400).send(err.message);
      }

      if (!result) return res.status(400).send("User does't exist");
      try {
        const validPwd = bcrypt.compareSync(req.body.params.userPwd, result[0].userPwd);

        if (!validPwd)
          return res.status(401).send({
            accessToken: null,
            msg: "email and password don't match",
          });
      } catch (error) {
        res.status(500).send();
      }
      //set data for user Profile
      const userProfile = {};
      userProfile.userName = result[0].userName;
      userProfile.userId = result[0].userId;
      userProfile.avatar = result[0].avatar;

      //issusing token to user
      const token = jwt.sign({ _id: userId }, $conf.secret, { expiresIn: '1d' });
      //set header, then send data to client
      res.header('Authorization', token).send({
        userProfile: userProfile,
        token: token,
      });
    });
  } else {
    console.log('Failed to query user database, check connection!');
  }
});
//Get User Profile
router.get('/me', (req, res) => {
  // TBD: not needed for now, maybe
  console.log('requesting user profile', req.userId);
});

//登出接口
router.get('/logout', function (req, res, next) {
  res.cookie('userId', '', {
    path: '/',
    maxAge: -1,
  });
  res.cookie('userName', '', {
    path: '/',
    maxAge: -1,
  });
  res.json({
    status: '1',
    msg: '',
    result: '',
  });
});

//检查是否登录
router.get('/authorisation', function (req, res, next) {
  if (req.cookies.userId) {
    res.json({
      status: '1',
      msg: '',
      result: req.cookies.userName || '',
    });
  } else {
    res.json({
      status: '0',
      msg: '未登录',
      result: '',
    });
  }
});

// 购物车数据
router.get('/getCartData', (req, res, next) => {
  if (req.userId) {
    let userId = req.userId;
    let sql = `SELECT cartId,productId,productName,productPrice,qty,productImg,totalPrice,createdAt FROM cartlist WHERE userId='${userId}' AND checked=0 AND deleted=0 ORDER BY cartId DESC;`;
    pool.query(sql, (err, result) => {
      if (err) {
        res.json({
          status: '-1',
          msg: err.message,
        });
      } else {
        res.json({
          status: '1',
          msg: '获取数据成功',
          result: result,
        });
      }
    });
  } else {
    res.json({
      status: '0',
      msg: '未登录',
    });
  }
});
// 加入购物车
router.post('/addCart', (req, res) => {
  var pId = parseInt(req.body.params.pId);
  var pQty = parseInt(req.body.params.pQty);
  var userId = req.userId; //logged-in user's user id
  if (pool) {
    var sql = `SELECT productName,productPrice,productImg FROM goods WHERE productId=${pId};`;
    pool.query(sql, (err, result) => {
      if (err) {
        res.json({
          status: '-1',
          msg: err.message,
          result: '',
        });
      } else {
        let pName = result[0].productName;
        let pPrice = result[0].productPrice;
        let pImg = result[0].productImg;
        let checked = 0;

        let pSubTotal = pPrice * pQty;
        //Items which are already deleted, or checked out, shouldn't count.
        let mSql = `SELECT * FROM cartlist WHERE productId=${pId} AND userId='${userId}' AND checked=0 AND deleted=0;`;
        pool.query(mSql, (err, result) => {
          if (err) {
            res.json({
              status: '-1',
              msg: err.message,
              result: '',
            });
          } else {
            if (result.length === 0) {
              // current user does NOT have the product in Cart
              let sqlAddCart = `INSERT INTO cartlist(userId,productId,productName,productPrice,checked,qty,productImg,totalPrice) VALUES('${userId}','${pId}','${pName}','${pPrice}','${checked}','${pQty}','${pImg}','${pSubTotal}')`;
              pool.query(sqlAddCart, (err, result) => {
                if (err) {
                  res.json({
                    status: '0',
                    msg: err.message,
                    result: '',
                  });
                } else {
                  res.json({
                    status: '1',
                    msg: '添加购物车成功!',
                    result: result,
                  });
                }
              });
            } else {
              // current user have the product in Cart
              let proQty = result[0].qty + pQty;
              let proPrice = result[0].productPrice;
              let cartId = result[0].cartId;
              let proSubTotal = proQty * proPrice;
              let sqlUpdateCart = `UPDATE cartlist SET qty=${proQty},totalPrice=${proSubTotal} WHERE cartId=${cartId}`;
              pool.query(sqlUpdateCart, (err, result) => {
                if (err) {
                  res.json({
                    status: '0',
                    msg: err.message,
                    result: '',
                  });
                } else {
                  res.json({
                    status: '1',
                    msg: '添加购物车成功!',
                    result: result,
                  });
                }
              });
            }
          }
        });
      }
    });
  }
});

//Delete item from cart
router.post('/delProduct', (req, res, next) => {
  if (req.userId) {
    let userId = req.userId;
    let pId = req.body.params.pId;
    let sql = `UPDATE cartlist SET deleted=1, deletedAt=CURRENT_TIMESTAMP WHERE productId=${pId} and userId='${userId}'`;
    pool.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        res.json({
          status: '-1',
          msg: err.message,
        });
      } else {
        res.json({
          status: '1',
          msg: '删除成功',
        });
      }
    });
  } else {
    res.json({
      status: '0',
      msg: '未登录',
    });
  }
});

// 修改商品数量
router.get('/editProductNum', (req, res, next) => {
  if (req.cookies && req.cookies.userId) {
    let userId = req.cookies.userId;
    let proId = req.param('productId'); // 获取前台传过来的要删除的productId值
    let proNum = req.param('productNum'); // 获取前台传过来的要删除的productNum值
    let checked = req.param('checked'); // 获取前台传过来的要删除的chencked值
    let sql = `update cartlist set productNum=${proNum},checked=${checked} where productId=${proId} and userId=${userId}`;
    pool.query(sql, (err, result) => {
      if (err) {
        res.json({
          status: '-1',
          msg: err.message,
        });
      } else {
        res.json({
          status: '1',
          msg: '更新成功',
          result: result,
        });
      }
    });
  } else {
    res.json({
      status: '0',
      msg: '未登录',
    });
  }
});

//获取用户地址信息
router.get('/addressList', (req, res, next) => {
  if (req.userId) {
    let userId = req.userId;
    let sql = `SELECT * FROM addresslist WHERE userId='${userId}' ORDER BY addressId DESC`;
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
  } else {
    res.json({
      status: '0',
      msg: '未登录',
    });
  }
});

//设置默认地址
router.get('/setDefauleAdr', (req, res, next) => {
  if (req.cookies && req.cookies.userId) {
    let userId = req.cookies.userId;
    let defaultFlag = '1';
    let allFlag = '0';
    let addressId = req.param('address'); // 获取前台传过来addressId值
    let sql1 = `update addresslist set isDefault=${allFlag} where userId=${userId}`;
    let sql = `update addresslist set isDefault=${defaultFlag} where userId=${userId} and addressId=${addressId}`;
    pool.query(sql1, (err, result) => {
      if (err) {
        res.json({
          status: '-1',
          msg: err.message,
        });
      } else {
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
              result: '',
            });
          }
        });
      }
    });
  } else {
    res.json({
      status: '0',
      msg: '未登录',
    });
  }
});

// 删除地址
router.get('/delAdr', (req, res, next) => {
  if (req.cookies && req.cookies.userId) {
    let userId = req.cookies.userId;
    let addressId = req.param('addressId'); // 获取前台传过来的要删除的addressId值
    let sql = `delete from addresslist where userId=${userId} and addressId=${addressId}`;
    pool.query(sql, (err, result) => {
      if (err) {
        res.json({
          status: '-1',
          msg: err.message,
        });
      } else {
        res.json({
          status: '1',
          msg: '删除成功',
          result: '',
        });
      }
    });
  } else {
    res.json({
      status: '0',
      msg: '未登录',
    });
  }
});

//增加新地址
router.post('/insertAdr', (req, res, next) => {
  if (req.userId) {
    let userId = req.userId;
    console.log(req.body);
    let contactPerson = req.body.params['name'];
    let fullAddress = req.body.params['fullAddress']; // 获取前台传值
    let contactNumber = req.body.params['contactNumber']; // 获取前台值
    let postalCode = req.body.params['postalCode']; // 获取前台传值
    let defaultFlag = '0';
    let sql = `INSERT INTO addresslist(userId,userName,fullAddress,postCode,tel,isDefault) VALUES('${userId}','${contactPerson}','${fullAddress}','${postalCode}','${contactNumber}','${defaultFlag}')`;
    pool.query(sql, (err, result) => {
      if (err) {
        res.json({
          status: '-1',
          msg: err.message,
        });
      } else {
        res.json({
          status: '1',
          msg: '添加成功',
          result: '',
        });
      }
    });
  } else {
    res.json({
      status: '0',
      msg: '未登录',
    });
  }
});

// 生成订单
router.post('/submitOrder', (req, res, next) => {
  //Step1-1: processing table: OMS_orders
  var newOrderId = utils.generateOrderId();
  var userId = req.userId;
  var subTotal = req.body.params['subTotal'];
  var shipping = req.body.params['shipPrice'];
  var insurance = 0;
  var discount = req.body.params['discount'];
  var addressData = req.body.params['addressData'];
  var orderStatus = 1; // 0=null, 1=to pay,2=to deliver, 3=complete, 8=cancelled 9=refunded
  var paymentOption = req.body.params['paymentOption'];
  var paymentStatus = 1; //0=null, 1=to pay, 2=partial paid, 3=paid
  var paidAt = null;
  let checkedCartItems = req.body.params.checkedCartItemsId;
  console.log('[1 Processing] New Order Id is:', newOrderId);

  // Step 1-2: processing payment with Omise API
  let orderDesc = '#' + newOrderId.slice(-7, -1);
  if (paymentOption === 'Cards Online') {
    omise.charges.create(
      {
        description: `Paying for order ${orderDesc}`,
        amount: req.body.params['totalPrice'] * 100,
        currency: req.body.params['omiseConfig']['currency'],
        capture: $conf.captureCharge,
        card: req.body.params['omiseConfig']['omiseToken'],
      },
      (err, chargeRes) => {
        if (chargeRes.id) {
          // Step 1-3: Wait for Omise API response, and then proceed with database operations
          orderStatus = 2;
          paymentStatus = 3;
          paidAt = chargeRes.paid_at; //Omise Datetime format follows ISO 8601, needs conversion here
          let newOrderSqlQuery = `INSERT INTO OMS_orders(orderId,userId,subTotal,shipping,insurance,discount,contactPerson,contactNumber,contactAddress,contactPostalCode,orderStatus,createdAt,paymentOption,paymentStatus,paymentTime) VALUES (${newOrderId},'${userId}',${subTotal},${shipping},${insurance},${discount},'${addressData.userName}','${addressData.tel}', '${addressData.fullAddress}','${addressData.postCode}',${orderStatus},CURRENT_TIMESTAMP,'${paymentOption}',${paymentStatus},CURRENT_TIMESTAMP);`;
          pool.query(newOrderSqlQuery, (err, result) => {
            if (err) {
              console.log('Error occured during insert new order data...');
              res.json({
                status: '-1',
                msg: err.message,
              });
            } else {
              console.log('Processing second step...');
              //Step2: processing table: OMS_order_product_relation
              let newOrderProductRelationQuery = `INSERT INTO OMS_order_product_relation(orderId, productId,productName,productPrice,productQty,productImg) SELECT ${newOrderId} AS orderId, productId, productName,productPrice,qty,productImg FROM cartlist WHERE userId='${userId}' AND cartId in ();`;
              pool.query(newOrderProductRelationQuery, (err, result) => {
                if (err) {
                  console.log('Error occured during insert new order relation data...');
                  res.json({
                    status: '-1',
                    msg: err.message,
                  });
                } else {
                  //Step 3: processing table: cartlist, set checked products as checked=1
                  let checkCartItemQuery = `UPDATE cartlist SET checked=1 WHERE deleted=0 AND checked=0 AND cartId IN (${checkedCartItems.join(
                    ','
                  )});`;
                  pool.query(checkCartItemQuery, (err, result) => {
                    if (err) {
                      console.log(
                        'Error occured during checking cart items:',
                        checkedCartItems.join(',')
                      );
                      res.json({
                        status: '-1',
                        msg: err.message,
                      });
                    } else {
                      res.json({
                        status: '1',
                        msg: '订单创建成功！',
                        result: result,
                        orderId: newOrderId,
                      });
                    }
                  });
                }
              });
            }
          });
        }
      }
    );
  } else {
    //Create order with or without payment made.
    let newOrderSqlQuery = `INSERT INTO OMS_orders(orderId,userId,subTotal,shipping,insurance,discount,contactPerson,contactNumber,contactAddress,contactPostalCode,orderStatus,createdAt,paymentOption,paymentStatus,paymentTime) VALUES (${newOrderId},'${userId}',${subTotal},${shipping},${insurance},${discount},'${addressData.userName}','${addressData.tel}', '${addressData.fullAddress}','${addressData.postCode}',${orderStatus}, CURRENT_TIMESTAMP,'${paymentOption}',${paymentStatus},${paidAt});`;
    pool.query(newOrderSqlQuery, (err, result) => {
      if (err) {
        console.log('Error occured during insert new order data...');
        res.json({
          status: '-1',
          msg: err.message,
        });
      } else {
        console.log('Processing without Omise Payment second step...');
        console.log('[2 New Order Inserted, inserting relation] New Order Id is:', newOrderId);
        //Step2: processing table: OMS_order_product_relation
        let newOrderProductRelationQuery = `INSERT INTO OMS_order_product_relation(orderId, productId,productName,productPrice,productQty,productImg) SELECT ${newOrderId} AS orderId, productId, productName,productPrice,qty,productImg FROM cartlist WHERE userId='${userId}' AND cartId IN (${checkedCartItems.join(
          ','
        )});`;
        pool.query(newOrderProductRelationQuery, (err, result) => {
          if (err) {
            console.log('Error occured during insert new order relation data...');
            res.json({
              status: '-1',
              msg: err.message,
            });
          } else {
            console.log('[3 Relation Inserted] New Order Id is:', newOrderId);
            //Step 3: processing table: cartlist, set checked products as checked=1
            let checkedCartItems = req.body.params.checkedCartItemsId;
            let checkCartItemQuery = `UPDATE cartlist SET checked=1 WHERE deleted=0 AND checked=0 AND cartId IN (${checkedCartItems.join(
              ','
            )});`;
            pool.query(checkCartItemQuery, (err, result) => {
              if (err) {
                console.log(
                  'Error occured during checking cart items:',
                  checkedCartItems.join(',')
                );
                res.json({
                  status: '-1',
                  msg: err.message,
                });
              } else {
                console.log(
                  '[4 Updated Cartlist] New Order Id is:',
                  newOrderId,
                  'checked items are: ',
                  checkedCartItems
                );
                res.json({
                  status: '1',
                  msg: '订单创建成功！',
                  result: result,
                  orderId: newOrderId,
                });
              }
            });
          }
        });
      }
    });
  }
});

// 获取订单信息
router.get('/getOrderData', (req, res, next) => {
  if (req.userId) {
    let userId = req.userId;

    let orderQuery = `SELECT * FROM OMS_orders where userId='${userId}' ORDER BY createdAt DESC LIMIT ${$conf.recentOrderLength};`;
    pool.query(orderQuery, (err, orderResult) => {
      if (err) {
        res.json({
          status: '-1',
          msg: err.message,
        });
      }
      //Step 1: Processing orders
      let orderListIds = [];
      orderResult.forEach((v) => orderListIds.push(v.orderId));
      let productsQuery = `SELECT * FROM OMS_order_product_relation WHERE orderId IN (${orderListIds.join(
        ','
      )});`;
      pool.query(productsQuery, (err, productResult) => {
        if (err) console.log(err.message);
        // Step 2: Processing orders-products
        orderResult.forEach((item) => {
          item.orderProducts = [];
          productResult.forEach((p) => {
            if (p.orderId == item.orderId) item.orderProducts.push(JSON.parse(JSON.stringify(p)));
          });
        });
        //Step 3: Send processed order details back
        res.json({
          status: '1',
          msg: '获取数据成功',
          result: orderResult,
        });
      });
    });
  } else {
    res.json({
      status: '0',
      msg: '未登录',
    });
  }
});

// 删除订单
router.get('/delOrder', (req, res, next) => {
  if (req.cookies && req.cookies.userId) {
    let userId = req.cookies.userId;
    var orderId = req.param('orderId'); // 获取前台传值
    let sql = `delete from orderlist where orderId=${orderId}`;
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
          result: '',
        });
      }
    });
  } else {
    res.json({
      status: '0',
      msg: '未登录',
    });
  }
});

//更新订单
router.get('/updateOrder', (req, res, next) => {
  if (req.cookies && req.cookies.userId) {
    let userId = req.cookies.userId;
    let orderId = req.param('orderId'); // 获取前台传值
    let ifPay = 1;
    let sql = `update orderlist set ifPay=${ifPay} where orderId=${orderId} and userId='${userId}'`;
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
          result: '',
        });
      }
    });
  } else {
    res.json({
      status: '0',
      msg: '未登录',
    });
  }
});
module.exports = router;
