const mysql = require('mysql');
const $conf = require('../../conf');
const pool = mysql.createPool($conf.mysql[process.env.NODE_ENV]);

module.exports = {
    searchProductResults: (req, res, next) => {
        var keyword = req.query['keyword'];
        var page = parseInt(req.query['page']); // 获取前台传过来的page(第几页)值
        var pageSize = parseInt(req.query['pageSize']); // 获取前台传过来的pageSize(每页多少条)值
        var offset = (page - 1) * pageSize;
        var sql = `select * from goods where productName LIKE '%${keyword}%' or productDetails LIKE '%${keyword}%' order by productId limit ${pageSize} offset ${offset}`;
        pool.query(sql, (err, result) => {
            if (err) {
            res.json({
                status: '-1',
                msg: err.message,
            });
            } else {
            res.json({
                status: '1',
                msg: 'Success',
                result: result,
            });
            }
        });
    }
}