const captainModel = require("../models/captain.model");
const captainService = require("../services/captain.service");
const blacklistTokenModel = require('../models/blacklistToken.model');
const { validationResult } = require('express-validator');
module.exports.registerCaptain = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { firstname, lastname, email, password, color, plate, capacity, vehicleType } = req.body;

        const isCaptainExists = await captainModel.findOne({ email });
        if (isCaptainExists) return res.status(409).json({ message: "Captain already exists" });

        const hashedPassword = await captainModel.hashPassword(password);

        const captain = await captainService.createCaptain({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            color,
            plate,
            capacity,
            vehicleType
        });

        const token = captain.generateAuthToken();
        res.status(201).json({ token, captain });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};
module.exports.loginCaptain = async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    
    const { email, password } = req.body;
    const captain = await captainModel.findOne({ email }).select('+password');
    if (!captain) return res.status(401).json({ message: 'Invalid email or password' });
    const isMatch = await captain.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });
    const token = captain.generateAuthToken();
    // set httpOnly cookie so clients can send it automatically
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
    res.status(200).json({ token, captain });
}
module.exports.getCaptainProfile = async (req, res) => {
    
    res.status(200).json({ captain : req.captain });
}
module.exports.logoutCaptain = async (req, res) => {
    const token = req.cookies?.token || req.header('Authorization')?.split(' ')[1];
    if (token) {
        // save to blacklist so token can't be used again
        await blacklistTokenModel.create({ token });
    }
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
}
