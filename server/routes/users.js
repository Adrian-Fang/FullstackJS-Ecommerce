var router = require('express').Router();

//Controllers
const UserController = require('../controller/user')
const AuthController = require('../controller/auth/auth')
const EmailController = require('../controller/v1/mailer')

//APIs: User
router.route('/').get(EmailController.sendTestEmail, UserController.index)
router.route('/checkUserExist').get(UserController.checkUserExist)
router.route('/verifyUser').post(AuthController.verifyEmailOrMobile)
router.route('/register').post(UserController.register)
router.route('/login').post(UserController.login)
router.route('/logout').get(UserController.logout)
router.route('/me').get(UserController.getProfile)
router.route('/authorisation').get(UserController.checkLogin)

//APIs: User Shopping
router.route('/getCartData').get(UserController.getUserCart)
router.route('/addCart').post(UserController.addCart)
router.route('/delProduct').post(UserController.deleteProductFromCart)
router.route('/editProductNum').get(UserController.editCartItems)

//APIs: User Address Management
router.route('/addressList').get(UserController.getAddressList)
router.route('/setDefauleAdr').get(UserController.setDefaultAddress)
router.route('/delAdr').get(UserController.deleteAddress)
router.route('/insertAdr').post(UserController.addAddress)

//APIs: User Orders
router.route('/submitOrder').post(UserController.createOrder)
router.route('/getOrderData').get(UserController.getAllOrder)
router.route('/delOrder').get(UserController.deleteOrder)
router.route('/updateOrder').get(UserController.updateOrder)

module.exports = router;
