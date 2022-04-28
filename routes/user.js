const user = require('../controllers/user');
const express = require('express');
const router = express.Router();

function send(req, res, response) {
    return response.error ? res.status(400).send(response) : res.status(200).send(response);
};

router.get('/', user.authenticated, async (req, res) => {
    const response = await user.getAll();
    send(req, res, response);
});

router.get('/:id', user.authenticated, async (req, res) => {
    const response = await user.getById({ _id: req.params.id });
    send(req, res, response);
});

router.post('/', user.authenticated, async (req, res) => {
    const response = await user.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        birthDate: req.body.birthDate,
        cpf: req.body.cpf
    });

    send(req, res, response);
});

router.put('/:id', user.authenticated, async (req, res) => {
    const response = await user.update({
        _id: req.params.id,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        birthDate: req.body.birthDate
    });

    send(req, res, response);
});

router.delete('/:id', user.authenticated, async (req, res) => {
    const response = await user.delete({
        _id: req.params.id
    });

    send(req, res, response);
});

module.exports = router;