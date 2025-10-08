const userModel = require("../models/user.model");
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');
const BlacklistTokenmodel = require("../models/blacklisttoken.model");

module.exports.authuser = async (req, res, next) => {
    let token = null;
    // Check cookies first
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    } else {
        // Check Authorization header
        const authHeader = req.header('Authorization');
        if (authHeader) {
            const parts = authHeader.split(' ');
            if (parts.length === 2 && parts[0] === 'Bearer') {
                token = parts[1];
            }
        }
    }
    
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const blacklistedToken = await BlacklistTokenmodel.findOne({ token: token });
        if (blacklistedToken) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await userModel.findById(decoded._id);
        return next();
    } catch (err) {
        console.error('Auth middleware error:', err);
        return res.status(401).json({ message: 'Invalid token' });
    }
};