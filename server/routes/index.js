var express = require('express');
var router = express.Router();

//Controllers
const ProductController = require('../controller/v1/product')
const SearchController = require('../controller/v1/search')


//APIs: Products
router.route('/').get(ProductController.index);
router.route('/list').get(ProductController.fetchProducts);
router.route('/getDetails').get(ProductController.fetchProductDetails);

//APIs: Search
router.route('/search').get(SearchController.searchProductResults)


module.exports = router;
