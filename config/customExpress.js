const express = require('express');
const morgan = require('morgan');
const registerRoute = require('../routes/register');
const userRoute = require('../routes/user');
const cors = require('cors');

module.exports = () => {
    const app = express();
    app.use(express.json());
    app.use(morgan('dev'));
    app.use(cors()); 

    app.use('/api/registros', registerRoute);
    app.use('/api/usuarios', userRoute);

    app.use((request, response, next) => {
        const error = new Error('Not found');
        error.status = 404;
        next(error);
    });

    app.use((error, request, response, next) => {
        response.status(error.status || 500);
        return response.send({
            error: {
                message: error.message
            }
        })
    });

    return app;
};