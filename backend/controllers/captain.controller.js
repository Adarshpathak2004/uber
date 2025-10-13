const captainModel = require("../models/captain.model");
const captainService = require("../services/captain.service");
const blacklistTokenModel = require('../models/blacklistToken.model');
const { validationResult } = require('express-validator');
module.exports.registerCaptain = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        // Accept nested payloads: { fullname: { firstname, lastname }, vehicle: { color, plate, capacity, vehicleType } }
        const fullname = req.body.fullname || {};
        const vehicle = req.body.vehicle || {};

        const firstname = fullname.firstname || req.body.firstname;
        const lastname = fullname.lastname || req.body.lastname;
        const email = req.body.email;
        const password = req.body.password;
        const color = vehicle.color || req.body.color;
        const plate = vehicle.plate || req.body.plate;
        const capacity = vehicle.capacity !== undefined ? Number(vehicle.capacity) : (req.body.capacity !== undefined ? Number(req.body.capacity) : undefined);
        const vehicleType = vehicle.vehicleType || req.body.vehicleType;

        // Basic server-side required checks (more detailed validation is handled by express-validator middleware)
        if (!firstname || !email || !password || !color || !plate || !capacity || !vehicleType) {
            return res.status(400).json({ message: 'Required fields missing' });
        }

        const isCaptainExists = await captainModel.findOne({ email });
        if (isCaptainExists) return res.status(409).json({ message: "Captain already exists" });

        const hashedPassword = await captainModel.hashPassword(password);

        let captain;
        try {
            captain = await captainService.createCaptain({
                firstname,
                lastname,
                email,
                password: hashedPassword,
                color,
                plate,
                capacity,
                vehicleType
            });
        } catch (createErr) {
            // forward validation errors or duplicate key
            if (createErr && createErr.code === 11000) {
                return res.status(409).json({ message: 'Captain already exists' });
            }
            if (createErr && createErr.message === 'Required fields missing') {
                return res.status(400).json({ message: createErr.message });
            }
            throw createErr;
        }

        const token = captain.generateAuthToken();
        res.status(201).json({ token, captain });
    } catch (err) {
        console.error('Register captain error:', err);
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
