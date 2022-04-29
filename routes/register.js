const register = require('../controllers/register');
const express = require('express');
const router = express.Router();

function send(req, res, response) {
    return response.error ? res.status(400).send(response) : res.status(200).send(response);
};

router.get('/', register.authenticated, async (req, res) => {
    const response = await register.getAll();
    send(req, res, response);
});

router.get('/:user_cpf', register.authenticated, async (req, res) => {
    const response = await register.getByCpf({
        cpf: req.params.user_cpf
    });
    send(req, res, response);
});

router.post('/:user_cpf', register.authenticated, async (req, res) => {
    let response = await register.create({
        cpf: req.params.user_cpf,
        date: req.body.date,
        value: req.body.value,
        note: req.body.note,
        type: req.body.type
    });
    send(req, res, response);
});

router.delete('/:register_id', register.authenticated, async (req, res) => {
    const response = await register.delete({
        _id: req.params.register_id
    });
    send(req, res, response);
});

router.put('/:register_id', register.authenticated, async (req, res) => {
    const response = await register.update({
        _id: req.params.register_id,
        date: req.body.date,
        value: req.body.value,
        note: req.body.note,
        type: req.body.type,
        cpf: req.body.cpf
    });
    send(req, res, response);
})

module.exports = router;