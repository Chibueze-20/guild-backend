const jwt = require('jsonwebtoken')
const Token = require('../models/Token');
require('dotenv').config();

const requireAuth = async (req, res, next) => {
    if (req.headers['authorization']) {
        try {
            let authorization = req.headers['authorization'].split(' ');
            if (authorization[0] !== 'Bearer') {
                res.status(401).json({
                    status: 'error',
                    message: 'Invalid request'
                });
            } else {
                const token = await Token.findOne({ token: authorization[1] });
                if (token) {
                    req.jwt = jwt.verify(authorization[1], process.env.GUILD_API_SECRET);
                    next();
                } else {
                    return res.status(403).json({
                        status: 'error',
                        message: 'User is logged out. Log in or sign up to access'
                    });
                }
            }
        } catch (err) {
            res.status(403).json({
                status: 'error',
                message: 'Valid request with an invalid token'
            });
        }
    } else {
        res.status(401).json({
            status: 'error',
            message: 'Invalid request'
        });
    }
}

module.exports = { requireAuth };