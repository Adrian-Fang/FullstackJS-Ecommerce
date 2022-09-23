var router = require('express').Router();

//Controllers
const UserController = require('../../controllers/user')
const AuthController = require('../../controllers/auth')
const EmailController = require('../../controllers/mailer')
const DownloadController = require('../../controllers/downloader')

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
router.route('/addresses').get(UserController.getAddressList).post(UserController.addAddress)
router.route('/setDefaultAdress').post(UserController.setDefaultAddress)
router.route('/delAddress').post(UserController.deleteAddress)

//APIs: User Orders
router.route('/orders').get(UserController.getAllOrder).post(UserController.createOrder)
router.route('/downloadAllOrder').get(DownloadController.downloadAllOrder)
router.route('/delOrder').post(UserController.deleteOrder)
router.route('/payOrder').post(UserController.updateOrder)

module.exports = router;
