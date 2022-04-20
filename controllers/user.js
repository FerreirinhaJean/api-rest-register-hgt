const mongoose = require('mongoose');
const User = require('../models/user');


function isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
};

const user = {
    async getAll() {
        const error = {
            error: 'Usuários não encontrados'
        };
        return await User.find() || error;
    },

    async getById({ _id }) {
        const error = {
            error: 'Usuário não encontrado'
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
            error: 'Usuário não encontrado com o CPF informado'
        };

        try {
            return await User.findOne({ cpf }) || error;
        } catch {
            return error;
        }
    },

    async create({ firstName, lastName, birthDate, cpf }) {
        const error = {
            error: 'Dados inválidos para criar um novo usuário'
        };

        if (!firstName || !lastName || !birthDate || !cpf) return error;

        try {
            return await User.create({ firstName, lastName, birthDate, cpf });
        } catch {
            return error;
        }
    },

    async update({ _id, firstName, lastName, birthDate }) {
        const error = {
            error: 'Dados inválidos para atualizar o usuário'
        };

        if (!_id || !firstName || !lastName || !birthDate) return error;

        try {
            const userUpdate = await User.updateOne({ _id }, { $set: { firstName, lastName, birthDate } });
            return userUpdate.matchedCount ? user.getById({ _id }) : error;
        } catch {
            return error;
        }
    },

    async delete({ _id }) {
        const error = {
            error: 'Dados inválidos para deletar este usuário'
        };

        if (!_id || !isValidId(_id)) return error;

        try {
            const deleteUser = await User.deleteOne({ _id });
            return deleteUser.deletedCount ? 'Usuário deletado com sucesso!' : error;
        } catch {
            return error;
        }
    }

};

module.exports = user;