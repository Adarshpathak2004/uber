const userModel = require("../models/user.model");
const userService = require("../services/user.service");
const { validationResult } = require('express-validator');
const BlacklistTokenmodel=require("../models/blacklisttoken.model");

module.exports.registeruser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { fullname, email, password } = req.body;
        const hashedPassword = await userModel.hashPassword(password);

        const user = await userService.createUser({
            firstname: fullname?.firstname,
            lastname: fullname?.lastname,
            email,
            password: hashedPassword,
        });

        const token = user.generateAuthToken();
        // ensure password is not returned
        if (user.password) user.password = undefined;
        res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
        return res.status(201).json({ user, token });
    } catch (err) {
        // duplicate key (email)
        if (err.code === 11000) {
            return res.status(409).json({ error: 'Email already in use', code: err.code, keyValue: err.keyValue });
        }
        console.error('registeruser error:', err);
        return res.status(500).json({ error: 'Internal server error', message: 'Could not create user' });
    }
};

module.exports.loginuser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { email, password } = req.body;
        const user = await userModel.findOne({ email }).select('+password');
        if (!user) return res.status(401).json({ message: 'Invalid email or password' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

        const token = user.generateAuthToken();
        if (user.password) user.password = undefined;
        res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
        return res.status(200).json({ user, token });
    } catch (err) {
        console.error('loginuser error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports.getUserProfile = async (req, res, next) => {
  res.status(200).json({ user: req.user });
}
module.exports.logoutuser = async (req, res, next) => {
    res.clearCookie("token");
    const token=req.cookies.token || (req.header('Authorization') && req.header('Authorization').split(' ')[1]) ;
    return res.status(200).json({ message: 'Logged out successfully' });
}
