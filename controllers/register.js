const Register = require('../models/register');
const express = require('express');
const router = express.Router();

router.get('/', (request, response) => {
    const date = request.query.date;
    if (date)
        Register.listByDate(date, response);
    else
        Register.list(response);
});

router.get('/:id', (request, response) => {
    const id = parseInt(request.params.id);
    Register.findById(id, response);
});

router.post('/', (request, response) => {
    const register = request.body;
    Register.add(register, response)
});

router.delete('/:id', (request, response) => {
    const id = parseInt(request.params.id);
    Register.deleteById(id, response);
});

router.put('/:id', (request, response) => {
    const id = parseInt(request.params.id);
    const values = request.body;
    Register.updateById(id, values, response);
})

module.exports = router;