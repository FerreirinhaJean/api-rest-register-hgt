const mongoose = require('mongoose');
const Register = require('../models/register');
const envs = require('../config/envs');
const userController = require('./user');

function responseError(errors) {
    const keysSet = Object.keys(errors);

    let fieldErrors = [];

    for (let key in keysSet) {
        fieldErrors.push({ field: keysSet[key], message: errors[keysSet[key]].message });
    }

    return fieldErrors;
};

function isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
};

const register = {
    async getAll() {
        const error = {
            error: 'Registers not found'
        };
        return await Register.find() || error;
    },

    async getById({ _id }) {
        const error = {
            error: 'Register not found'
        };
        if (!_id) return error;

        try {
            return await Register.findOne({ _id });
        } catch {
            return error;
        }
    },

    async getByCpf({ cpf }) {
        const error = {
            error: 'CPF is not found'
        };

        if (!cpf) return error;

        try {
            return await Register.find({ cpf }) || error;
        } catch {
            return error;
        }

    },

    async create({ cpf, date, value, note, type }) {
        const error = {
            error: 'Data is not valid to create a new register'
        };

        const register = new Register({
            date: date,
            value: value,
            note: note,
            type: type,
            cpf: cpf
        });

        const hasUser = await userController.getByCpf({ cpf });
        if (!hasUser) return { error: 'CPF is not exist' }

        const isNotValid = register.validateSync();
        if (isNotValid) return { ...error, fields: responseError(isNotValid.errors) };

        try {
            return await Register.create(register);
        } catch {
            return error;
        }
    },

    async delete({ _id }) {
        const error = {
            error: 'Invalid Id to deleted register'
        };

        if (!_id || !isValidId(_id)) return error;

        try {
            const deleteRegister = await Register.deleteOne({ _id });
            return deleteRegister.deletedCount ? { id: _id, message: 'Register has been deleted' } : error;
        } catch {
            return error;
        }
    },

    async update({ _id, date, value, note, type, cpf }) {
        const error = {
            error: 'Invalid data to update a register'
        };

        const register = new Register({
            date: date,
            value: value,
            note: note,
            type: type,
            cpf: cpf
        });

        const isNotValid = register.validateSync();

        if (!_id) return error;
        if (isNotValid) return {
            ...error, fields: responseError(isNotValid.errors)
        };

        try {
            const registerUpdate = await Register.updateOne({ _id }, { $set: { date, value, note, type, cpf } });
            return registerUpdate.matchedCount ? this.getById({ _id }) : error;
        } catch {
            return error;
        }
    },

    authenticated(request, response, next) {
        const error = { error: 'You are not authorized to access this API' };
        if (request.headers.authorization === envs.auth.access)
            return next();
        else
            return response.status(401).send(error);
    }
};

module.exports = register;