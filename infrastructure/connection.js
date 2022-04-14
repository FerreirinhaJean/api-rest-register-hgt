const mysql = require('mysql');
const config = require('config');

const connection = mysql.createConnection({
    host: config.get('mysql.dev.host'),
    port: config.get('mysql.dev.port'),
    user: config.get('mysql.dev.user'),
    password: config.get('mysql.dev.password'),
    database: config.get('mysql.dev.database')
});

module.exports = connection;