const mongoose = require('mongoose');
const { isEmail } = require('validator');

const PasswordResetSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please enter an email"],
        lowercase: true,
        validate: [isEmail, "Please enter a valid email"]
    },
    token: {
        type: String,
    },
    date_created: {
        type: String,
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
    });

const PasswordReset = mongoose.model('password_resets', PasswordResetSchema);

module.exports = PasswordReset;