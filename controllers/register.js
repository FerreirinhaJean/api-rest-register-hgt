const Register = require('../models/register');

module.exports = app => {

    app.get('/registros', (request, response) => {
        const date = request.query.date;
        if (date)
            Register.listByDate(date, response);
        else
            Register.list(response);
    });

    app.get('/registros/:id', (request, response) => {
        const id = parseInt(request.params.id);
        Register.findById(id, response);
    });

    app.post('/registros', (request, response) => {
        const register = request.body;
        Register.add(register, response)
    });

    app.delete('/registros/:id', (request, response) => {
        const id = parseInt(request.params.id);
        Register.deleteById(id, response);
    });

    app.put('/registros/:id', (request, response) => {
        const id = parseInt(request.params.id);
        const values = request.body;
        Register.updateById(id, values, response);
    })

};