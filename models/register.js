const mongoose = require('mongoose');

const registerSchema = mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    value: {
        type: Number,
        required: true
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
        required: true
    }
});

const Register = mongoose.model('registers', registerSchema);

module.exports = { Register, registerSchema };