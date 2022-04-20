const mongoose = require('mongoose');
const envs = require('../config/envs');

mongoose.connect(envs.database.url)
    .then(() => {
        console.log('MongoDB connected...');
    }).catch((error) => {
        console.log('MongoDB error:', error);
    });

module.exports = mongoose.connection;