const express = require('express');
const router = express.Router();

//Controllers
const ProductController = require('../../controllers/product');

router.route('/')
    .get(ProductController.getProducts)
    .post(ProductController.createOneProduct); //new, not used
router.route('/:productId')
    .get(ProductController.getProductDetails)
    .patch(ProductController.updateOneProduct); //new, not used


module.exports = router;