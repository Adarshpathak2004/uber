const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const blacklistTokenModel = require('../models/blacklistToken.model');
const captainModel = require('../models/captain.model');

module.exports.authuser = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        let token;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        } else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded._id).select('-password');
        if (!user) return res.status(401).json({ message: 'Invalid token' });

        req.user = user;
        return next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};
module.exports.authcaptain = async (req, res, next) => {
    const token = req.cookies?.token || req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({message: 'Access denied. No token provided.'});

    const isblacklisted = await blacklistTokenModel.findOne({ token: token });
    if (isblacklisted) return res.status(401).json({ message: 'Token is blacklisted. Please login again.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const captain = await captainModel.findById(decoded._id);
        if (!captain) return res.status(401).json({ message: 'Captain not found' });
        req.captain = captain;
        return next();
        
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}
