const mysql = require('mysql');
const $conf = require('../conf');
const pool = mysql.createPool($conf.mysql[process.env.NODE_ENV]);
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var omise = require('omise')({
  secretKey: $conf.omiseSecretKey,
  omiseVersion: '2019-05-29',
});

module.exports = {
    index: (req, res, next) => {
        if(pool) {
            res.status(200).json({status: 1, msg: 'Success'});
        } else {
            res.status(500).json({status: 0, msg: 'Error with DB connection.'})
        }
    },
    checkUserExist:(req, res, next) => {
        var userId = req.body.params.userId;
        if(pool) {
            let sql = `SELECT COUNT(userId) AS userCount FROM CRM_user WHERE userId='${userId}';`;
            pool.query(sql, (err, result) => {
                if(err) {
                    res.status(500).json({ status: 0, msg: err.message});
                } else if(result.length){
                    res.json(200).json({
                        status: 1,
                        msg: 'User exists',
                        result: result
                    })
                } else {
                    res.status(200).json({status: 2, msg: 'User does not exist'});
                }
            });
        } else {
            res.status(500).json({status: 0, msg: 'Error with DB connection.'})
        }
    },
    checkLogin: (req, res, next) => {
        if(req.userId) return res.status(200).json({status: '1', msg: 'User logged in', result: req.cookies});
        res.status(401).json({status: '0', msg: 'User not logged in', result: ''});
    },
    register: async (req, res, next) => {
        let userId = req.body.params.email;
        let userPwd = req.body.params.password;
        let userName = req.body.params.userName;
        let title = req.body.params.title;
        let firstName = req.body.params.firstName;
        let lastName = req.body.params.lastName;

        if (!userName) {
            userName = userId.split('@')[0];
        }

        if(pool) {
            //Step 1: check if user id already exists
            let checkIdQuery = `SELECT COUNT(userId) AS userCount FROM CRM_user WHERE userId='${userId}';`;
            pool.query(checkIdQuery, (err, result, fields) => {
                if(err) {
                    res.status(500).json({ status: 0, msg: err.message});
                } else if (result[0].userCount) {
                    res.status(400).send('Email already exists, please try login');
                } else {
                    // Step 2: hash password, and insert user data into DB
                    const salt = bcrypt.genSaltSync(10);
                    const hashedPassword = bcrypt.hashSync(userPwd, salt);

                    let regQuery = `INSERT INTO CRM_user(userId,userName,userPwd,title,firstName,lastName) VALUES('${userId}','${userName}','${hashedPassword}','${title}','${firstName}','${lastName}');`;
                    pool.query(regQuery, (err, result) => {
                        if(err) {
                            res.status(500).json({ status: 0, msg: err.message});
                        } else {
                            res.status(201).json({
                                status: '1',
                                msg: 'Success',
                                result: result
                            });
                        }
                    });
                }
            })
        } else {
            res.status(500).json({status: 0, msg: err.msg});
        }
    },
    login: (req, res, next) => {
        const userId = req.body.params.userId;
        if(pool) {
            const sql = `SELECT userId, userPwd,userName,avatar FROM CRM_user WHERE userId='${userId}';`;
            pool.query(sql, (err, result) => {
                if (err) {
                    console.log('SQL query returned an error:', err.message);
                    return res.status(500).json({status: 0, msg:err.message});
                }
                if(!result) return res.status(404).json({status: 0, msg: "User does not exist"});

                try {
                    const validPwd = bcrypt.compareSync(req.body.params.userPwd, result[0].userPwd);
                    if(!validPwd) return res.status(401).json({accessToken: null, msg: "Email and password do not match"})
                } catch (error) {
                    res.status(500).json({status: 0, msg: 'Server encountered an error processing login request.'})
                }

                //set data for user Profile
                const userProfile = {};
                userProfile.userName = result[0].userName;
                userProfile.userId = result[0].userId;
                userProfile.avatar = result[0].avatar;

                //issue token to user
                const token = jwt.sign({_id:userId}, $conf.secret, {expiresIn: '1d'})
                //set header, then send data to client
                res.header('Authorization', token).json({
                    userProfile: userProfile,
                    token: token
                });
            })
        } else {
            res.status(500).json({status: 0, msg: err.msg});
        }
    },
    logout: (req, res, next) => {
        //TODO: need to modify later
        res.cookie('userId', '', {path:'/', maxAge: -1});
        res.cookie('userName', '', {path: '/', maxAge: -1});
        res.status(200).json({status: '1', msg: 'Successfully logged out.', result: null});
    },
    getProfile: (req, res, next) => {
        console.log('requesting user profile', req.userId);
        res.status(200).json({status: '1', msg:'Success', result: null});
    },

    getUserCart: (req, res, next) => {
        if (req.userId) {
            let userId = req.userId;
            let sql = `SELECT cartId,productId,productName,productPrice,qty,productImg,totalPrice,createdAt FROM cartlist WHERE userId='${userId}' AND checked=0 AND deleted=0 ORDER BY cartId DESC;`;
            pool.query(sql, (err, result) => {
            if (err) {
                res.status(500).json({ status: '-1', msg: err.message, result: null});
            } else {
                res.status(200).json({
                    status: '1',
                    msg: 'Success',
                    result: result,
                });
            }
            });
        } else {
            res.status(401).json({status: '0', msg: 'Unauthorized', result: null});
        } 
    },
    addCart: (req, res, next) => {
        var pId = parseInt(req.body.params.pId);
        var pQty = parseInt(req.body.params.pQty);
        var userId = req.userId; //logged-in user's user id
        if (pool) {
            var sql = `SELECT productName,productPrice,productImg FROM goods WHERE productId=${pId};`;
            pool.query(sql, (err, result) => {
            if (err) {
                res.status(500).json({ status: '-1', msg: err.message, result: ''});
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
    },
    deleteProductFromCart: (req, res, next) => {
        if (req.userId) {
            let userId = req.userId;
            let pId = req.body.params.pId;
            let sql = `UPDATE cartlist SET deleted=1, deletedAt=CURRENT_TIMESTAMP WHERE productId=${pId} and userId='${userId}'`;
            pool.query(sql, (err, result) => {
                if (err) {
                    res.status(500).json({ status: '0', msg: err.message});
                } else { 
                    res.status(204).json({ status: '1', msg: 'Success', result: result});
                }
            });
        } else { 
            res.status(401).json({ status: '0', msg: 'Unauthorized', result: null});
        }
    },
    editCartItems: (req, res, next) => {
        let userId = req.userId;
        let proId = req.param('productId'); // 获取前台传过来的要删除的productId值
        let proNum = req.param('productNum'); // 获取前台传过来的要删除的productNum值
        let checked = req.param('checked'); // 获取前台传过来的要删除的chencked值
        let sql = `update cartlist set productNum=${proNum},checked=${checked} where productId=${proId} and userId=${userId}`;

        pool.query(sql, (err, result) => {
            if(err) {
                res.status(500).json({ status: '0', msg: err. message, result: ''});
            } else {
                res.status(200).json({ status: '1', msg: 'Success', result: result})
            }
        });
    },
    
    // Address Management
    getAddressList: (req, res, next) => {
        let userId = req.userId;
        let sql = `SELECT * FROM addresslist WHERE userId='${userId}' ORDER BY addressId DESC`;
        pool.query(sql, (err, result) => {
            if(err) {
                res.status(500).json({ status: '0', msg: err. message, result: ''});
            } else {
                res.status(200).json({ status: '1', msg: 'Success', result: result})
            }
        });
    },
    setDefaultAddress: (req, res, next) => {
        let userId = req.userId;
        let defaultFlag = '1';
        let allFlag = '0';
        let addressId = req.param('address'); // 获取前台传过来addressId值
        let sql1 = `update addresslist set isDefault=${allFlag} where userId=${userId}`;
        let sql = `update addresslist set isDefault=${defaultFlag} where userId=${userId} and addressId=${addressId}`;
        pool.query(sql1, (err1, result1) => {
            if(err1) {
                res.status(500).json({ status: '0', msg: err1. message, result: result1});
            } else {
                pool.query(sql, (err, result) => {
                     if(err) {
                        res.status(500).json({ status: '0', msg: err1. message, result: ''});
                    } else {
                        res.status(200).json({ status: '1', msg: 'Success', result: result})
                    }
                });
            }
        });
    },
    deleteAddress: (req, res, next) => {
        let userId = req.userId;
        let addressId = req.param('addressId'); // 获取前台传过来的要删除的addressId值
        let sql = `delete from addresslist where userId=${userId} and addressId=${addressId}`;
        pool.query(sql, (err, result) => {
            if(err) {
                res.status(500).json({ status: '0', msg: err.message, result: null});
            } else {
                res.status(204).json({ status: '1', msg: 'Success', result: result})
            }
        })
    },
    addAddress: (req, res, next) => {
        let userId = req.userId;
        let contactPerson = req.body.params['name'];
        let fullAddress = req.body.params['fullAddress']; // 获取前台传值
        let contactNumber = req.body.params['contactNumber']; // 获取前台值
        let postalCode = req.body.params['postalCode']; // 获取前台传值
        let defaultFlag = '0';
        let sql = `INSERT INTO addresslist(userId,userName,fullAddress,postCode,tel,isDefault) VALUES('${userId}','${contactPerson}','${fullAddress}','${postalCode}','${contactNumber}','${defaultFlag}')`;
        pool.query(sql, (err, result) => {
            if(err) {
                res.status(500).json({ status: '0', msg: err.message, result: null});
            } else {
                res.status(201).json({ status: '1', msg: 'Success', result: result})
            }
        })
    },

    // Order Management
    createOrder: (req, res, next) => {
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

        // Step 1-2: processing payment with Omise API
        let orderDesc = '#' + newOrderId.slice(-7, -1);
        if (paymentOption === 'Cards Online') {
            omise.charges.create({
                description: `Paying for order ${orderDesc}`,
                amount: req.body.params['totalPrice'] * 100,
                currency: req.body.params['omiseConfig']['currency'],
                capture: $conf.captureCharge,
                card: req.body.params['omiseConfig']['omiseToken'],
            }, (err, chargeRes) => {
                if (chargeRes.id) {
                    // Step 1-3: Wait for Omise API response, and then proceed with database operations
                    orderStatus = 2;
                    paymentStatus = 3;
                    paidAt = chargeRes.paid_at; //Omise Datetime format follows ISO 8601, needs conversion here
                    let newOrderSqlQuery = `INSERT INTO OMS_orders(orderId,userId,subTotal,shipping,insurance,discount,contactPerson,contactNumber,contactAddress,contactPostalCode,orderStatus,createdAt,paymentOption,paymentStatus,paymentTime) VALUES (${newOrderId},'${userId}',${subTotal},${shipping},${insurance},${discount},'${addressData.userName}','${addressData.tel}', '${addressData.fullAddress}','${addressData.postCode}',${orderStatus},CURRENT_TIMESTAMP,'${paymentOption}',${paymentStatus},CURRENT_TIMESTAMP);`;
                        pool.query(newOrderSqlQuery, (err, result) => {
                            if (err) {
                                res.status(500).json({ status: '0', msg: err.message, result: null});
                            } else {
                                console.log('Processing second step...');
                                //Step2: processing table: OMS_order_product_relation
                                let newOrderProductRelationQuery = `INSERT INTO OMS_order_product_relation(orderId, productId,productName,productPrice,productQty,productImg) SELECT ${newOrderId} AS orderId, productId, productName,productPrice,qty,productImg FROM cartlist WHERE userId='${userId}' AND cartId in (${checkedCartItems.join(',')});`;
                                pool.query(newOrderProductRelationQuery, (err, result) => {
                                    if (err) {
                                        console.log('Error occured during insert new order relation data...');
                                        res.status(500).json({ status: '0', msg: err.message, result: null });
                                    } else {
                                        //Step 3: processing table: cartlist, set checked products as checked=1
                                        let checkCartItemQuery = `UPDATE cartlist SET checked=1 WHERE deleted=0 AND checked=0 AND cartId IN (${checkedCartItems.join(',')});`;
                                        pool.query(checkCartItemQuery, (err, result) => {
                                            if (err) {
                                                console.log('Error occured during checking cart items:', checkedCartItems.join(','));
                                                res.status(500).json({ status: '0', msg: err.message, result: null });
                                            } else {
                                                res.status(204).json({ status: '1', msg: 'Success', result: result, orderId: newOrderId });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
            });
        } else {
            //Create order with or without payment made.
            let newOrderSqlQuery = `INSERT INTO OMS_orders(orderId,userId,subTotal,shipping,insurance,discount,contactPerson,contactNumber,contactAddress,contactPostalCode,orderStatus,createdAt,paymentOption,paymentStatus,paymentTime) VALUES (${newOrderId},'${userId}',${subTotal},${shipping},${insurance},${discount},'${addressData.userName}','${addressData.tel}', '${addressData.fullAddress}','${addressData.postCode}',${orderStatus}, CURRENT_TIMESTAMP,'${paymentOption}',${paymentStatus},${paidAt});`;
            pool.query(newOrderSqlQuery, (err, result) => {
                if (err) {
                    console.log('Error occured during insert new order data...');
                    res.status(500).json({ status: '0', msg: err.message, result: null });
                } else {
                    console.log('Processing without Omise Payment second step...');
                    console.log('[2 New Order Inserted, inserting relation] New Order Id is:', newOrderId);
                    //Step2: processing table: OMS_order_product_relation
                    let newOrderProductRelationQuery = `INSERT INTO OMS_order_product_relation(orderId, productId,productName,productPrice,productQty,productImg) SELECT ${newOrderId} AS orderId, productId, productName,productPrice,qty,productImg FROM cartlist WHERE userId='${userId}' AND cartId IN (${checkedCartItems.join(',')});`;
                    pool.query(newOrderProductRelationQuery, (err, result) => {
                        if (err) {
                            console.log('Error occured during insert new order relation data...');
                            res.json({ status: '0', msg: err.message, result: null });
                        } else {
                            console.log('[3 Relation Inserted] New Order Id is:', newOrderId);
                            //Step 3: processing table: cartlist, set checked products as checked=1
                            let checkedCartItems = req.body.params.checkedCartItemsId;
                            let checkCartItemQuery = `UPDATE cartlist SET checked=1 WHERE deleted=0 AND checked=0 AND cartId IN (${checkedCartItems.join(',')});`;
                            pool.query(checkCartItemQuery, (err, result) => {
                                if (err) { 
                                    console.log('Error occured during checking cart items:', checkedCartItems.join(','));
                                    res.json({status: '0', msg: err.message, result: null });
                                } else {
                                    console.log('[4 Updated Cartlist] New Order Id is:', newOrderId, 'checked items are: ', checkedCartItems);
                                    res.status(204).json({ status: '1', msg: 'Success', result: result, orderId: newOrderId});
                                }
                            });
                        }
                    });
                }
            });
        }
    },
    getAllOrder: (req, res, next) => {
        let userId = req.userId;
        let orderQuery = `SELECT * FROM OMS_orders where userId='${userId}' and orderStatus !=9 ORDER BY createdAt DESC LIMIT ${$conf.recentOrderLength};`;
        pool.query(orderQuery, (err, orderResult) => {
            if(err) {
                res.status(500).json({ status: '0', msg: err.message, result: null});
            } else {
                //Step 1: Processing orders
                let orderListIds = [];
                orderResult.forEach((v) => orderListIds.push(v.orderId));
                let productsQuery = `SELECT * FROM OMS_order_product_relation WHERE orderId IN (${orderListIds.join(',')});`;
                pool.query(productsQuery, (err, productResult) => {
                    if (err) res.status(500).json({ status: '0', msg: err.message, result: null});
                    // Step 2: Processing orders-products
                    orderResult.forEach((item) => {
                        item.orderProducts = [];
                        productResult.forEach((p) => {
                            if (p.orderId == item.orderId) item.orderProducts.push(JSON.parse(JSON.stringify(p)));
                        });
                    });
                    //Step 3: Send processed order details back
                    res.status(200).json({ status: '1', msg: 'Success', result: orderResult })
                })
            }
        });
    },
    deleteOrder: (req, res, next) => {
        let orderId = req.body.params['orderId']; 
        let sql = `update OMS_orders set orderStatus=9 where orderId='${orderId}' and userId='${req.userId}';`;
        pool.query(sql, (err, result) => {
            if (err) res.status(500).json({ status: '0', msg: err.message, result: result});
            console.log(result.affectedRows, 'deleted.')
            res.status(200).json({ status: '1', msg: 'Success', result: result })
        })
    },
    updateOrder: (req, res, next) => {
        let orderId = req.body.params['orderId']; 
        //TODO: Make allow multiple payment
        let paymentStatus = 3; //paymentStatus: 0=null, 1=to pay, 2=partial paid, 3=paid
        let sql = `update OMS_orders set paymentStatus=${paymentStatus} where orderId='${orderId}';`;
        if(pool) {
            pool.query(sql, (err, result) => {
            if (err) res.status(500).json({ status: '0', msg: err.message, result: null});
           
            res.status(200).json({ status: '1', msg: 'Success', result: result})
            });
        } else {
            res.status(500).json({status: 0, msg: err.msg});
        }
    }
}