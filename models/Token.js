const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const tokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    }
},
    {
        timestamps: true
    });

tokenSchema.statics.revokeTokens = async function (token) {
    const revoke_token = await this.deleteOne({ token: token });
    if (!revoke_token) {
        throw Error;
    }
}

const Token = mongoose.model('token', tokenSchema);

module.exports = Token;