const mongoose = require('mongoose');

const registerSchema = mongoose.Schema({
    date: {
        type: Date,
        required: [true, 'Date is required']
    },
    value: {
        type: Number,
        required: [true, 'Value is required']
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
        required: [true, 'Type is required']
    },
    cpf: {
        type: String,
        required: [true, 'CPF is required'],
        validate: {
            validator: (v) => {
                return /^(\d{3}\d{3}\d{3}\d{2})$/.test(v);
            },
            message: props => `${props.value} is not valid CPF`
        }
    }
});

const Register = mongoose.model('registers', registerSchema);

module.exports = Register;