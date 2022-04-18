const mysql = require('mysql');
const config = require('config');

const connection = mysql.createPool({
    host: config.get('mysql.prod.host'),
    port: config.get('mysql.prod.port'),
    user: config.get('mysql.prod.user'),
    password: config.get('mysql.prod.password'),
    database: config.get('mysql.prod.database')
});

module.exports = connection;