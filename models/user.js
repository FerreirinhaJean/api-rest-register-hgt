const mongoose = require('mongoose');
const Register = require('./register');

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    birthDate: {
        type: Date,
        require: true
    },
    cpf: {
        type: String,
        required: true
    },
    createAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    registers: [Register.registerSchema]
});

const User = mongoose.model('users', userSchema);

module.exports = User;