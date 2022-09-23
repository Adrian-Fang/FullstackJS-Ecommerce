const productService = require('../services/product')

module.exports = {
    getProducts: async (req, res, next) => {
        const { pageNum=1, pageSize=8, sort='productPrice', keyword='' } = req.query;
        try {
            const allProducts = await productService.getAllProducts({ pageNum, pageSize, sort, keyword });
            res.status(200).send({ status: '1', msg: 'Success', data: allProducts })
        } catch (error) {
            next(error);
        }
    },
    createOneProduct: async (req, res, next) => {
        try {
            const newProduct = await productService.createOneProduct(req.body);
            res.status(201).send({ status: '1', msg: 'Success', data: newProduct })
        } catch (error) {
            next(error);
        }
    },
    getProductDetails: async (req, res, next) => {
        let { productId=null } = req.params;
        if(!productId) {
            res.status(400).send({ status: '0', msg: 'Resource ID is required.'})
        } else {
            try {
                const result = await productService.getOneProduct(productId);
                res.status(200).send({ status: '1', msg: 'Success', data: result })
            } catch (error) {
                next(error);
            }
        }
    },
    updateOneProduct: async (req, res, next) => {
        let { productId=null } = req.params;
        if(!productId) {
            res.status(400).send({ status: '0', msg: 'Resource ID is required.'})
        } else {
            try {
                const result = await productService.updateOneProduct(productId, req.body);
                res.status(204).send({ status: '1', msg: 'Success', data: result })
            } catch (error) {
                next(error);
            }
        }
    }
}