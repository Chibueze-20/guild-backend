const User = require('../models/User');
const Token = require('../models/Token');
const jwt = require('jsonwebtoken');
require('dotenv').config();


//handle errors
const handleErrors = (err) => {
    let errors = {};

    //login errors
    if (err.message === "Incorrect email") {
        errors.email = "Incorrect email";
        return errors;
    }
    if (err.message === "Incorrect password") {
        errors.email = "Incorrect password";
        return errors;
    }

    //duplicate error code
    if (err.code = 11000) {
        if (err.message.includes("username")) {
            errors.username = "Username already in use"
        }
        if (err.message.includes("email")) {
            errors.email = "Email already in use"
        }
        return errors
    }

    //validation errors
    if (err.message.includes("user validation failed")) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }

    return errors;
}

const createToken = (id) => {
    return jwt.sign({ id }, process.env.GUILD_API_SECRET, { expiresIn: "1y" })
}

module.exports.signup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const user = await User.create({ username, email, password });
        const token = createToken(user._id);
        await Token.create({ token: token })
        const user_data = user.toJSON();
        delete user_data.password;
        delete user_data.__v;
        res.status(201).json({ user_data, token });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors })
    }
}

module.exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        await Token.create({ token: token })
        res.status(200).json({ user, token });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors })
    }
}

module.exports.logout = async (req, res) => {
    try {
        await Token.revokeTokens(req.body.token);
        res.status(200).send({
            status: 'success',
            message: 'Logout successful'
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'There was a problem, please try again later.'
        })
    }
}