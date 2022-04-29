const mongoose = require('mongoose');
const User = require('../models/user');
const envs = require('../config/envs');


function isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
};

function responseError(errors) {
    const keysSet = Object.keys(errors);

    let fieldErrors = [];

    for (let key in keysSet) {
        fieldErrors.push({ field: keysSet[key], message: errors[keysSet[key]].message });
    }

    return fieldErrors;
};

async function isDuplicateCPF(cpf) {
    const result = await User.findOne({ cpf });
    return result;
}

const user = {
    async getAll() {
        const error = {
            error: 'Users not found'
        };
        return await User.find() || error;
    },

    async getById({ _id }) {
        const error = {
            error: 'User not found'
        };

        if (!_id) return error;

        if (!isValidId(_id))
            return this.getByCpf({ cpf: _id });

        try {
            return await User.findOne({ _id }) || error;
        } catch (er) {
            return error;
        }
    },

    async getByCpf({ cpf }) {
        const error = {
            error: 'User not found'
        };

        try {
            return await User.findOne({ cpf }) || error;
        } catch {
            return error;
        }
    },

    async create({ firstName, lastName, birthDate, cpf }) {
        const error = {
            error: 'Invalid data to create a new user'
        };

        const user = new User({
            firstName: firstName,
            lastName: lastName,
            birthDate: birthDate,
            cpf: cpf
        });

        const isNotValid = user.validateSync();

        if (isNotValid) return { ...error, fields: responseError(isNotValid.errors) };
        if (await isDuplicateCPF(cpf)) return { error: 'CPF entered is already registered' };

        try {
            return await User.create({ firstName, lastName, birthDate, cpf });
        } catch (erros) {
            return error;
        }
    },

    async update({ _id, firstName, lastName, birthDate }) {
        const error = {
            error: 'Invalid data to update a user'
        };

        const user = new User({
            firstName: firstName,
            lastName: lastName,
            birthDate: birthDate
        });

        const isNotValid = user.validateSync({ pathsToSkip: ['cpf'] });

        if (!_id) return error;
        if (isNotValid) return {
            ...error, fields: responseError(isNotValid.errors)
        };

        try {
            const userUpdate = await User.updateOne({ _id }, { $set: { firstName, lastName, birthDate } });
            return userUpdate.matchedCount ? this.getById({ _id }) : error;
        } catch {
            return error;
        }
    },

    async delete({ _id }) {
        const error = {
            error: 'Invalid data to delete a user'
        };

        if (!_id || !isValidId(_id)) return error;

        try {
            const deleteUser = await User.deleteOne({ _id });
            return deleteUser.deletedCount ? { id: _id, message: 'User has been deleted' } : error;
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

module.exports = user;