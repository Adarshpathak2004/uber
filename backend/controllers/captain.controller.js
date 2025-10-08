const captainModel = require("../models/captain.model");
const captainService = require("../services/captain.service");
const { validationResult } = require('express-validator');
module.exports.registercaptain = async (req, res) => {
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