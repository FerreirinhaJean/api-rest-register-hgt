const connection = require('../infrastructure/connection');
const moment = require('moment');

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
                const registerInsert = { id, ...register };
                response.status(201).json({ registerInsert });
            }
        })
    };

    list(response) {
        const sql = 'SELECT * FROM registros';

        connection.query(sql, (error, results) => {
            if (error) {
                response.status(400).json(error);
            } else {

                if (results.length == 0)
                    return response.status(404).send({
                        message: 'Register not found'
                    });

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
                response.status(200).json({ id });
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
                else
                    response.status(200).json(results);
            });
        }
        else if (dateMonthYear.isValid()) {
            const sql = `SELECT * FROM registros WHERE EXTRACT(MONTH FROM data) = ${dateMonthYear.month() + 1} AND EXTRACT(YEAR FROM data) = ${dateMonthYear.year()}`;

            connection.query(sql, (error, results) => {
                if (error)
                    response.status(400).json(error);
                else
                    response.status(200).json(results);
            });
        }
        else {
            response.status(400).json({
                nome: 'filtro por data',
                message: 'Filtro informado é inválido'
            });
        }

    };

    createResponseList(registers) {
        return {
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
        };
    };

    createResponse(register) {
        return {
            id: register.id,
            date: moment(register.data).format('DD/MM/YYYY HH:mm:ss'),
            typeExam: register.tipo_exame,
            value: register.resultado,
            description: register.observacao,
            createdAt: moment(register.data_criacao).format('DD/MM/YYYY HH:mm:ss')
        };
    };

};

module.exports = new Register;