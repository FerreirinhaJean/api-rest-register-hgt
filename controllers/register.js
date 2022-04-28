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
            error: 'Registro não encontrado'
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

// class Register {
//     add(register, response) {
//         const data_criacao = moment().format('YYYY-MM-DD HH:mm:ss');
//         const data = moment(register.data, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
//         const registerWithDate = { ...register, data_criacao, data };

//         const sql = `INSERT INTO registros SET ? `;
//         connection.query(sql, registerWithDate, (error, results) => {
//             if (error)
//                 response.status(400).json(error);
//             else {
//                 const id = results.insertId;
//                 response.status(201).json(this.createResponse({ id, ...register }));
//             }
//         });
//     };

//     list(response) {
//         const sql = 'SELECT * FROM registros';
//         connection.query(sql, (error, results) => {
//             if (error) {
//                 console.log(error);
//                 response.status(400).json(error);
//             } else {
//                 response.status(200).json(this.createResponseList(results));
//             }
//         });
//     };

//     findById(id, response) {
//         const sql = `SELECT * FROM registros WHERE id = ${id}`;

//         connection.query(sql, (error, results) => {
//             if (error)
//                 response.status(400).json(error);
//             else {

//                 if (results.length == 0)
//                     return response.status(404).send({
//                         message: 'Register not found'
//                     });

//                 response.status(200).json(this.createResponse(results[0]));
//             }
//         })
//     };

//     deleteById(id, response) {
//         const sql = `DELETE FROM registros WHERE id = ${id}`;

//         connection.query(sql, (error, results) => {
//             if (error)
//                 response.status(400).json(error);
//             else
//                 response.status(202).json({ message: 'Successfully deleted', id });
//         });
//     };

//     updateById(id, values, response) {
//         if (values.data)
//             values.data = moment(values.data, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');

//         const validations = [
//             {
//                 name: 'data_criacao',
//                 isValid: values.data_criacao ? false : true,
//                 message: 'Não é possível atualizar a data de criação do registro'
//             }
//         ];

//         const errors = validations.filter(fields => !fields.isValid);
//         const hasErrors = errors.length;

//         if (hasErrors) {
//             response.status(400).json(errors);
//         } else {
//             const sql = `UPDATE registros SET ? WHERE id = ${id}`;

//             connection.query(sql, [values, id], (error, results) => {
//                 if (error)
//                     response.status(400).json(error);
//                 else
//                     response.status(200).json({ ...values, id });
//             });
//         }
//     }

//     listByDate(date, response) {
//         const dateCompleted = moment(date, 'DD/MM/YYYY', true);
//         const dateMonthYear = moment(date, 'MM/YYYY', true);

//         if (dateCompleted.isValid()) {
//             const data = moment(dateCompleted, 'DD/MM/YYYY').format('YYYY-MM-DD');
//             const sql = `SELECT * FROM registros WHERE DATE(data) = '${data}'`;

//             connection.query(sql, (error, results) => {
//                 if (error)
//                     response.status(400).json(error);
//                 else {
//                     response.status(200).json(this.createResponseList(results));
//                 }
//             });
//         }
//         else if (dateMonthYear.isValid()) {
//             const sql = `SELECT * FROM registros WHERE EXTRACT(MONTH FROM data) = ${dateMonthYear.month() + 1} AND EXTRACT(YEAR FROM data) = ${dateMonthYear.year()}`;

//             connection.query(sql, (error, results) => {
//                 if (error)
//                     response.status(400).json(error);
//                 else {
//                     response.status(200).json(this.createResponseList(results));
//                 }
//             });
//         }
//         else {
//             response.status(400).json({
//                 name: 'Filter by date',
//                 message: 'Invalid filter'
//             });
//         }

//     };

//     createResponseList(registers) {
//         return registers.length > 0 ? {
//             count: registers.length,
//             registers:
//                 registers.map(register => {
//                     return {
//                         id: register.id,
//                         date: moment(register.data).format('DD/MM/YYYY HH:mm:ss'),
//                         typeExam: register.tipo_exame,
//                         value: register.resultado,
//                         description: register.observacao,
//                         createdAt: moment(register.data_criacao).format('DD/MM/YYYY HH:mm:ss')
//                     }
//                 })
//         } : {};
//     };

//     createResponse(register) {
//         return {
//             id: register.id,
//             date: moment(register.data, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm:ss'),
//             typeExam: register.tipo_exame,
//             value: register.resultado,
//             description: register.observacao,
//             createdAt: moment(register.data_criacao).format('DD/MM/YYYY HH:mm:ss')
//         };
//     };

//     authenticated(request, response, next) {
//         const error = { error: 'You are not authorized to access this API' };
//         if (request.headers.authorization === config.get('api.authorization'))
//             return next();
//         else
//             return response.status(401).send(error);
//     }
// };