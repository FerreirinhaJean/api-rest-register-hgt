const express = require('express');
const consing = require('consign');

module.exports = () => {
    const app = express();
    app.use(express.json());

    consing().include('controllers').into(app);

    return app;
};