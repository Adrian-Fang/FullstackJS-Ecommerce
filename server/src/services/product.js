const { pool, promisePool } = require('../database/connection');

const getAllProducts = async ( filter ) => {
    let { pageNum, pageSize, sort, keyword } = filter;
    let pageStart = (pageNum - 1) * pageSize;
    const sql = `select * from products 
                    where productName like '%${keyword}%' 
                    order by ${sort} 
                    limit ${pageStart},${pageSize};`;
    try {
        const [rows, _] = await promisePool.query(sql)
        return rows;
    } catch (error) {
        throw(error);
    }
};

const createOneProduct = async ( product ) => {
    let { productId, productName, productPrice } = product;
    //TODO: introduce models to validate product
    if(productId && productName && productPrice) {
        const sql = `insert into products set ?`;
        try {
            const [result, _] = await promisePool.query(sql, product);
            return result;
        } catch (error) {
            throw(error);
        }
    } else {
        throw new Error('Fields required missing');
    }
};

const getOneProduct = async (productId) => {
    let sql = `select * from products where productId=${productId}`;
    try {
        const [product, _] = await promisePool.query(sql);
        return product;
    } catch (error) {
        throw error;
    }
};

const updateOneProduct = async ( productId, product ) => {

    if(productId) {
        const sql1 = `select * from products where productId = ${productId}`;
        const [result1,_] = await promisePool.query(sql1);
        if(result1.length == 0) {
            throw { status: 404, msg: `Can't find product with the id ${productId}.`}
        } else {
            const sql = `update products set ? where productId=${productId}`;
            try {
                const [result, _] = await promisePool.query(sql, product);
                return result;
            } catch (error) {
                throw(error);
            }
        }
    } else {
        throw new Error('Fields required missing');
    }
};

module.exports = {
    getAllProducts,
    getOneProduct,
    createOneProduct,
    updateOneProduct,
}