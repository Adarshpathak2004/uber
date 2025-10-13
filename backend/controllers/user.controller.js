const userModel = require("../models/user.model");
const userService = require("../services/user.service");
const { validationResult } = require('express-validator');

module.exports.registeruser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { fullname, email, password } = req.body;
        if (!fullname || !fullname.firstname) {
            return res.status(400).json({ message: 'fullname.firstname is required' });
        }

        // Hash password using model helper if service doesn't
        const hashedPassword = await userModel.hashPassword(password);
        let user;
        try {
            user = await userService.createUser({
                firstname: fullname.firstname,
                lastname: fullname.lastname,
                email,
                password: hashedPassword
            });
        } catch (createErr) {
            // Handle duplicate key (email already exists)
            if (createErr && createErr.code === 11000) {
                return res.status(409).json({ message: 'Email already exists' });
            }
            // If validation error from mongoose
            if (createErr && createErr.name === 'ValidationError') {
                return res.status(400).json({ message: createErr.message });
            }
            // rethrow other errors to be handled by outer catch
            throw createErr;
        }

        const token = user.generateAuthToken();
        // hide password field if present in doc
        if (user && user.password) user.password = undefined;
        res.status(201).json({ user, token });
    } catch (err) {
        // Log error for debugging and return 500 for unexpected errors
        console.error('Register user error:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports.loginuser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        const user = await userModel.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = user.generateAuthToken();
        // Hide password before sending
        user.password = undefined;
        res.status(200).json({ user, token });
    } catch (err) {
        next(err);
    }
};

module.exports.getUserProfile = async (req, res, next) => {
    try {
        if (!req.user) return res.status(404).json({ message: 'User not found' });
        const user = req.user;
        user.password = undefined;
        res.status(200).json({ user });
    } catch (err) {
        next(err);
    }
};

module.exports.logoutUser = async (req, res, next) => {
    // Simple logout - client should remove token. If using blacklist, implement here.
    res.status(200).json({ message: 'Logged out' });
};