const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'firstName is required']
    },
    lastName: {
        type: String,
        required: [true, 'lastName is required']
    },
    birthDate: {
        type: Date,
        require: [true, 'birthDate is required']
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
        unique: true
    },
    createAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

const User = mongoose.model('users', userSchema);

module.exports = User;