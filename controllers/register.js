const Register = require('../models/register');
const express = require('express');
const register = require('../models/register');
const router = express.Router();

router.get('/', Register.authenticated, (request, response) => {
    const date = request.query.date;
    if (date)
        Register.listByDate(date, response);
    else
        Register.list(response);
});

router.get('/:id', Register.authenticated, (request, response) => {
    const id = parseInt(request.params.id);
    Register.findById(id, response);
});

router.post('/', Register.authenticated, (request, response) => {
    const register = request.body;
    Register.add(register, response)
});

router.delete('/:id', Register.authenticated, (request, response) => {
    const id = parseInt(request.params.id);
    Register.deleteById(id, response);
});

router.put('/:id', Register.authenticated, (request, response) => {
    const id = parseInt(request.params.id);
    const values = request.body;
    Register.updateById(id, values, response);
})

module.exports = router;