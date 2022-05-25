const pool = require('../../util/database').pool;

module.exports = {
    index: (req, res, next) => {
        res.status(200).json({
            status: '1',
            message: 'Success'
        });
    },
    fetchProducts: (req, res, next) => {
        const reqQuery = Object.assign(req.query); //TODO: No idea why cannot direcly use req.query...
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
                    res.status(500).json({
                        status: '-1',
                        msg: err.message,
                        pageNum: pageNum,
                    });
                } else {
                    // res.send( JSON.stringify(result));
                    res.status(200).json({
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
        } else {
            console.log('an err occured when query product data, likely a db connection error.');
        }
    },
    fetchProductDetails: (req, res, next) => {
        let productId = parseInt(req.query['productId']); // 获取前台传过来的productId值
        let sql = `select * from goods where productId=${productId}`;
        pool.query(sql, (err, result) => {
            if(err) {
                res.status(500).json({
                    status:'0',
                    msg: err.message
                });
            } else {
                res.status(200).json({
                    status: '1',
                    msg:'Success',
                    result: result
                });
            };
        });
    }
}