const mysql = require('mysql');
const $conf = require('../conf');
const pool = mysql.createPool($conf.mysql[process.env.NODE_ENV]);

module.exports = {
    pool,
}