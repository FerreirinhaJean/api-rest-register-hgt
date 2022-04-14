const express = require('express');
const morgan = require('morgan');
const registerRoute = require('../controllers/register');

module.exports = () => {
    const app = express();
    app.use(express.json());
    app.use(morgan('dev'));

    //CORS
    app.use((request, response, next) => {
        response.header('Access-Control-Allow-Origin', '*');
        response.header('Access-Control-Allow-Header',
            'Origin, X-Requested-With, Content-Type, Accept, Authorization');

        if (response.method === 'OPTIONS') {
            response.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE, GET');
            return response.status(200).send({});
        }

        next();
    });

    app.use('/registros', registerRoute);

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