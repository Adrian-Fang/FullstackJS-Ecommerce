const mysql = require('mysql2');
const config = require('../conf');

const dbConfig = config.mysql[process.env.NODE_ENV];
const dbUri = `mysql://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}/${dbConfig.database}?charset=${dbConfig.charset}`;

//TODO: Option 1, use ORM lib, Sequelize 
// const sequelize = new Sequelize(dbUri, {
//     logging: (...msg) => console.log(msg) //enabling logging, optional
// });

//option 2: use mysql2 directly
const pool = mysql.createPool(dbUri); 
const promisePool = pool.promise();

module.exports = {
    pool,
    promisePool
}