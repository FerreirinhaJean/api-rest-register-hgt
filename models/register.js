const connection = require('../infrastructure/connection');
const moment = require('moment');
const config = require('config');

class Register {
    add(register, response) {
        const data_criacao = moment().format('YYYY-MM-DD HH:mm:ss');
        const data = moment(register.data, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
        const registerWithDate = { ...register, data_criacao, data };

        const sql = `INSERT INTO registros SET ? `;
        connection.query(sql, registerWithDate, (error, results) => {
            if (error)
                response.status(400).json(error);
            else {
                const id = results.insertId;
                response.status(201).json(this.createResponse({ id, ...register }));
            }
        })
    };

    list(response) {
        const sql = 'SELECT * FROM registros';

        connection.query(sql, (error, results) => {
            if (error) {
                response.status(400).json(error);
            } else {
                response.status(200).json(this.createResponseList(results));
            }
        })
    };

    findById(id, response) {
        const sql = `SELECT * FROM registros WHERE id = ${id}`;

        connection.query(sql, (error, results) => {
            if (error)
                response.status(400).json(error);
            else {

                if (results.length == 0)
                    return response.status(404).send({
                        message: 'Register not found'
                    });

                response.status(200).json(this.createResponse(results[0]));
            }
        })
    };

    deleteById(id, response) {
        const sql = `DELETE FROM registros WHERE id = ${id}`;

        connection.query(sql, (error, results) => {
            if (error)
                response.status(400).json(error);
            else
                response.status(202).json({ message: 'Successfully deleted', id });
        });
    };

    updateById(id, values, response) {
        if (values.data)
            values.data = moment(values.data, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');

        const validations = [
            {
                name: 'data_criacao',
                isValid: values.data_criacao ? false : true,
                message: 'Não é possível atualizar a data de criação do registro'
            }
        ];

        const errors = validations.filter(fields => !fields.isValid);
        const hasErrors = errors.length;

        if (hasErrors) {
            response.status(400).json(errors);
        } else {
            const sql = `UPDATE registros SET ? WHERE id = ${id}`;

            connection.query(sql, [values, id], (error, results) => {
                if (error)
                    response.status(400).json(error);
                else
                    response.status(200).json({ ...values, id });
            });
        }
    }

    listByDate(date, response) {
        const dateCompleted = moment(date, 'DD/MM/YYYY', true);
        const dateMonthYear = moment(date, 'MM/YYYY', true);

        if (dateCompleted.isValid()) {
            const data = moment(dateCompleted, 'DD/MM/YYYY').format('YYYY-MM-DD');
            const sql = `SELECT * FROM registros WHERE DATE(data) = '${data}'`;

            connection.query(sql, (error, results) => {
                if (error)
                    response.status(400).json(error);
                else {
                    response.status(200).json(this.createResponseList(results));
                }
            });
        }
        else if (dateMonthYear.isValid()) {
            const sql = `SELECT * FROM registros WHERE EXTRACT(MONTH FROM data) = ${dateMonthYear.month() + 1} AND EXTRACT(YEAR FROM data) = ${dateMonthYear.year()}`;

            connection.query(sql, (error, results) => {
                if (error)
                    response.status(400).json(error);
                else {
                    response.status(200).json(this.createResponseList(results));
                }
            });
        }
        else {
            response.status(400).json({
                name: 'Filter by date',
                message: 'Invalid filter'
            });
        }

    };

    createResponseList(registers) {
        return registers.length > 0 ? {
            count: registers.length,
            registers:
                registers.map(register => {
                    return {
                        id: register.id,
                        date: moment(register.data).format('DD/MM/YYYY HH:mm:ss'),
                        typeExam: register.tipo_exame,
                        value: register.resultado,
                        description: register.observacao,
                        createdAt: moment(register.data_criacao).format('DD/MM/YYYY HH:mm:ss')
                    }
                })
        } : {};
    };

    createResponse(register) {
        return {
            id: register.id,
            date: moment(register.data, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm:ss'),
            typeExam: register.tipo_exame,
            value: register.resultado,
            description: register.observacao,
            createdAt: moment(register.data_criacao).format('DD/MM/YYYY HH:mm:ss')
        };
    };

    authenticated(request, response, next) {
        const error = { error: 'You are not authorized to access this API' };
        if (request.headers.authorization === config.get('api.authorization'))
            return next();
        else
            return response.status(401).send(error);
    }
};

module.exports = new Register;