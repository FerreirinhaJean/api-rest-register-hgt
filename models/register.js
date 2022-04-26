const mongoose = require('mongoose');
const moment = require('moment');

const registerSchema = mongoose.Schema({
    date: {
        type: Date,
        required: [true, 'Date is required'],
        validate: {
            validator: (v) => {
                const dateFormat = moment(v, 'YYYY-MM-DD HH:mm:ss', true);
                return dateFormat.isValid();
            },
            message: props => `${props.value} is not valid date`
        }
    },
    value: {
        type: Number,
        required: [true, 'Value is required'],
        min: 1,
        max: 999
    },
    note: {
        type: String
    },
    createAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    type: {
        type: Number,
        required: [true, 'Type is required'],
        min: 1,
        max: 8
    },
    cpf: {
        type: String,
        required: [true, 'CPF is required'],
        validate: {
            validator: (v) => {
                return /^(\d{3}\d{3}\d{3}\d{2})$/.test(v);
            },
            message: props => `${props.value} is not valid CPF`
        },
        index: true
    }
});

const Register = mongoose.model('registers', registerSchema);

module.exports = Register;