const register = require('../controllers/register');
const express = require('express');
const router = express.Router();

function send(req, res, response) {
    return response.error ? res.status(400).send(response) : res.status(200).send(response);
};

router.get('/', async (req, res) => {
    const response = await register.getAll();
    send(req, res, response);
});

router.get('/:user_cpf', async (req, res) => {
    const response = await register.getByCpf({
        cpf: req.params.user_cpf
    });
    send(req, res, response);
});

router.post('/:user_cpf', async (req, res) => {
    let response = await register.create({
        cpf: req.params.user_cpf,
        date: req.body.date,
        value: req.body.value,
        note: req.body.note,
        type: req.body.type
    });
    send(req, res, response);
});

// router.get('/:id', Register.authenticated, (request, response) => {
//     const id = parseInt(request.params.id);
//     Register.findById(id, response);
// });

// router.post('/', Register.authenticated, (request, response) => {
//     const register = request.body;
//     Register.add(register, response)
// });

// router.delete('/:id', Register.authenticated, (request, response) => {
//     const id = parseInt(request.params.id);
//     Register.deleteById(id, response);
// });

// router.put('/:id', Register.authenticated, (request, response) => {
//     const id = parseInt(request.params.id);
//     const values = request.body;
//     Register.updateById(id, values, response);
// })

module.exports = router;