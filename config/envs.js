module.exports = {
    server: {
        port: process.env.PORT || 3000
    },
    database: {
        url: process.env.MONGDB_URI || 'mongodb://localhost:27017/api-register-hgt'
    }
};