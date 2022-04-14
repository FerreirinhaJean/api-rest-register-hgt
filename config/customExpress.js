const express = require('express');
const morgan = require('morgan');
const registerRoute = require('../controllers/register');

module.exports = () => {
    const app = express();
    app.use(express.json());
    app.use(morgan('dev'));

    app.use('/registros', registerRoute);

    app.use((request, response, next) => {
        const error = new Error('Não encontrado');
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